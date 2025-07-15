# Debug da Concorrência - Instruções

## 🔍 Possíveis problemas identificados:

1. **Porta da API estava errada**: Alterada de 3010
2. **Logs de debug adicionados** para rastrear o funcionamento

## 🧪 Como testar:

### 1. **Verificar conexão WebSocket**
1. Abra o DevTools (F12) no navegador
2. Vá para a aba **Console**
3. Procure por logs como:
   - `"Conectando WebSocket para: http://localhost:3010/gifts"`
   - `"WebSocket conectado para: http://localhost:3010/gifts"`

### 2. **Verificar se API está rodando**
1. Certifique-se que a API está rodando na porta **3010**
2. Teste no navegador: `http://localhost:3010/gifts`

### 3. **Testar concorrência**
1. Abra **2 dispositivos** (ou 2 abas)
2. Navegue para a página do aniversário
3. Clique em "VOU DAR ESTE!" em **ambos os dispositivos**
4. No **primeiro dispositivo**, digite o nome e clique "Confirmar Escolha"
5. Observe o **console** do segundo dispositivo para logs como:
   - `"WebSocket: gift-selected"`
   - `"WebSocket: gift-conflict"`

### 4. **Verificar eventos WebSocket**
No console, procure por:
- `"Enviando gift-being-selected"` - quando confirmar
- `"WebSocket: gift-selected"` - quando receber notificação
- `"WebSocket: gift-conflict"` - quando houver conflito

## 🚨 Possíveis problemas:

### **Se não aparecer "WebSocket conectado":**
- Verificar se API está rodando na porta 3010
- Verificar configuração CORS no backend
- Verificar variável `NEXT_PUBLIC_API_URL`

### **Se aparecer "WebSocket não conectado":**
- A conexão não foi estabelecida
- Verificar se Gateway está configurado corretamente
- Verificar se socket.io está instalado no backend

### **Se não aparecer eventos WebSocket:**
- Verificar se `notifyGiftSelected` está sendo chamado no backend
- Verificar se `gifts.gateway.ts` está sendo importado corretamente
- Verificar se o namespace `/gifts` está correto

## 🔧 Variáveis de ambiente:

### Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:3010
```

### Backend (.env):
```
FRONTEND_URL=http://localhost:3001
```

## 📋 Checklist de debug:

- [ ] API rodando na porta 3010
- [ ] Frontend consegue conectar WebSocket
- [ ] Console mostra "WebSocket conectado"
- [ ] Console mostra "Enviando gift-being-selected" ao confirmar
- [ ] Console mostra "WebSocket: gift-selected" no outro dispositivo
- [ ] Modal fecha automaticamente no segundo dispositivo
- [ ] Mensagem de conflito aparece

## 🔄 Próximos passos se não funcionar:

1. Verificar se `GiftsModule` está importado no `AppModule`
2. Verificar se `GiftsGateway` está no providers do `GiftsModule`
3. Verificar se há erros no console do servidor
4. Testar conexão WebSocket diretamente com ferramenta como Postman

Teste agora e me informe os logs que aparecem no console!