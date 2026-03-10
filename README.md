# 📚 Conectando Leitores

> Uma plataforma inovadora que conecta leitores e permite o compartilhamento de livros digitais com suporte à acessibilidade

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-v18%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/docker-required-blue)](https://www.docker.com/)

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Features](#-features)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Documentation](#-api-documentation)
- [Acessibilidade](#-acessibilidade)
- [Desenvolvimento](#-desenvolvimento)
- [Deploy](#-deploy)
- [Checklist de Segurança](#-checklist-de-segurança)
- [Licença](#-licença)
- [Autores](#-autores)
- [Status do Projeto](#-status-do-projeto)

---

## 🎯 Visão Geral

**Conectando Leitores** é uma plataforma web que revoluciona a forma como leitores descobrem e compartilham livros digitais. Com suporte nativo para EPUB e PDF, integração com cloud storage, e funcionalidades avançadas de acessibilidade, a plataforma atende desde leitores casuais até administradores de bibliotecas digitais.

### Principais Diferenciais

- 🌐 **Leitor EPUB Integrado**: Leia livros diretamente no navegador sem extensões
- ♿ **Acessibilidade Premium**: Fonte OpenDyslexic, contraste ajustável, navegação por teclado
- ☁️ **Cloud Storage**: Arquivos hospedados no Firebase, não no servidor local
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 🔐 **Seguro**: Autenticação JWT, validação em múltiplas camadas
- ⚡ **Otimizado**: Roda eficientemente em ambientes com recursos limitados

---

## ✨ Features

### Para Leitores 👥

- ✅ **Autenticação**: Registro e login seguro com JWT
- ✅ **Catálogo**: Visualizar catálogo de livros com filtros por categoria
- ✅ **Busca**: Buscar livros por título, autor ou categoria
- ✅ **Leitor**: Ler EPUB no navegador com:
  - Navegação por capítulos
  - Ajuste de tamanho de fonte
  - Fonte para dislexia (OpenDyslexic)
  - Suporte a teclado (Arrow keys, Page Up/Down)
  - Contraste ajustável
- ✅ **Favoritos**: Marcar e gerenciar livros favoritos
- ✅ **Upload**: Enviar seus próprios livros (PDF/EPUB)
- ✅ **Perfil**: Gerenciar dados pessoais e deletar conta

### Para Administradores 🛡️

- ✅ **Aprovação de Livros**: Revisar e aprovar/rejeitar livros enviados
- ✅ **Gerenciamento de Usuários**: Listar e gerenciar usuários
- ✅ **Notificações**: Sistema de notificações para admins
- ✅ **Novo Admin**: Criar novos usuários administradores

### Screenshots - Homepage & Painel Administrativo

| Homepage | Painel Administrativo |
|----------|----------------------|
| ![Homepage - Catálogo de Livros](readme-images/homepage.png) | ![Aprovação de Livros](readme-images/admin-pending.png) |

### Autenticação & Leitor

| Login | Leitor - Tema Claro | Leitor - Tema Escuro |
|-------|---------------------|----------------------|
| ![Login Modal](readme-images/login.png) | ![EPUB Reader Light](readme-images/reader-light.png) | ![EPUB Reader Dark](readme-images/reader-dark.png) |

### Para Super Administradores 👨‍💼

- ✅ **Full Access**: Acesso total ao sistema
- ✅ **Criação de Admins**: Registrar administradores
- ✅ **Auditoria**: Gerenciar todo o sistema

### Usuário de Teste 👤

- ✅ **Acesso ao Catálogo**: Visualizar todos os livros disponíveis
- ✅ **Busca e Filtros**: Procurar livros por título, autor ou categoria
- ✅ **Leitor EPUB**: Ler livros com suporte a acessibilidade
- ✅ **Favoritos**: Marcar e gerenciar livros favoritos
- ✅ **Upload de Livros**: Enviar seus próprios arquivos para aprovação
- ✅ **Perfil**: Gerenciar dados pessoais

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│     React 19 | TailwindCSS | shadcn/ui              │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐       │
│  │   Auth   │  │ Catálogo │  │ EPUB Reader  │       │
│  └──────────┘  └──────────┘  └──────────────┘       │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────┐
│                 Backend (NestJS)                    │
│          TypeScript | Modular Architecture          │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐       │
│  │  Books   │  │   Auth   │  │    Users     │       │
│  └──────────┘  └──────────┘  └──────────────┘       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐       │
│  │  Admin   │  │ Contact  │  │  Firebase    │       │
│  └──────────┘  └──────────┘  └──────────────┘       │
└────────────────────┬────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────────────┐
│            MongoDB (Oraculo)                        │
│                                                     │
│  Users | Books | Favorites | Notifications          │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| **NestJS** | 10.3.0 | Framework backend modular |
| **MongoDB** | - | Banco de dados NoSQL |
| **Mongoose** | 7.3.0 | ODM para MongoDB |
| **JWT** | - | Autenticação segura |
| **Passport** | - | Estratégia de autenticação |
| **Firebase Admin** | 13.5.0 | Cloud storage |
| **Bcrypt** | 5.1.0 | Hash de senhas |
| **Swagger** | 7.3.0 | Documentação de API |
| **Jest** | 29.5.0 | Framework de testes |
| **TypeScript** | 5.3.3 | Linguagem tipada |

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| **Next.js** | 15.5.4 | Framework React |
| **React** | 19.1.0 | UI library |
| **TailwindCSS** | 4 | Styling utility-first |
| **shadcn/ui** | - | Componentes de qualidade |
| **React Hook Form** | 7.64.0 | Gerenciamento de forms |
| **Zod** | 4.1.12 | Validação de schema |
| **epubjs** | 0.3.93 | Leitor EPUB |
| **Framer Motion** | 12.23.22 | Animações |
| **Lucide React** | 0.545.0 | Ícones |
| **TypeScript** | 5 | Linguagem tipada |

### DevOps
- **Docker** & **Docker Compose**: Containerização
- **Traefik**: Reverse proxy e roteamento
- **GitHub Actions**: CI/CD
- **SonarQube**: Quality gate
- **Husky & Lefthook**: Git hooks
- **ESLint & Prettier**: Code quality

---

## 📦 Pré-requisitos

### Obrigatório
- **Node.js**: v18 ou superior
- **Docker**: Última versão
- **Docker Compose**: Última versão
- **Git**: Para controle de versão

### Optional
- **MongoDB Compass**: GUI para MongoDB (desenvolvimento)
- **Postman**: Testes de API (desenvolvimento)
- **VSCode**: Editor recomendado com extensões

### Credenciais Firebase
Para usar upload de arquivos, você precisa de:
- Firebase Project ID
- Firebase Private Key
- Firebase Client Email
- Firebase API Key (frontend)

---

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/Qa-Coders/conectando-leitores.git
cd conectando-leitores
```

### 2. Configurar Variáveis de Ambiente

#### Backend (`.env` na raiz de `backend/`)
```bash
# Database
NODE_ENV=development
DATABASE_URL=mongodb://admin:example@oraculo:27017/oraculo?authSource=admin
PORT=21165

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=24h

# Firebase (opcional para upload de arquivos)
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY=sua-private-key
FIREBASE_CLIENT_EMAIL=seu-email@firebase.com

# Memory optimization
NODE_OPTIONS=--max-old-space-size=1024
```

#### Frontend (`.env.local` na raiz de `frontend/`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:21165
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key-firebase
```

### 3. Iniciar com Docker Compose

```bash
# Iniciar todos os serviços (backend + frontend + mongodb)
docker-compose up -d

# Visualizar logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

**Serviços estarão disponíveis em:**
- Frontend: http://localhost:3000
- Backend: http://localhost:21165
- API Docs (Swagger): http://localhost:21165/api
- MongoDB: mongodb://localhost:27017 (credenciais: admin/example)

### 4. Instalação Local (Sem Docker)

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Requisitos:**
- MongoDB rodando localmente em `mongodb://localhost:27017`
- Variáveis de ambiente configuradas

---

## ⚙️ Configuração

### Usuário de Teste

Para testar a plataforma, use as seguintes credenciais:

```
Email: user.test@email.com
Senha: Senha@123
```

**⚠️ Use credenciais diferentes em produção!**

### Seed de Dados (Opcional)

```bash
# Backend
cd backend
npm run seed-sys
```

### Configurar Firebase Storage

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Gere uma chave privada (Service Account)
3. Configure as variáveis de ambiente com as credenciais
4. Ative a API de Cloud Storage

### Acessibilidade

Para ativar a fonte OpenDyslexic e contraste:

1. Abra um livro no leitor
2. Use os controles de acessibilidade no reader
3. Configuração é salva no localStorage do navegador

---

## 📖 Como Usar

### Como Leitor

1. **Registre-se**: Clique em "Registrar" na página inicial
2. **Explore o Catálogo**: Veja todos os livros disponíveis
3. **Procure um Livro**: Use a busca ou filtre por categoria
4. **Adicione aos Favoritos**: Clique no ❤️ para salvar para depois
5. **Leia**: Clique no livro para abrir o leitor integrado
6. **Navegue**: Use as setas ou teclado (Arrow keys, Page Up/Down)
7. **Personalize**: Ajuste fonte, contraste e ative dyslexia mode

### Como Contribuidor

1. **Fazer Upload**: Vá para "Meus Uploads"
2. **Adicione um Livro**: Preencha formulário com:
   - Título
   - Autor
   - Categoria
   - Descrição
   - Arquivo (PDF ou EPUB)
   - Capa (opcional)
3. **Envie**: Sistema enviará para aprovação de admin
4. **Acompanhe**: Verifique status na página de uploads

### Como Administrador

1. **Login**: Use credenciais de admin
2. **Painel Admin**: Acesse dashboard
3. **Aprovar Livros**: Revise uploads pendentes
4. **Gerenciar Usuários**: Veja lista de usuários
5. **Notificações**: Receba avisos de atividades

---

## 📁 Estrutura do Projeto

### Backend

```
backend/
├── src/
│   ├── app.module.ts              # Módulo raiz
│   ├── main.ts                    # Entry point
│   │
│   ├── books/                     # Módulo de livros
│   │   ├── controllers/           # 8 controllers especializados
│   │   ├── services/              # 7 services
│   │   ├── entities/              # Schemas MongoDB
│   │   ├── dtos/                  # Data Transfer Objects
│   │   └── enums/                 # CategoriaLivro, StatusLivro
│   │
│   ├── auth/                      # Módulo de autenticação
│   │   ├── controllers/           # Login, logout, validate
│   │   ├── services/              # JWT logic
│   │   ├── guards/                # Auth guards
│   │   └── strategies/            # Passport strategies
│   │
│   ├── user/                      # Módulo de usuários
│   │   ├── controllers/           # CRUD de usuários
│   │   ├── services/              # Lógica de negócio
│   │   ├── repositories/          # Data access
│   │   └── entities/              # User schema
│   │
│   ├── admin/                     # Módulo de admins
│   │   ├── controllers/
│   │   ├── services/
│   │   └── repositories/
│   │
│   ├── contact/                   # Módulo de contato
│   │   ├── controllers/
│   │   ├── services/
│   │   └── entities/              # Message, Notification
│   │
│   ├── firebase/                  # Integração Firebase
│   │   ├── services/
│   │   └── config/
│   │
│   ├── common/                    # Compartilhado
│   │   ├── config/                # Configurações (memory, db)
│   │   ├── dtos/                  # DTOs globais
│   │   ├── filters/               # Exception filters
│   │   ├── validators/            # Custom validators
│   │   ├── pipes/                 # Pipes customizados
│   │   └── messages/              # Mensagens de erro/sucesso
│   │
│   ├── middleware/                # Middlewares HTTP
│   ├── seed/                      # Seed automático
│   └── util/                      # Utilitários
│
├── test/                          # Testes e2e
├── package.json
├── tsconfig.json
├── nest-cli.json
├── Dockerfile
└── .dockerignore
```

### Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Layout global com providers
│   │   ├── page.tsx               # Homepage
│   │   └── globals.css            # Estilos globais
│   │
│   ├── components/                # 40+ componentes React
│   │   ├── Books/
│   │   │   ├── BookListClient.tsx
│   │   │   ├── CardLivro.tsx
│   │   │   ├── ModalLivro.tsx
│   │   │   ├── reader/            # Leitor EPUB
│   │   │   ├── Registering/       # Upload de livros
│   │   │   ├── Pending/           # Aprovação de livros
│   │   │   └── SectionLivros/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── auth/                  # Login/Signup
│   │   ├── ContactForm/
│   │   ├── MyFavorites/
│   │   ├── Notifications/
│   │   ├── Hero/
│   │   ├── Homepage/
│   │   ├── NewAdmin/
│   │   └── ui/                    # shadcn/ui components
│   │
│   ├── contexts/                  # 4 contextos globais
│   │   ├── AuthContext.tsx
│   │   ├── FavoritesContext.tsx
│   │   ├── BookModalContext.tsx
│   │   └── PendingBookContext.tsx
│   │
│   ├── hooks/                     # 16 custom hooks
│   │   ├── useAuth.ts
│   │   ├── useLoginForm.ts
│   │   ├── useSignupForm.ts
│   │   ├── useBookRegisterForm.ts
│   │   ├── useEpub.ts
│   │   ├── useEpubKeyboard.ts
│   │   ├── useModal.ts
│   │   ├── useNotifications.ts
│   │   └── ... (mais hooks)
│   │
│   ├── services/                  # 12 serviços de API
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── bookService.ts
│   │   ├── catalogService.ts
│   │   ├── favoriteService.ts
│   │   └── ... (mais serviços)
│   │
│   ├── lib/                       # Utilitários
│   │   ├── auth.ts                # Funções de auth
│   │   ├── bookSchema.ts          # Validação Zod
│   │   └── utils.ts
│   │
│   ├── types/                     # 11 type definitions
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── book.ts
│   │   └── ... (mais types)
│   │
│   ├── data/                      # Dados estáticos
│   │   └── livros.json
│   │
│   └── utils/                     # Funções utilitárias
│
├── public/                        # Assets estáticos
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── components.json                # shadcn/ui config
├── Dockerfile
└── .dockerignore
```

---

## 📚 API Documentation

A documentação da API está disponível em **Swagger**:

```
http://localhost:21165/api
```

### Principais Endpoints

#### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/logout` - Logout (blacklist token)
- `GET /auth/validate` - Validar token JWT

#### Livros
- `GET /books` - Listar todos os livros
- `GET /books/:id` - Detalhes de um livro
- `POST /books/upload` - Upload de novo livro
- `GET /books/favorites` - Livros favoritos do usuário
- `POST /books/:id/favorite` - Adicionar aos favoritos
- `DELETE /books/:id/favorite` - Remover de favoritos
- `PATCH /books/:id/status` - Aprovar/rejeitar (admin)
- `DELETE /books/:id` - Deletar livro

#### Usuários
- `POST /user/register` - Registrar novo usuário
- `GET /user/:id` - Perfil do usuário
- `PATCH /user/:id` - Atualizar dados
- `DELETE /user/:id` - Deletar conta

#### Admin
- `POST /admin/register` - Registrar novo admin
- `GET /admin/pending-books` - Livros pendentes
- `GET /admin/users` - Listar usuários

#### Contato
- `POST /contact` - Enviar mensagem
- `GET /contact` - Listar mensagens (admin)

---

## ♿ Acessibilidade

A plataforma foi desenvolvida com forte foco em acessibilidade para leitores com dislexia e outras necessidades especiais.

### Features de Acessibilidade

| Feature | Descrição |
|---|---|
| **OpenDyslexic Font** | Fonte especializada que reduz confusão entre letras |
| **Alto Contraste** | Modo de alto contraste para melhor legibilidade |
| **Navegação por Teclado** | EPUB totalmente navegável com teclado |
| **ARIA Labels** | Todos os componentes com labels acessíveis |
| **Responsive Design** | Funciona em qualquer tamanho de tela |
| **Resposta de Voz** | Suporte a leitores de tela |

### Como Acessar

No leitor EPUB:
1. Clique no ícone de acessibilidade ♿
2. Escolha:
   - **Dyslexia Font**: Ativa OpenDyslexic
   - **High Contrast**: Aumenta contraste
   - **Font Size**: Ajusta tamanho

Configuração é salva automaticamente no navegador.

---

## 🛠️ Desenvolvimento

### Estrutura de Commits

O projeto segue **Conventional Commits**:

```
feat(scope): adiciona nova feature
fix(scope): corrige bug
docs(scope): documentação
style(scope): formatação de código
refactor(scope): refatoração sem mudanças de funcionalidade
perf(scope): melhoria de performance
test(scope): testes
chore(scope): configuração/dependências
```

### Exemplo
```bash
git commit -m "feat(books): adiciona filtro por categoria"
git commit -m "fix(auth): corrige validação de email"
```

### Git Hooks

O projeto usa **Husky** e **Lefthook** para validação automática:

- **Pre-commit**: Lint automático e formatação
- **Commit-msg**: Validação de conventional commits
- **Pre-push**: Testes antes de push

### Code Quality

Roda automaticamente:
- **ESLint**: Análise estática
- **Prettier**: Formatação de código
- **SonarQube**: Quality gate

```bash
# Executar localmente
npm run lint            # ESLint
npm run format          # Prettier
npm run lint:fix        # ESLint com fix
```

---

## 🚀 Deploy

### Deploy com Docker

```bash
# Build das imagens
docker-compose build

# Deploy em produção
docker-compose -f docker-compose.yml up -d

# Verificar saúde
docker-compose ps
docker-compose logs -f
```

### Variáveis de Produção

```bash
# Backend
NODE_ENV=production
JWT_SECRET=sua-chave-super-segura
DATABASE_URL=mongodb://user:pass@mongo-prod:27017/db

# Frontend
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
```

### CI/CD com GitHub Actions

O repositório possui workflows automáticos:

```
.github/workflows/
├── sonar.yml          # SonarQube analysis
└── deploy.yml         # Deploy automático
```

Deploy automático em:
- ✅ Merge em `main`
- ✅ Release tags
- ✅ Pushes em `develop`

---

## 📋 Checklist de Segurança

Antes de deployar em produção:

- [ ] JWT_SECRET alterado (mínimo 32 caracteres)
- [ ] Senha padrão de admin alterada
- [ ] CORS configurado apenas para domínios permitidos
- [ ] HTTPS ativado
- [ ] Database com backup automático
- [ ] Rate limiting ativado
- [ ] Logs configurados e centralizados
- [ ] Firebase credentials rotacionadas
- [ ] .env não está no repositório
- [ ] Certificados SSL/TLS válidos

---

## 📄 Licença

Este projeto está sob licença **MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Autores

Desenvolvido pela comunidade **Qa-Coders**

### 🛠️ Equipe de Desenvolvimento

**Backend**
- [AndreyJustino](https://github.com/AndreyJustino)
- [cadu-ventura](https://github.com/cadu-ventura)
- [marciordalio](https://github.com/marciordalio)

**Frontend**
- [winstonajr](https://github.com/winstonajr)
- [yanalmeida2411](https://github.com/yanalmeida2411)

**DevOps**
- [JoaoGSantiago](https://github.com/JoaoGSantiago)

**QA / Testing**
- [MatheusVictor01](https://github.com/MatheusVictor01) - QA Tester Funcional

### 🎨 Design

**UI/UX Designers**
- [Kaynan Teixeira](https://www.linkedin.com/in/kaynan-teixeira-b6288a2a7/) - UI Designer
- [Jaquer Itzmann](https://www.linkedin.com/in/jaqueritzmann/) - Product Designer | UX/UI Designer | Figma | UX Researcher

---

## 📊 Status do Projeto

| Component | Status |
|---|---|
| Backend | ✅ Stable |
| Frontend | ✅ Stable |
| Tests | ✅ 80% Coverage |
| CI/CD | ✅ Automated |
| Documentation | ✅ Complete |
| Acessibilidade | ✅ WCAG 2.1 AA |
