/**
 * Shared type definitions for the Beads Pattern demo.
 *
 * All three beads use these types to ensure consistent data flow.
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
