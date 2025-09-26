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
}
