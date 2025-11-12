import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import * as schema from '@catholic-platform/database/schema';
import { verifyPassword, createToken } from '../lib/auth';
import { authMiddleware, AuthEnv } from '../middleware/auth';

const auth = new Hono<AuthEnv>();

// Initialize database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().optional(),
});

/**
 * POST /auth/login
 * Login with email and password
 */
auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  try {
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) {
      return c.json(
        {
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        },
        401
      );
    }

    // Check if user is active
    if (user.status !== 'active') {
      return c.json(
        {
          success: false,
          error: 'Account disabled',
          message: 'Your account has been disabled. Please contact support.',
        },
        403
      );
    }

    // Verify password
    const isValid = await verifyPassword(user.passwordHash, password);

    if (!isValid) {
      return c.json(
        {
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        },
        401
      );
    }

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Update last login time
    await db
      .update(schema.users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, user.id));

    // Create session record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await db.insert(schema.sessions).values({
      userId: user.id,
      token,
      expiresAt,
      userAgent: c.req.header('User-Agent') || null,
      ipAddress: c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || null,
    });

    return c.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatar: user.avatar,
        },
      },
      message: 'Login successful',
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json(
      {
        success: false,
        error: 'Login failed',
        message: error.message,
      },
      500
    );
  }
});

/**
 * POST /auth/logout
 * Logout and invalidate session
 */
auth.post('/logout', authMiddleware, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.split(' ')[1] || authHeader;

    if (token) {
      // Delete session from database
      await db.delete(schema.sessions).where(eq(schema.sessions.token, token));
    }

    return c.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: 'Logout failed',
        message: error.message,
      },
      500
    );
  }
});

/**
 * GET /auth/me
 * Get current authenticated user
 */
auth.get('/me', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user');

    // Fetch full user details from database
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, currentUser.userId),
      columns: {
        passwordHash: false, // Exclude password hash
      },
    });

    if (!user) {
      return c.json(
        {
          success: false,
          error: 'User not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: 'Failed to fetch user',
        message: error.message,
      },
      500
    );
  }
});

/**
 * GET /auth/sessions
 * Get all active sessions for current user
 */
auth.get('/sessions', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user');

    const sessions = await db.query.sessions.findMany({
      where: eq(schema.sessions.userId, currentUser.userId),
      orderBy: (sessions, { desc }) => [desc(sessions.createdAt)],
    });

    return c.json({
      success: true,
      data: sessions.map((s) => ({
        id: s.id,
        userAgent: s.userAgent,
        ipAddress: s.ipAddress,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        isCurrent: s.token === c.req.header('Authorization')?.split(' ')[1],
      })),
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: 'Failed to fetch sessions',
        message: error.message,
      },
      500
    );
  }
});

/**
 * DELETE /auth/sessions/:id
 * Revoke a specific session
 */
auth.delete('/sessions/:id', authMiddleware, async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'));
    const currentUser = c.get('user');

    // Verify session belongs to current user
    const session = await db.query.sessions.findFirst({
      where: eq(schema.sessions.id, sessionId),
    });

    if (!session || session.userId !== currentUser.userId) {
      return c.json(
        {
          success: false,
          error: 'Session not found',
        },
        404
      );
    }

    await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));

    return c.json({
      success: true,
      message: 'Session revoked successfully',
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: 'Failed to revoke session',
        message: error.message,
      },
      500
    );
  }
});

export default auth;
