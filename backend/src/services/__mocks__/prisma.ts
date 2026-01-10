/**
 * Prisma Client Mock
 *
 * Mock implementation of the Prisma client for unit testing.
 * Each method returns a mock function that can be configured per test.
 */

import { vi } from 'vitest';

// Mock user data factory
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id-123',
  email: 'test@example.com',
  password: '$2a$10$hashedpassword123456789012345678901234567890', // bcrypt hash mock
  name: 'Test User',
  role: 'user',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
  ...overrides,
});

// Mock Prisma client
const prismaMock = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  prompt: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  $transaction: vi.fn((fn) => fn(prismaMock)),
};

export default prismaMock;
