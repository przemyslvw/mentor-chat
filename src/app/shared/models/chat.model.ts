import { Timestamp } from 'firebase/firestore';
import { ChatMessage } from './chat-message.model';

/**
 * Represents a chat session between a user and a character
 */
export interface Chat {
  /** ID of the user participating in the chat */
  userId: string;

  /** ID of the character participating in the chat */
  characterId: string;

  /** Array of messages in the conversation */
  messages: ChatMessage[];

  /** Timestamp of when the chat was created */
  createdAt: Timestamp;

  /** Timestamp of the last message in the chat */
  updatedAt: Timestamp;

  /** Whether the chat is currently active */
  isActive: boolean;
}
