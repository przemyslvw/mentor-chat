import { Timestamp } from 'firebase/firestore';

/**
 * Character model representing a mentor/character in the application
 */
export interface Character {
  /** Unique identifier for the character */
  id: string;

  /** Name of the character */
  name: string;

  /** Description or bio of the character */
  description: string;

  /** Array of quotes associated with the character */
  quotes: string[];

  /** URL to the character's avatar/image */
  avatarUrl?: string;

  /** When the character was created */
  createdAt: Timestamp;

  /** When the character was last updated */
  updatedAt: Timestamp;

  /** Whether the character is active and visible in the app */
  isActive: boolean;

  /** Category or type of the character (e.g., 'scientist', 'historian', 'fictional') */
  category?: string;

  /** Popularity or usage counter */
  popularity?: number;
}
