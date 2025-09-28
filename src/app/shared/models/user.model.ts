import { Timestamp } from 'firebase/firestore';

/**
 * User model representing a user in the application
 */
export interface User {
  /** Unique identifier for the user */
  id: string;

  /** User's email address */
  email: string;

  /** User's display name */
  name: string;

  /** Additional context about the user */
  context?: string;

  /** When the user account was created */
  createdAt: Timestamp;

  /** When the user was last updated */
  updatedAt: Timestamp;

  /** Whether the user account is active */
  isActive: boolean;
}
