/**
 * Auth Service Unit Tests
 *
 * Tests for user authentication, registration, token management, and logout.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock Prisma client before importing the service
vi.mock('../../lib/prisma.js', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    },
  };
});

// Import after mocking
import prisma from '../../lib/prisma.js';
import {
  register,
  login,
  refreshToken,
  logout,
  AuthError,
} from '../auth.service.js';

// ============================================================================
// Test Data Factories
// ============================================================================

const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  password: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // 'password123'
  name: 'Test User',
  role: 'user',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
  ...overrides,
});

// ============================================================================
// Register Tests
// ============================================================================

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('register()', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const email = 'newuser@example.com';
      const password = 'securePassword123';
      const name = 'New User';

      const mockCreatedUser = createMockUser({
        id: 'new-user-id',
        email: email.toLowerCase(),
        name,
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser);

      // Act
      const result = await register(email, password, name);

      // Assert
      expect(result.user.email).toBe(email.toLowerCase());
      expect(result.user.name).toBe(name);
      expect(result.user.role).toBe('user');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();

      // Verify Prisma calls
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: email.toLowerCase() },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: email.toLowerCase(),
          name,
        }),
        select: expect.objectContaining({
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }),
      });
    });

    it('should register a user without name', async () => {
      // Arrange
      const email = 'noname@example.com';
      const password = 'securePassword123';

      const mockCreatedUser = createMockUser({
        id: 'no-name-user-id',
        email: email.toLowerCase(),
        name: null,
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser);

      // Act
      const result = await register(email, password);

      // Assert
      expect(result.user.name).toBeNull();
      expect(result.tokens.accessToken).toBeDefined();
    });

    it('should throw AuthError when email already exists', async () => {
      // Arrange
      const existingEmail = 'existing@example.com';
      const existingUser = createMockUser({ email: existingEmail });

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);

      // Act & Assert
      await expect(register(existingEmail, 'password123')).rejects.toThrow(
        AuthError
      );

      await expect(register(existingEmail, 'password123')).rejects.toMatchObject(
        {
          code: 'EMAIL_EXISTS',
          statusCode: 409,
        }
      );
    });

    it('should hash the password before storing', async () => {
      // Arrange
      const email = 'hashtest@example.com';
      const password = 'plainTextPassword';

      const mockCreatedUser = createMockUser({
        email: email.toLowerCase(),
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser);

      const bcryptHashSpy = vi.spyOn(bcrypt, 'hash');

      // Act
      await register(email, password);

      // Assert
      expect(bcryptHashSpy).toHaveBeenCalledWith(password, 10);

      // Verify password stored is not plain text
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          password: expect.not.stringMatching(password),
        }),
        select: expect.any(Object),
      });
    });

    it('should normalize email to lowercase', async () => {
      // Arrange
      const email = 'MixedCase@EXAMPLE.com';

      const mockCreatedUser = createMockUser({
        email: email.toLowerCase(),
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser);

      // Act
      await register(email, 'password123');

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: email.toLowerCase() },
      });
    });
  });

  // ============================================================================
  // Login Tests
  // ============================================================================

  describe('login()', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';

      // Create a properly hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      const mockUser = createMockUser({
        email,
        password: hashedPassword,
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Act
      const result = await login(email, password);

      // Assert
      expect(result.user.email).toBe(email);
      expect(result.user.id).toBe(mockUser.id);
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();

      // Verify token structure (should be valid JWT)
      const decodedAccess = jwt.decode(result.tokens.accessToken) as {
        userId: string;
        type: string;
      };
      expect(decodedAccess.userId).toBe(mockUser.id);
      expect(decodedAccess.type).toBe('access');
    });

    it('should throw AuthError for non-existent email', async () => {
      // Arrange
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      // Act & Assert
      await expect(login('nonexistent@example.com', 'password123')).rejects.toThrow(
        AuthError
      );

      await expect(
        login('nonexistent@example.com', 'password123')
      ).rejects.toMatchObject({
        code: 'INVALID_CREDENTIALS',
        statusCode: 401,
      });
    });

    it('should throw AuthError for invalid password', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      const mockUser = createMockUser({
        password: hashedPassword,
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(login('test@example.com', 'wrongPassword')).rejects.toThrow(
        AuthError
      );

      await expect(
        login('test@example.com', 'wrongPassword')
      ).rejects.toMatchObject({
        code: 'INVALID_CREDENTIALS',
        statusCode: 401,
      });
    });

    it('should return same error message for invalid email and invalid password (prevent enumeration)', async () => {
      // Arrange - non-existent user
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      // Act
      let emailError: AuthError | null = null;
      try {
        await login('nonexistent@example.com', 'password123');
      } catch (e) {
        emailError = e as AuthError;
      }

      // Arrange - wrong password
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      const mockUser = createMockUser({ password: hashedPassword });
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      let passwordError: AuthError | null = null;
      try {
        await login('test@example.com', 'wrongPassword');
      } catch (e) {
        passwordError = e as AuthError;
      }

      // Assert - same message to prevent email enumeration
      expect(emailError?.message).toBe(passwordError?.message);
      expect(emailError?.message).toBe('Invalid email or password');
    });
  });

  // ============================================================================
  // Refresh Token Tests
  // ============================================================================

  describe('refreshToken()', () => {
    it('should refresh tokens successfully with valid refresh token', async () => {
      // Arrange
      const mockUser = createMockUser();

      // Create a valid refresh token
      const validRefreshToken = jwt.sign(
        { userId: mockUser.id, type: 'refresh', tokenVersion: 0 },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Act
      const result = await refreshToken(validRefreshToken);

      // Assert
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.accessToken).not.toBe(validRefreshToken);
      expect(result.refreshToken).not.toBe(validRefreshToken);
    });

    it('should throw AuthError for expired refresh token', async () => {
      // Arrange - create an expired token
      const expiredToken = jwt.sign(
        { userId: 'user-123', type: 'refresh', tokenVersion: 0 },
        process.env.JWT_SECRET!,
        { expiresIn: '-1s' } // Already expired
      );

      // Act & Assert
      await expect(refreshToken(expiredToken)).rejects.toThrow(AuthError);
      await expect(refreshToken(expiredToken)).rejects.toMatchObject({
        code: 'TOKEN_EXPIRED',
        statusCode: 401,
      });
    });

    it('should throw AuthError for invalid token signature', async () => {
      // Arrange - token signed with different secret
      const invalidToken = jwt.sign(
        { userId: 'user-123', type: 'refresh', tokenVersion: 0 },
        'wrong-secret-key',
        { expiresIn: '7d' }
      );

      // Act & Assert
      await expect(refreshToken(invalidToken)).rejects.toThrow(AuthError);
      await expect(refreshToken(invalidToken)).rejects.toMatchObject({
        code: 'INVALID_TOKEN',
        statusCode: 401,
      });
    });

    it('should throw AuthError for access token used as refresh token', async () => {
      // Arrange - create an access token (wrong type)
      const accessToken = jwt.sign(
        { userId: 'user-123', role: 'user', type: 'access' },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
      );

      // Act & Assert
      await expect(refreshToken(accessToken)).rejects.toThrow(AuthError);
      await expect(refreshToken(accessToken)).rejects.toMatchObject({
        code: 'INVALID_TOKEN',
        statusCode: 401,
      });
    });

    it('should throw AuthError for user not found', async () => {
      // Arrange
      const validRefreshToken = jwt.sign(
        { userId: 'deleted-user-id', type: 'refresh', tokenVersion: 0 },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      // Act & Assert
      await expect(refreshToken(validRefreshToken)).rejects.toThrow(AuthError);
      await expect(refreshToken(validRefreshToken)).rejects.toMatchObject({
        code: 'USER_NOT_FOUND',
        statusCode: 401,
      });
    });
  });

  // ============================================================================
  // Logout Tests
  // ============================================================================

  describe('logout()', () => {
    it('should logout successfully with valid token', async () => {
      // Arrange
      const validRefreshToken = jwt.sign(
        { userId: 'user-123', type: 'refresh', tokenVersion: 0 },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Act
      await expect(logout(validRefreshToken)).resolves.not.toThrow();
    });

    it('should not throw error for invalid token (logout should be idempotent)', async () => {
      // Arrange
      const invalidToken = 'clearly.invalid.token';

      // Act & Assert - logout should succeed silently for invalid tokens
      await expect(logout(invalidToken)).resolves.not.toThrow();
    });

    it('should not throw error for expired token', async () => {
      // Arrange
      const expiredToken = jwt.sign(
        { userId: 'user-123', type: 'refresh', tokenVersion: 0 },
        process.env.JWT_SECRET!,
        { expiresIn: '-1s' }
      );

      // Act & Assert - logout should succeed for expired tokens
      await expect(logout(expiredToken)).resolves.not.toThrow();
    });

    it('should invalidate the token after logout', async () => {
      // Arrange
      const mockUser = createMockUser();
      const validRefreshToken = jwt.sign(
        { userId: mockUser.id, type: 'refresh', tokenVersion: 0 },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Act - logout first
      await logout(validRefreshToken);

      // Assert - using the same token should fail
      // Note: We need to test token rotation, not just invalidation
      // After logout, the token version is incremented, so old tokens become invalid
      await expect(refreshToken(validRefreshToken)).rejects.toThrow(AuthError);
    });
  });

  // ============================================================================
  // AuthError Tests
  // ============================================================================

  describe('AuthError', () => {
    it('should create error with correct properties', () => {
      // Act
      const error = new AuthError('Test error message', 'TEST_CODE', 403);

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthError);
      expect(error.message).toBe('Test error message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.statusCode).toBe(403);
      expect(error.name).toBe('AuthError');
    });

    it('should default statusCode to 400', () => {
      // Act
      const error = new AuthError('Test error', 'TEST_CODE');

      // Assert
      expect(error.statusCode).toBe(400);
    });
  });
});
