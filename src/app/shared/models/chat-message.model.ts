import { Timestamp } from 'firebase/firestore';

export interface MessageReaction {
  /** Emoji or reaction identifier */
  emoji: string;
  /** User IDs who used this reaction */
  userIds: string[];
}

/**
 * Represents a single message in a chat conversation
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;

  /** The ID of the chat this message belongs to */
  chatId: string;

  /** The content of the message */
  content: string;

  /** The ID of the sender (user or character) */
  senderId: string;

  /** Whether the sender is a user (true) or a character (false) */
  isFromUser: boolean;

  /** Display name of the sender (for display purposes) */
  senderName: string;

  /** Optional quote that this message is based on */
  quote?: string;

  /** Reference to the message being replied to, if any */
  replyToMessageId?: string;

  /** Timestamp of when the message was sent */
  timestamp: Timestamp;

  /** When the message was last edited, if edited */
  editedAt?: Timestamp;

  /** Whether the message has been read by the recipient */
  isRead: boolean;

  /** Whether the message has been delivered to the server */
  isDelivered: boolean;

  /** Reactions to this message */
  reactions?: MessageReaction[];

  /** Optional metadata for the message */
  metadata?: {
    /** For AI-generated messages, the model/temperature used */
    generationParams?: Record<string, unknown>;
    /** Any other custom data */
    [key: string]: unknown;
  };

  /** System message type (e.g., 'system', 'error', 'info') */
  type?: 'user' | 'character' | 'system' | 'error' | 'info';
}
