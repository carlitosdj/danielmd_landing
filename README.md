# DanielMD Landing Page

Landing page para as festas de aniversário do Daniel, construída com Next.js 14 e Redux.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Redux + Redux Saga** - Gerenciamento de estado
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP

## 🎯 Funcionalidades

- ✅ Visualização de aniversários por slug (ex: `/1-ano`, `/2-anos`)
- ✅ Lista de presentes com status disponível/comprado
- ✅ Confirmação de presença (RSVP)
- ✅ Sistema de mensagens dos convidados
- ✅ Design responsivo e divertido
- ✅ Animações e efeitos visuais

## 🛠️ Desenvolvimento

### Instalação

```bash
# Instalar dependências
yarn install

# Executar em modo desenvolvimento (porta 4001)
yarn dev

# Build para produção
yarn build

# Executar produção
yarn start
```

### Variáveis de Ambiente

Copie `.env.local` e configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📁 Estrutura

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── page.tsx           # Página principal (redireciona para ativo)
│   ├── [slug]/            # Página dinâmica do aniversário
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
├── store/                 # Redux store (padrão admin)
│   └── ducks/            # Actions, reducers, sagas
├── lib/                  # Utilitários e API client
└── hooks/                # Custom hooks
```

## 🎨 Design

- **Paleta de cores**: Rosa, azul, amarelo, verde vibrantes
- **Tipografia**: Fredoka (títulos) + Comic Neue (texto)
- **Efeitos**: Glassmorphism, gradientes, animações CSS
- **Responsivo**: Bootstrap 5 + CSS customizado

## 🔗 Integração

Conecta com a API NestJS na porta 4000:
- Carrega aniversários por slug
- Gerencia presentes e RSVP
- Sistema de mensagens com moderação