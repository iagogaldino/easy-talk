# Configuração da Integração com OpenAI Assistants

Este guia explica como configurar e usar os agentes da OpenAI no chat do admin.

## Pré-requisitos

1. Conta na OpenAI com acesso à API
2. API Key da OpenAI
3. Um Assistant criado no OpenAI Platform

## Como obter as credenciais

### 1. Obter API Key

1. Acesse [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Faça login na sua conta OpenAI
3. Clique em "Create new secret key"
4. Copie a chave gerada (ela só será mostrada uma vez!)

### 2. Criar um Assistant

1. Acesse [https://platform.openai.com/assistants](https://platform.openai.com/assistants)
2. Clique em "Create" para criar um novo assistant
3. Configure:
   - **Name**: Nome do seu assistente (ex: "Assistente Admin")
   - **Instructions**: Instruções sobre como o assistente deve se comportar
   - **Model**: Escolha o modelo (ex: gpt-4, gpt-3.5-turbo)
   - **Tools**: Adicione ferramentas se necessário (Code Interpreter, Retrieval, Function calling)
4. Salve e copie o **Assistant ID** (aparece na URL ou nos detalhes)

## Configuração no Projeto

### Opção 1: Configuração direta (Desenvolvimento)

Edite o arquivo `src/environments/environment.ts`:

```typescript
openai: {
  apiKey: 'sk-sua-api-key-aqui',
  assistantId: 'asst_seu-assistant-id-aqui',
},
```

⚠️ **ATENÇÃO**: Nunca commite suas credenciais no Git! Use variáveis de ambiente em produção.

### Opção 2: Variáveis de Ambiente (Recomendado para Produção)

1. Configure as variáveis de ambiente:
   ```bash
   export OPENAI_API_KEY=sk-sua-api-key-aqui
   export OPENAI_ASSISTANT_ID=asst_seu-assistant-id-aqui
   ```

2. Os arquivos `environment.prod.ts` e `environment.staging.ts` já estão configurados para ler essas variáveis.

### Opção 3: Arquivo .env (Desenvolvimento Local)

1. Crie um arquivo `.env` na raiz do projeto:
   ```
   OPENAI_API_KEY=sk-sua-api-key-aqui
   OPENAI_ASSISTANT_ID=asst_seu-assistant-id-aqui
   ```

2. Configure o Angular para ler essas variáveis (pode precisar de configuração adicional no `angular.json`)

## Como Funciona

### Fluxo de Integração

1. **Usuário envia mensagem** → `AIChatService.sendMessage()`
2. **Verifica configuração** → Se OpenAI está configurado
3. **Cria/usa Thread** → Cada conversa usa um thread único
4. **Adiciona mensagem** → Mensagem do usuário é adicionada ao thread
5. **Cria Run** → Executa o assistant no thread
6. **Aguarda conclusão** → Polling até o run completar
7. **Obtém resposta** → Extrai a resposta do assistant
8. **Fallback** → Se houver erro, usa respostas mockadas

### Thread Management

- Cada sessão do usuário usa um thread único
- O thread persiste durante a sessão
- Para iniciar nova conversa, chame `clearThread()`

## Exemplo de Uso

```typescript
// O serviço já está integrado automaticamente
// Basta configurar as credenciais e usar normalmente

// No admin-page.component.ts, o chat já usa o AIChatService
// que automaticamente usa OpenAI se configurado
```

## Tratamento de Erros

O sistema possui fallback automático:
- Se OpenAI não estiver configurado → usa respostas mockadas
- Se houver erro na API → usa respostas mockadas
- Mensagens de erro são exibidas ao usuário

## Segurança

⚠️ **IMPORTANTE**:

1. **Nunca commite credenciais** no código fonte
2. Use variáveis de ambiente em produção
3. Considere usar um backend proxy para esconder a API key do frontend
4. Configure CORS adequadamente se necessário

## Troubleshooting

### Erro: "API Key não configurada"
- Verifique se `openai.apiKey` está preenchido no environment

### Erro: "Assistant não encontrado"
- Verifique se o `assistantId` está correto
- Confirme que o assistant existe na sua conta OpenAI

### Erro: "Limite de requisições excedido"
- Você atingiu o limite de rate limit da OpenAI
- Aguarde alguns instantes ou verifique seu plano

### Erro: "Timeout aguardando resposta"
- O assistant está demorando muito para responder
- Pode ser um problema temporário da API

## Próximos Passos

- [ ] Implementar cache de threads para persistência
- [ ] Adicionar suporte a múltiplos assistants
- [ ] Implementar streaming de respostas
- [ ] Adicionar métricas e logging

