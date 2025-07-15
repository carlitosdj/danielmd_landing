# Sistema de Concorrência para Seleção de Presentes

## 🎯 Visão Geral

O sistema de concorrência foi implementado para resolver o problema de múltiplos usuários selecionarem o mesmo presente simultaneamente. Utiliza **WebSockets** para comunicação em tempo real e **Optimistic Locking** para garantir a integridade dos dados.

## 🔧 Componentes Implementados

### 1. **Backend (NestJS)**

#### WebSocket Gateway (`/api/src/gifts/gifts.gateway.ts`)
- **Eventos de Entrada:**
  - `join-anniversary`: Cliente entra na sala do aniversário
  - `gift-being-selected`: Usuário abriu modal para selecionar presente
  - `gift-selection-cancelled`: Usuário cancelou a seleção
  
- **Eventos de Saída:**
  - `gift-being-selected`: Notifica que um presente está sendo selecionado
  - `gift-selected`: Notifica que um presente foi confirmado
  - `gift-selection-released`: Notifica que a seleção foi cancelada
  - `gift-selection-conflict`: Notifica conflito de seleção
  - `gift-conflict`: Notifica conflito de concorrência
  - `current-selections`: Envia estado atual das seleções

#### Optimistic Locking (`/api/src/gifts/gifts.service.ts`)
- **Campo `version`**: Adicionado ao schema Gift
- **Verificação de Versão**: Validação antes de cada atualização
- **Incremento Automático**: Versão é incrementada a cada mudança
- **Tratamento de Conflitos**: Exceções customizadas para conflitos

### 2. **Frontend (NextJS)**

#### WebSocket Service (`/src/services/websocket.service.ts`)
- **Conexão Automática**: Conecta automaticamente ao entrar na página
- **Reconnection**: Reconexão automática com exponential backoff
- **Event Handling**: Callbacks para todos os eventos WebSocket
- **User ID**: Geração automática de ID único por usuário

#### Redux Store Enhancement
- **Concurrency State**: Novos campos no estado do Redux
- **Real-time Updates**: Atualizações automáticas via WebSocket
- **Version Management**: Controle de versões para optimistic locking
- **Conflict Resolution**: Gerenciamento de conflitos de concorrência

#### Componentes Inteligentes
- **Modal Inteligente**: Fechamento automático quando presente é selecionado
- **Estados Visuais**: Indicadores de presentes sendo selecionados
- **Connection Status**: Indicador de status da conexão WebSocket
- **Conflict Messages**: Notificações de conflitos em tempo real

## 🚀 Fluxo de Funcionamento

### Cenário 1: Seleção Bem-sucedida
1. **Usuário A** clica em "VOU DAR ESTE!"
2. **WebSocket** notifica todos os clientes que o presente está sendo selecionado
3. **Outros usuários** veem o botão mudando para "Sendo selecionado por Usuario A"
4. **Usuário A** digita o nome e confirma
5. **Backend** valida a versão e atualiza o presente
6. **WebSocket** notifica que o presente foi selecionado
7. **Modal** fecha automaticamente para todos os usuários

### Cenário 2: Conflito de Concorrência
1. **Usuário A** e **Usuário B** clicam simultaneamente
2. **Ambos** abrem a modal
3. **Usuário A** confirma primeiro
4. **Backend** aceita a seleção do Usuário A
5. **Usuário B** tenta confirmar mas recebe erro de versão
6. **WebSocket** notifica conflito para Usuário B
7. **Modal** do Usuário B fecha automaticamente com mensagem de conflito

## 🛠️ Como Usar

### Para Desenvolvedores

#### 1. Inicializar WebSocket
```typescript
// O hook useWebSocket é usado automaticamente no GiftsSection
const { notifyGiftBeingSelected, notifyGiftSelectionCancelled } = useWebSocket(slug)
```

