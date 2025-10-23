/**
 * User model representing a user in the application
 */
export interface UserMetadata {
  creationTime?: string;
  lastSignInTime?: string;
  [key: string]: string | undefined;
}

export interface UserCustomClaims {
  admin?: boolean;
  [key: string]: string | number | boolean | null | undefined | string[] | number[] | boolean[];
}

export interface User {
  /** User's unique identifier */
  uid: string;

  /** User's email address */
  email: string | null;

  /** User's display name */
  displayName: string | null;

  /** User's photo URL */
  photoURL?: string;

  /** Whether the user is an administrator */
  isAdmin?: boolean;

  /** Additional metadata */
  metadata?: UserMetadata;

  /** Additional custom claims */
  customClaims?: UserCustomClaims;

  /** Email verification status */
  emailVerified?: boolean;

  /** Provider data */
  providerData?: {
    uid: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    providerId: string;
  }[];
}
