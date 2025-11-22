# Teste do Fluxo de Chamada Completo

## Conversa de Exemplo: Bruna Castro

Uma conversa de exemplo foi adicionada no início da lista para facilitar o teste do fluxo completo de chamada.

### Como Testar:

1. **Acesse a página de conversas**
   - A conversa "Bruna Castro" deve aparecer no topo da lista
   - Ela já possui 3 imagens enviadas pelo cliente para análise

2. **Abra o perfil do contato**
   - Clique no nome/avatar do contato na janela de chat
   - O painel lateral direito deve abrir mostrando:
     - Foto de perfil da Bruna Castro
     - Nome: "Bruna Castro"
     - Nickname: "~Design de vitrines"
     - Número: "+55 62 93333-2211"
     - Botão "Ligar"

3. **Teste o estado "Chamando..."**
   - Clique no botão "Ligar"
   - O botão deve mudar para "Cancelar" (vermelho)
   - Deve aparecer:
     - Ícone de telefone com animação de pulso
     - Texto "Chamando..."
     - Descrição "Aguardando atendimento do cliente."
   - Durante esse estado, você pode visualizar as imagens da conversa

4. **Teste o estado "Cliente atendeu"**
   - Após aproximadamente 2.2 segundos, a chamada é "atendida"
   - O visual muda completamente:
     - **Card de status:** Fundo muda para verde suave (diferente do azul de "Chamando...")
     - **Ícone:** Telefone verde sólido (sem animação de pulso)
     - **Texto principal:** "Chamada em andamento" em destaque
     - **Descrição:** "Chamada ativa - você pode analisar imagens enquanto conversa."
     - **Timer:** Mostra a duração da chamada em tempo real (ex: "00:05", "00:15", etc.)
   - O botão deve mudar para "Desligar" (vermelho) com ícone de desligar
   - Durante a chamada, você pode:
     - Ver as imagens enviadas pelo cliente
     - Analisar os detalhes da vitrine
     - Continuar visualizando o perfil do contato
     - O timer continua contando enquanto a chamada está ativa

5. **Encerrar a chamada**
   - Clique no botão "Desligar"
   - A chamada deve ser encerrada
   - O estado volta para "idle"
   - O botão volta para "Ligar"

### Dados da Conversa de Exemplo:

- **Nome:** Bruna Castro
- **Número:** +55 62 93333-2211
- **Avatar:** Foto de mulher loira sorrindo
- **Mensagens:** 
  - Texto inicial do cliente
  - 3 imagens da vitrine montada
  - Conversa sobre análise das fotos

### Funcionalidades Testadas:

✅ Botão muda de "Ligar" → "Cancelar" → "Desligar"  
✅ Estado visual de chamada integrado no perfil  
✅ Timer de duração da chamada  
✅ Animações de pulso durante chamada  
✅ Possibilidade de analisar imagens durante a chamada  
✅ Layout responsivo e organizado  

