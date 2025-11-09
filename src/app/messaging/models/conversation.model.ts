export type MessageAuthor = 'agent' | 'client' | 'assistant';
export type MessageType = 'text' | 'image' | 'audio' | 'file';

export interface AssistantContextMessage {
  id: string;
  author: MessageAuthor;
  type: MessageType;
  content?: string;
  timestamp: string;
}

export interface ContactProfile {
  displayName: string;
  nickname?: string;
  status?: string;
  phoneNumber: string;
  temporaryMessages?: 'enabled' | 'disabled';
  avatarUrl?: string;
}

export interface Message {
  id: string;
  author: MessageAuthor;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  contactName: string;
  contactNumber: string;
  avatarColor?: string;
  avatarUrl?: string;
  lastMessagePreview: string;
  lastMessageTime: string;
  unreadCount?: number;
  messages: Message[];
  profile?: ContactProfile;
}