#### 2. Verificar Estados de Concorrência
```typescript
// Verificar se presente está sendo selecionado
const isBeingSelected = isGiftBeingSelected(gift.id)

// Verificar se foi selecionado pelo usuário atual
const selectedByMe = isGiftSelectedByMe(gift.id)

// Obter quem está selecionando
const selector = getGiftSelector(gift.id)
```

#### 3. Gerenciar Seleções
```typescript
// Iniciar seleção
dispatch(startGiftSelection({ giftId, userId, userName }))

// Cancelar seleção
dispatch(cancelGiftSelection({ giftId }))

// Limpar mensagens de conflito
dispatch(clearGiftConflictMessage({ giftId }))
```

### Para Usuários Finais

#### Estados do Botão:
- **"Vou dar este! 💝"**: Presente disponível
- **"Sendo selecionado por..."**: Outro usuário está selecionando
- **"Você está selecionando..."**: Você está selecionando
- **"Escolhido por..."**: Presente já foi selecionado

#### Notificações:
- **Modal fecha automaticamente**: Quando outro usuário seleciona o mesmo presente
- **Mensagens de conflito**: Quando há conflito de concorrência
- **Indicador de conexão**: Status da conexão WebSocket

## 📊 Monitoramento

### Logs do Backend
```bash
# Conexões WebSocket
[GiftsGateway] Cliente conectado: socket-id-123

# Seleções de presentes
[GiftsGateway] Presente 1 está sendo selecionado por socket-id-123

# Conflitos
[GiftsGateway] Conflito no presente 1 para usuário socket-id-456
```

### Estados do Frontend
```typescript
// Acessar estado de concorrência
const {
  websocketConnected,
  activeSelections,
  conflictMessages,
  giftVersions,
  userId
} = useTypedSelector(state => state.gifts)
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# Backend
FRONTEND_URL=http://localhost:3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3010
```

### Dependências
```bash
# Backend
npm install @nestjs/websockets socket.io @nestjs/platform-socket.io

# Frontend
npm install socket.io-client
```

## 🧪 Testes

### Testar Concorrência
1. Abra duas abas do navegador
2. Navegue para a mesma página de aniversário
3. Clique no mesmo presente em ambas as abas
4. Tente confirmar em ambas
5. Verifique se apenas uma seleção é aceita

### Verificar WebSocket
1. Abra o DevTools → Network → WS
2. Verifique se há conexão WebSocket ativa
3. Monitore os eventos sendo enviados/recebidos
4. Teste a reconexão fechando e reabrindo a página

## 🚨 Troubleshooting

### Problemas Comuns

#### WebSocket não conecta
- Verificar se o backend está rodando
- Confirmar URL do WebSocket
- Checar CORS settings

#### Modal não fecha automaticamente
- Verificar se WebSocket está conectado
- Confirmar se eventos estão sendo recebidos
- Checar se useEffect está funcionando

#### Conflitos não são detectados
- Verificar se campo `version` existe no banco
- Confirmar se optimistic locking está funcionando
- Testar se exceções estão sendo lançadas

### Logs de Debug
```typescript
// Ativar logs do WebSocket
localStorage.setItem('debug', 'socket.io-client:*')

// Verificar estado do Redux
console.log(store.getState().gifts)
```

## 🔮 Próximos Passos

1. **Persistência**: Salvar seleções ativas no banco de dados
2. **Timeout**: Limpar seleções após período de inatividade
3. **Notificações**: Sistema de notificações push
4. **Analytics**: Métricas de uso e conflitos
5. **Testes**: Testes automatizados de concorrência

---

## 📝 Notas Técnicas

- **Escalabilidade**: Sistema suporta múltiplos usuários simultâneos
- **Resiliência**: Reconexão automática em caso de falha
- **Performance**: Eventos otimizados para minimizar tráfego
- **Segurança**: Validação no backend para prevenir ataques
- **UX**: Feedback visual imediato para melhor experiência