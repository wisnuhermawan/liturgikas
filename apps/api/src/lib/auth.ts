import { SignJWT, jwtVerify } from 'jose';
import { Scrypt } from 'oslo/password';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const scrypt = new Scrypt();

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Hash password using Scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await scrypt.hash(password);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return await scrypt.verify(hash, password);
}

/**
 * Create JWT token
 */
export async function createToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;

  // Support both "Bearer token" and just "token"
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  return authHeader;
}
