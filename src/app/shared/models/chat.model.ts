import { Timestamp } from 'firebase/firestore';

/**
 * Represents a chat session between a user and a character
 */
export interface Chat {
  /** Unique identifier for the chat */
  id: string;

  /** ID of the user participating in the chat */
  userId: string;

  /** ID of the character participating in the chat */
  characterId: string;

  /** Title or topic of the chat (auto-generated or user-defined) */
  title: string;

  /** Array of message IDs (references to messages stored separately) */
  messageIds: string[];

  /** Timestamp of when the chat was created */
  createdAt: Timestamp;

  /** Timestamp of the last message in the chat */
  updatedAt: Timestamp;

  /** Whether the chat is currently active */
  isActive: boolean;

  /** Whether the chat is archived (hidden from main view but not deleted) */
  isArchived: boolean;

  /** Number of unread messages in the chat */
  unreadCount: number;

  /** Optional tags for categorizing chats */
  tags?: string[];

  /** Optional custom data for future extensibility */
  metadata?: Record<string, unknown>;
}
