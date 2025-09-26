import { Timestamp } from 'firebase/firestore';

/**
 * Represents a single message in a chat conversation
 */
export interface ChatMessage {
  /** The ID of the chat */
  chatId: string;

  /** The content of the message */
  content: string;

  /** The ID of the sender (user or character) */
  senderId: string;

  /** Whether the sender is a user (true) or a character (false) */
  isFromUser: boolean;

  /** Optional quote that this message is based on */
  quote?: string;

  /** Timestamp of when the message was sent */
  timestamp: Timestamp;
}
