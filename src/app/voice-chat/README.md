# Módulo de Chat por Voz

Este módulo fornece funcionalidades de conversa por voz usando apenas ferramentas gratuitas e nativas do navegador.

## Funcionalidades

- **Speech-to-Text (STT)**: Converte fala em texto usando Web Speech API
- **Text-to-Speech (TTS)**: Converte texto em fala usando Web Speech API
- **Integração com IA**: Chat com assistente de IA (atualmente com respostas mockadas)
- **Controle de Voz**: Componente visual para ativar/desativar gravação

## Requisitos

- Navegador moderno com suporte a Web Speech API (Chrome, Edge, Safari)
- Permissão de microfone do usuário
- Conexão com internet (para Speech Recognition)

## Estrutura

```
voice-chat/
  components/
    voice-control/          # Componente de controle de voz
  models/
    voice-chat.model.ts    # Interfaces e tipos
  services/
    voice-chat.service.ts  # Serviço principal de voz
    ai-chat.service.ts     # Serviço de chat com IA
```

## Uso

### No componente admin:

```typescript
import { VoiceControlComponent } from '../voice-chat/components/voice-control/voice-control.component';
import { VoiceChatService } from '../voice-chat/services/voice-chat.service';
import { AIChatService } from '../voice-chat/services/ai-chat.service';

// No template:
<app-voice-control
  (transcription)="handleVoiceTranscription($event)"
  (error)="handleVoiceError($event)"
></app-voice-control>
```

## APIs Utilizadas

### Web Speech API (Nativa do Navegador)

- **SpeechRecognition**: Para reconhecimento de voz (STT)
- **SpeechSynthesis**: Para síntese de voz (TTS)

Ambas são gratuitas e não requerem API keys ou serviços externos.

## Limitações

1. **Suporte de Navegadores**: 
   - Chrome/Edge: Suporte completo
   - Firefox: Não suporta SpeechRecognition
   - Safari: Suporte limitado

2. **Reconhecimento de Voz**: 
   - Requer conexão com internet (processamento na nuvem do Google)
   - Qualidade varia com ambiente e microfone

3. **Síntese de Voz**:
   - Vozes disponíveis dependem do sistema operacional
   - Qualidade varia entre navegadores

## Futuras Melhorias

- Integração com APIs gratuitas de IA (Hugging Face, Groq, etc.)
- Suporte a múltiplos idiomas
- Configurações avançadas de voz
- Histórico de conversas por voz
- Comandos de voz para controle do sistema

