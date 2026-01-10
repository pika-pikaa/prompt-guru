import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

// Configuration constants
const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '15m';
const REFRESH_TOKEN_EXPIRES: SignOptions['expiresIn'] =
  (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']) || '7d';

// Token payload interfaces
interface AccessTokenPayload {
  userId: string;
  role: string;
  type: 'access';
}

interface RefreshTokenPayload {
  userId: string;
  type: 'refresh';
  tokenVersion: number;
}

// Service response types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
}

// Custom error class for auth-specific errors
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// In-memory store for invalidated refresh tokens
// In production, use Redis or database table for token blacklist
const invalidatedTokens = new Set<string>();

// Token version tracking per user (for refresh token rotation)
// In production, store this in the database
const userTokenVersions = new Map<string, number>();

/**
 * Get the current token version for a user
 */
const getTokenVersion = (userId: string): number => {
  return userTokenVersions.get(userId) ?? 0;
};

/**
 * Increment the token version for a user (invalidates all old refresh tokens)
 */
const incrementTokenVersion = (userId: string): number => {
  const currentVersion = getTokenVersion(userId);
  const newVersion = currentVersion + 1;
  userTokenVersions.set(userId, newVersion);
  return newVersion;
};

/**
 * Get JWT secret from environment with validation
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AuthError('JWT_SECRET nie jest skonfigurowany', 'CONFIG_ERROR', 500);
  }
  return secret;
};

/**
 * Generate access token for authenticated user
 */
const generateAccessToken = (userId: string, role: string): string => {
  const payload: AccessTokenPayload = {
    userId,
    role,
    type: 'access',
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
};

/**
 * Generate refresh token for token renewal
 */
const generateRefreshToken = (userId: string): string => {
  const tokenVersion = getTokenVersion(userId);

  const payload: RefreshTokenPayload = {
    userId,
    type: 'refresh',
    tokenVersion,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
};

/**
 * Register a new user
 * @param email - User's email address
 * @param password - Plain text password (will be hashed)
 * @param name - Optional user name
 * @returns Created user info and auth tokens
 */
export const register = async (
  email: string,
  password: string,
  name?: string
): Promise<{ user: UserInfo; tokens: AuthTokens }> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new AuthError('Uzytkownik z tym adresem email juz istnieje', 'EMAIL_EXISTS', 409);
  }

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user in database
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const tokens: AuthTokens = {
    accessToken: generateAccessToken(user.id, user.role),
    refreshToken: generateRefreshToken(user.id),
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
    tokens,
  };
};

/**
 * Authenticate user with email and password
 * @param email - User's email address
 * @param password - Plain text password
 * @returns Auth tokens on successful login
 */
export const login = async (
  email: string,
  password: string
): Promise<{ user: UserInfo; tokens: AuthTokens }> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Use generic message to prevent email enumeration
    throw new AuthError('Nieprawidlowy email lub haslo', 'INVALID_CREDENTIALS', 401);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new AuthError('Nieprawidlowy email lub haslo', 'INVALID_CREDENTIALS', 401);
  }

  // Generate new tokens
  const tokens: AuthTokens = {
    accessToken: generateAccessToken(user.id, user.role),
    refreshToken: generateRefreshToken(user.id),
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
    tokens,
  };
};

/**
 * Refresh access token using refresh token
 * Implements refresh token rotation for security
 * @param refreshToken - Current refresh token
 * @returns New access and refresh tokens
 */
export const refreshToken = async (
  token: string
): Promise<AuthTokens> => {
  // Check if token has been invalidated
  if (invalidatedTokens.has(token)) {
    throw new AuthError('Token zostal uniewazniowy', 'TOKEN_INVALIDATED', 401);
  }

  let payload: RefreshTokenPayload;

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as RefreshTokenPayload;

    // Verify it's a refresh token
    if (decoded.type !== 'refresh') {
      throw new AuthError('Nieprawidlowy typ tokenu', 'INVALID_TOKEN', 401);
    }

    payload = decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError('Token odswiezania wygasl', 'TOKEN_EXPIRED', 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError('Nieprawidlowy token odswiezania', 'INVALID_TOKEN', 401);
    }
    throw error;
  }

  // Verify token version (for rotation)
  const currentVersion = getTokenVersion(payload.userId);
  if (payload.tokenVersion !== currentVersion) {
    // Token version mismatch - possible token reuse attack
    // Invalidate all tokens for this user
    incrementTokenVersion(payload.userId);
    throw new AuthError(
      'Token zostal zrotowany. Zaloguj sie ponownie.',
      'TOKEN_ROTATED',
      401
    );
  }

  // Find user to get current role
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new AuthError('Nie znaleziono uzytkownika', 'USER_NOT_FOUND', 401);
  }

  // Invalidate the old refresh token
  invalidatedTokens.add(token);

  // Increment token version for rotation
  incrementTokenVersion(payload.userId);

  // Generate new tokens
  return {
    accessToken: generateAccessToken(user.id, user.role),
    refreshToken: generateRefreshToken(user.id),
  };
};

/**
 * Logout user by invalidating their refresh token
 * @param refreshToken - Refresh token to invalidate
 */
export const logout = async (token: string): Promise<void> => {
  // Add token to invalidated set
  invalidatedTokens.add(token);

  // Verify and decode the token to get user ID
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as RefreshTokenPayload;

    if (decoded.type === 'refresh') {
      // Increment token version to invalidate all refresh tokens for this user
      incrementTokenVersion(decoded.userId);
    }
  } catch {
    // Token might be expired or invalid, but we still want to blacklist it
    // This is intentionally silent - logout should always succeed from user's perspective
  }
};

/**
 * Clear expired tokens from invalidated set (cleanup job)
 * Should be called periodically in production
 */
export const cleanupInvalidatedTokens = (): void => {
  const secret = getJwtSecret();

  for (const token of invalidatedTokens) {
    try {
      jwt.verify(token, secret);
    } catch {
      // Token is expired or invalid, safe to remove
      invalidatedTokens.delete(token);
    }
  }
};

// Auth service object for import convenience
const authService = {
  register,
  login,
  refreshToken,
  logout,
  cleanupInvalidatedTokens,
  AuthError,
};

export default authService;
