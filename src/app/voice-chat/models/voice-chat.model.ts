export interface VoiceMessage {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
  audioUrl?: string; // Para armazenar áudio se necessário
}

export interface VoiceConfig {
  language: string;
  speechRate: number; // 0.1 a 10
  speechPitch: number; // 0 a 2
  speechVolume: number; // 0 a 1
  voiceName?: string;
}

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  hasPermission: boolean;
  error?: string;
}

export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  language: 'pt-BR',
  speechRate: 1.0,
  speechPitch: 1.0,
  speechVolume: 1.0,
};

