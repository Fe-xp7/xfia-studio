# XFia Studio — sistema interno de criação de sites

Painel administrativo para cadastrar oportunidades, organizar templates, analisar empresas e gerar conteúdo estruturado de sites com IA.

## Entregue nesta etapa

- Monorepo com backend Node.js/Express e frontend React/Vite.
- MongoDB/Mongoose com modelos `Admin`, `Company`, `Site` e `Template`.
- Login JWT, senha com bcrypt, limitação de tentativas e proteção de todas as APIs administrativas.
- CRUD REST de empresas e templates, com validação, paginação e erros padronizados.
- Dashboard responsivo, sidebar, métricas iniciais e empresas recomendadas.
- Telas de login, listagem/cadastro/edição/exclusão de empresas e biblioteca de templates.
- Estados de carregamento, erro e ausência de dados.
- Serviço de IA desacoplado, com provedor mock e adaptador HTTP configurável.
- Análise persistida com potencial, template, estilo, paleta, seções e argumentos comerciais.
- Geração de conteúdo estruturado associado a um template controlado.
- Catálogo inicial idempotente com templates para barbearia, restaurante, oficina, loja e clínica.
- Listagem de sites, editor visual em três painéis, ordenação/visibilidade de seções e preview responsivo ao vivo.
- Rota pública `/preview/:slug`, sem elementos do painel administrativo.
- `DeploymentService` desacoplado com provedor local, status de publicação e link copiável.
- Clientes vinculados às empresas, valores de criação/manutenção e status contratual.
- Controle administrativo de mensalidades, vencimentos, atrasos e baixas manuais.
- Dashboard financeiro com receita recorrente, receita de criação e pendências.
- Configurações persistentes de identidade, logo e valores comerciais padrão.
- Diagnóstico seguro dos provedores de IA, imagens e publicação, sem expor credenciais.

Os módulos de publicação externa, clientes e mensalidades aparecem apenas como destinos planejados. Eles pertencem às etapas seguintes e não foram antecipados.

## Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- MongoDB local ou uma URI MongoDB acessível

## Instalação

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edite `backend/.env`. Use um `JWT_SECRET` aleatório com pelo menos 32 caracteres e defina as credenciais iniciais do administrador.

Crie ou atualize o usuário administrativo:

```bash
npm run seed:admin
```

Inicie API e frontend juntos:

```bash
npm run dev
```

- Painel: `http://localhost:5173`
- API: `http://localhost:4000/api`
- Health check: `http://localhost:4000/health`

## Scripts

| Comando | Função |
| --- | --- |
| `npm run dev` | Inicia backend e frontend em desenvolvimento |
| `npm run build` | Compila o frontend para produção |
| `npm start` | Inicia somente a API |
| `npm run seed:admin` | Cria/atualiza o administrador a partir do `.env` |

## API da Etapa 1

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET|POST /api/companies`
- `GET|PUT|DELETE /api/companies/:id`
- `GET|POST /api/templates`
- `GET|PUT|DELETE /api/templates/:id`
- `GET /api/sites`
- `GET|PUT|DELETE /api/sites/:id`
- `POST /api/sites/:id/deploy`
- `GET /api/preview/:slug` (pública)
- `GET|POST /api/clients`
- `PUT|DELETE /api/clients/:id`
- `GET|POST /api/subscriptions`
- `PUT|DELETE /api/subscriptions/:id`
- `GET|PUT /api/settings`

Exceto o login e o health check, as rotas exigem `Authorization: Bearer <token>`.

### Configuração da IA

O padrão `AI_PROVIDER=mock` funciona sem chave e permite testar todo o fluxo. Para usar um provedor com endpoint compatível com chat/completions:

```env
AI_PROVIDER=http
AI_API_URL=https://seu-provedor.example/v1/chat/completions
AI_API_KEY=sua-chave
AI_MODEL=nome-do-modelo
```

A chave fica somente em `backend/.env`. Reinicie a API após mudar essas variáveis.

### Templates e editor

Ao iniciar a API, os cinco templates iniciais são inseridos sem duplicar registros existentes. Depois de gerar um site pela página da empresa, use o menu **Sites** para editar textos, serviços, diferenciais, imagens do Hero e da galeria, contatos, SEO, cores, modo claro/escuro e template. O botão **Visualizar site** abre a demonstração pública em outra aba.

O upload aceita até 10 imagens JPG, PNG ou WebP por envio, com limite de 5 MB por arquivo. Em desenvolvimento, `STORAGE_PROVIDER=local` mantém os arquivos em `backend/uploads`. Em produção gratuita, `STORAGE_PROVIDER=cloudinary` envia as imagens ao Cloudinary para que sobrevivam aos reinícios da API.

### Publicação de demonstração

Por padrão, `DEPLOYMENT_PROVIDER=local` publica a demonstração na própria aplicação e gera uma URL baseada em `PUBLIC_SITE_URL`. Esse modo é ideal para desenvolvimento, mas o link `localhost` funciona somente no computador local. A interface `DeploymentService` permite adicionar posteriormente um provedor externo sem alterar o fluxo do painel.

### Clientes e mensalidades

Os valores iniciais são definidos por `DEFAULT_CREATION_FEE` e `DEFAULT_MONTHLY_FEE`, com padrões de R$ 500 e R$ 50. Eles podem ser alterados em cada cliente. As mensalidades são somente administrativas: não há cobrança automática nesta versão. Mensalidades pendentes com vencimento passado são marcadas como atrasadas ao consultar o módulo ou o dashboard.

## Estrutura

```text
backend/src/
  config/ controllers/ middlewares/ models/ routes/ utils/ validators/
frontend/src/
  components/ contexts/ layouts/ pages/ services/ styles/
```

Nunca versione os arquivos `.env` ou credenciais reais.

## Produção

O repositório inclui configuração para Cloudflare Pages, Render Free, MongoDB Atlas M0 e Cloudinary Free. Consulte [DEPLOY.md](./DEPLOY.md) para o processo completo, variáveis necessárias e checklist de validação.
