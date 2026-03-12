/**
 * Shared type definitions for the Claude Tasks demo.
 *
 * All three tasks use these types to ensure consistent data flow.
 * These types serve as the "contract" between tasks in the dependency chain.
 */

export interface User {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface ValidationResult {
  valid: User[];
  invalid: Array<{
    user: Record<string, string>;
    errors: string[];
  }>;
}

export interface DeduplicationResult {
  unique: User[];
  duplicates: User[];
}
