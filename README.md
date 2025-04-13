# Saúde Conectada Frontend

Sistema de agendamento e gestão de consultas médicas desenvolvido com React, Vite e Supabase.

## 🚀 Tecnologias

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta no Twilio (opcional - para notificações SMS)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/saude-conectada-frontend.git
cd saude-conectada-frontend
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
src/
  ├── components/       # Componentes reutilizáveis
  ├── pages/           # Páginas da aplicação
  ├── hooks/           # Custom hooks
  ├── lib/             # Utilitários e configurações
  ├── services/        # Serviços de API
  ├── styles/          # Estilos globais
  └── types/           # Definições de tipos TypeScript
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção localmente
- `npm run lint` - Executa verificação de lint
- `npm run test` - Executa testes

## 🔐 Variáveis de Ambiente

Veja `.env.example` para lista completa de variáveis necessárias.

## 📱 Funcionalidades

- Autenticação de usuários (pacientes e profissionais de saúde)
- Agendamento de consultas
- Gestão de perfil
- Notificações por SMS/email (opcional)
- Videochamadas (opcional)
- Dashboard administrativo

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@saudeconectada.com.br ou abra uma issue no GitHub.
