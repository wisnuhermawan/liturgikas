import { Context, Next } from 'hono';
import { verifyToken, extractToken } from '../lib/auth';

export interface AuthEnv {
  Variables: {
    user: {
      userId: number;
      email: string;
      role: string;
    };
  };
}

/**
 * Middleware to verify JWT token and attach user to context
 */
export async function authMiddleware(c: Context<AuthEnv>, next: Next) {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);

  if (!token) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'No token provided',
      },
      401
    );
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      },
      401
    );
  }

  // Attach user to context
  c.set('user', payload);

  await next();
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(...roles: string[]) {
  return async (c: Context<AuthEnv>, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required',
        },
        401
      );
    }

    if (!roles.includes(user.role)) {
      return c.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'Insufficient permissions',
        },
        403
      );
    }

    await next();
  };
}

/**
 * Optional auth middleware - attach user if token is valid, but don't require it
 */
export async function optionalAuth(c: Context<AuthEnv>, next: Next) {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      c.set('user', payload);
    }
  }

  await next();
}
