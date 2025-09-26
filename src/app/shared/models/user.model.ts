/**
 * User model representing a user in the application
 */
export interface User {
  /** User's email address */
  email: string;

  /** User's display name */
  name: string;

  /** Additional context about the user */
  context?: string;
}
