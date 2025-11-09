# EasyTalk

## Visão Geral

O EasyTalk é o portal web que permitirá às equipes da empresa atender clientes via WhatsApp de forma centralizada, espelhando a experiência do WhatsApp Web, porém com recursos próprios de CRM. O front-end, construído em Angular, consumirá um backend proprietário que fará a ponte com as APIs oficiais do WhatsApp Business.

### Objetivos Principais

- Gerenciar múltiplas conversas simultâneas com clientes.
- Enviar e receber mensagens em tempo real (texto, mídia, status).
- Oferecer visão consolidada do histórico e informações do contato.
- Facilitar o trabalho de atendimento com ações rápidas, filtros e métricas.

## Escopo Inicial do Front-end

- **Autenticação e autorização**: fluxo de login conectado ao backend, com guarda de rotas e interceptadores HTTP.
- **Módulo de Conversas (MessagingModule)**: encapsula layout, componentes e serviços relacionados ao atendimento; futuro ponto de entrada para múltiplos canais.
- **Mocks controlados**: pasta dedicada (`src/app/mocks/messaging`) para simular dados e serviços enquanto o backend é integrado, permitindo desenvolvimento paralelo.
- **Comunicação em tempo real**: abstrações preparadas para WebSocket ou SSE, inicialmente operando com mocks.
- **UI com Angular Material**: layout inspirado no WhatsApp Web (lista de conversas, painel de mensagens, detalhes do contato) com tema customizado.
- **Estratégia de estado**: uso de serviços com RxJS ou `ComponentStore` dentro do módulo, garantindo isolamento e facilidade de manutenção.

## Organização do Projeto

```
src/app/
  core/               # Serviços globais (auth, interceptors, layout)
  shared/             # Componentes, pipes e utilitários reutilizáveis
  messaging/          # Módulo dedicado ao fluxo de atendimento
    components/
    pages/
    services/
    store/
  mocks/
    messaging/        # Dados e serviços mockados para desenvolvimento
```

## Próximos Passos

1. Criar `MessagingModule` com roteamento dedicado e layout base.
2. Implementar serviços mockados que reflitam contratos do backend.
3. Definir interfaces e modelos de dados (contato, conversa, mensagem).
4. Construir componentes principais da interface (lista, chat, painel de detalhes).
5. Integrar autenticação (quando endpoints estiverem disponíveis).
6. Evoluir para integração real com backend e canais adicionais.

## Comandos Úteis

- `npm start`: executa o servidor de desenvolvimento em `http://localhost:4200/`.
- `npm run build`: gera build de produção em `dist/`.

> _Observação_: por ora, o projeto não inclui pipelines CI/CD ou suíte completa de testes; o foco inicial está na estruturação do módulo de mensagens com mocks. Testes serão ativados após estabilização dos fluxos principais.
