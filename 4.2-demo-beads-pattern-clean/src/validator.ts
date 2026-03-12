/**
 * Bead 2: Validator
 *
 * Validate each parsed user object.
 *
 * TODO: Implement this function to pass all tests in tests/bead-2-validator.test.ts
 *
 * Validation Rules:
 * - Email: must match ^[^\s@]+@[^\s@]+\.[^\s@]+$
 * - Role: must be 'admin', 'editor', or 'viewer'
 * - Name: must be non-empty after trimming
 *
 * Returns: { valid: User[], invalid: { user, errors }[] }
 */

import { User, ValidationResult } from './types';

export function validateUsers(users: Record<string, string>[]): ValidationResult {
  // TODO: Implement user validation
  throw new Error('Bead 2 not implemented — implement validateUsers to pass all tests');
}
