import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { VoiceConfig, DEFAULT_VOICE_CONFIG, VoiceState } from '../models/voice-chat.model';

declare var webkitSpeechRecognition: any;

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class VoiceChatService {
  private recognition: any;
  private synthesis = window.speechSynthesis;
  
  private voiceState$ = new BehaviorSubject<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isSupported: this.isSupported(),
    hasPermission: false,
  });

  private transcriptionSubject$ = new Subject<string>();
  private errorSubject$ = new Subject<string>();

  constructor() {
    this.initializeRecognition();
    this.setupConnectionListeners();
  }

  /**
   * Configura listeners para detectar mudanças na conexão
   */
  private setupConnectionListeners(): void {
    window.addEventListener('online', () => {
      // Limpa erro de conexão quando volta online
      if (this.voiceState$.value.error?.includes('conexão') || 
          this.voiceState$.value.error?.includes('internet')) {
        this.updateState({ error: undefined });
      }
    });

    window.addEventListener('offline', () => {
      if (this.voiceState$.value.isListening) {
        this.stopListening();
        this.updateState({ 
          error: 'Conexão perdida. O reconhecimento de voz requer internet.',
          isListening: false 
        });
      }
    });
  }

  /**
   * Verifica se o navegador suporta Web Speech API
   */
  isSupported(): boolean {
    return (
      'SpeechRecognition' in window ||
      'webkitSpeechRecognition' in window
    ) && 'speechSynthesis' in window;
  }

  /**
   * Obtém o estado atual da voz
   */
  getVoiceState(): Observable<VoiceState> {
    return this.voiceState$.asObservable();
  }

  /**
   * Inicializa o Speech Recognition
   */
  private initializeRecognition(): void {
    if (!this.isSupported()) {
      this.updateState({ error: 'Seu navegador não suporta reconhecimento de voz' });
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        this.updateState({ error: 'Reconhecimento de voz não disponível' });
        return;
      }
      
      this.recognition = new SpeechRecognition();
      
      this.recognition.lang = 'pt-BR';
      this.recognition.continuous = false; // Para após pausa
      this.recognition.interimResults = true; // Resultados intermediários
      this.recognition.maxAlternatives = 1;
    } catch (error: any) {
      this.updateState({ error: 'Erro ao inicializar reconhecimento de voz' });
      return;
    }

    // Event handlers
    this.recognition.onstart = () => {
      this.updateState({ isListening: true, error: undefined });
    };

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.transcriptionSubject$.next(finalTranscript.trim());
      } else if (interimTranscript) {
        // Enviar resultado intermediário se necessário
        this.transcriptionSubject$.next(interimTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      let errorMessage = 'Erro ao processar áudio';
      let shouldEmitError = true;
      
      switch (event.error) {
        case 'no-speech':
          // Não é um erro crítico, apenas não detectou fala
          errorMessage = 'Nenhuma fala detectada. Tente novamente.';
          break;
        case 'audio-capture':
          errorMessage = 'Microfone não encontrado. Verifique se o microfone está conectado.';
          break;
        case 'not-allowed':
          errorMessage = 'Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do navegador.';
          this.updateState({ hasPermission: false });
          break;
        case 'network':
          errorMessage = 'Erro de conexão. O reconhecimento de voz requer conexão com a internet. Verifique sua conexão e tente novamente.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Serviço de reconhecimento de voz não disponível. Verifique sua conexão com a internet.';
          break;
        case 'bad-grammar':
          errorMessage = 'Erro na configuração de reconhecimento.';
          break;
        case 'language-not-supported':
          errorMessage = 'Idioma não suportado.';
          break;
        case 'aborted':
          // Usuário cancelou ou parou manualmente, não é erro
          shouldEmitError = false;
          return;
        default:
          errorMessage = `Erro ao processar áudio: ${event.error}. Verifique sua conexão com a internet.`;
      }

      if (shouldEmitError) {
        this.errorSubject$.next(errorMessage);
        this.updateState({ isListening: false, error: errorMessage });
      }
    };

    this.recognition.onend = () => {
      this.updateState({ isListening: false });
    };
  }

  /**
   * Verifica se há conexão com a internet
   */
  private checkInternetConnection(): boolean {
    return navigator.onLine;
  }

  /**
   * Solicita permissão e inicia a captura de voz
   */
  startListening(): Observable<string> {
    return new Observable(observer => {
      if (!this.isSupported()) {
        observer.error('Reconhecimento de voz não suportado neste navegador. Use Chrome, Edge ou Safari.');
        return;
      }

      // Verificar conexão com internet
      if (!this.checkInternetConnection()) {
        const errorMsg = 'Sem conexão com a internet. O reconhecimento de voz requer conexão ativa.';
        observer.error(errorMsg);
        this.updateState({ error: errorMsg });
        return;
      }

      // Solicitar permissão de microfone
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          this.updateState({ hasPermission: true });
          
          // Verificar novamente a conexão antes de iniciar
          if (!this.checkInternetConnection()) {
            const errorMsg = 'Conexão perdida. Verifique sua internet e tente novamente.';
            observer.error(errorMsg);
            this.updateState({ error: errorMsg });
            return;
          }
          
          // Iniciar reconhecimento
          try {
            // Reinicializar recognition se necessário
            if (!this.recognition) {
              this.initializeRecognition();
            }
            
            this.recognition.start();
            
            // Escutar transcrições
            const subscription = this.transcriptionSubject$.subscribe({
              next: (text) => {
                if (text) {
                  observer.next(text);
                }
              },
            });

            // Escutar erros
            const errorSubscription = this.errorSubject$.subscribe({
              next: (error) => {
                observer.error(error);
              },
            });

            // Cleanup ao parar
            this.recognition.onend = () => {
              subscription.unsubscribe();
              errorSubscription.unsubscribe();
              this.updateState({ isListening: false });
            };
          } catch (error: any) {
            observer.error(error.message || 'Erro ao iniciar reconhecimento');
          }
        })
        .catch((error) => {
          const errorMessage = error.name === 'NotAllowedError' 
            ? 'Permissão de microfone negada'
            : 'Erro ao acessar microfone';
          this.updateState({ hasPermission: false, error: errorMessage });
          observer.error(errorMessage);
        });
    });
  }

  /**
   * Para a captura de voz
   */
  stopListening(): void {
    if (this.recognition && this.voiceState$.value.isListening) {
      this.recognition.stop();
      this.updateState({ isListening: false });
    }
  }

  /**
   * Cancela a captura de voz
   */
  abortListening(): void {
    if (this.recognition && this.voiceState$.value.isListening) {
      this.recognition.abort();
      this.updateState({ isListening: false });
    }
  }

  /**
   * Converte texto em fala (Text-to-Speech)
   */
  speak(text: string, config: Partial<VoiceConfig> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject('Síntese de voz não suportada');
        return;
      }

      // Para qualquer fala anterior
      this.stopSpeaking();

      const finalConfig = { ...DEFAULT_VOICE_CONFIG, ...config };
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = finalConfig.language;
      utterance.rate = finalConfig.speechRate;
      utterance.pitch = finalConfig.speechPitch;
      utterance.volume = finalConfig.speechVolume;

      // Tentar encontrar voz em português
      const voices = this.synthesis.getVoices();
      const ptVoice = voices.find((v: SpeechSynthesisVoice) => 
        v.lang.startsWith('pt') && (finalConfig.voiceName ? v.name === finalConfig.voiceName : true)
      );
      
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      utterance.onstart = () => {
        this.updateState({ isSpeaking: true });
      };

      utterance.onend = () => {
        this.updateState({ isSpeaking: false });
        resolve();
      };

      utterance.onerror = (event: any) => {
        this.updateState({ isSpeaking: false, error: 'Erro ao reproduzir áudio' });
        reject(event.error);
      };

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Para a reprodução de voz
   */
  stopSpeaking(): void {
    if (this.synthesis && this.voiceState$.value.isSpeaking) {
      this.synthesis.cancel();
      this.updateState({ isSpeaking: false });
    }
  }

  /**
   * Pausa a reprodução de voz
   */
  pauseSpeaking(): void {
    if (this.synthesis && this.voiceState$.value.isSpeaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume a reprodução de voz
   */
  resumeSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * Obtém lista de vozes disponíveis
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) {
      return [];
    }
    return this.synthesis.getVoices();
  }

  /**
   * Obtém vozes em português
   */
  getPortugueseVoices(): SpeechSynthesisVoice[] {
    return this.getAvailableVoices().filter(voice => voice.lang.startsWith('pt'));
  }

  /**
   * Atualiza o estado interno
   */
  private updateState(updates: Partial<VoiceState>): void {
    const currentState = this.voiceState$.value;
    this.voiceState$.next({ ...currentState, ...updates });
  }
}

