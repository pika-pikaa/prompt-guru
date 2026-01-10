/**
 * Test Setup File
 *
 * Configures mocks and test environment before each test run.
 */

import { vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key-for-unit-tests';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.NODE_ENV = 'test';

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Cleanup after each test
afterEach(() => {
  vi.restoreAllMocks();
});
