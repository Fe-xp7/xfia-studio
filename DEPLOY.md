# Publicação gratuita

Arquitetura utilizada:

- **Frontend e sites públicos:** Cloudflare Pages Free
- **API:** Render Free
- **Banco:** MongoDB Atlas M0 Free
- **Imagens:** Cloudinary Free
- **Runtime:** Node.js 20+

É possível publicar sem domínio próprio usando o endereço gratuito `*.pages.dev`. Nenhuma credencial real deve ser adicionada ao projeto.

## 1. Colocar o projeto no GitHub

Crie um repositório privado e envie o projeto. Cloudflare Pages e Render farão os deploys a partir dele. Antes do envio, confirme que os arquivos `backend/.env` e `frontend/.env` não estão incluídos.

## 2. Criar o MongoDB Atlas gratuito

1. Crie uma conta e escolha o cluster **M0 Free**.
2. Crie um usuário exclusivo para esta aplicação.
3. Em **Network Access**, permita o acesso necessário para o Render.
4. Copie a connection string, informando usuário, senha e o banco `site-factory`.
5. Guarde o valor para `MONGODB_URI`.

Exemplo estrutural, sem credenciais reais:

```text
mongodb+srv://USUARIO:SENHA@cluster.example.mongodb.net/site-factory
```

## 3. Criar o Cloudinary gratuito

Na tela de credenciais do Cloudinary, copie o **Cloud name**, a **API key** e o **API secret**. Esses valores ficarão somente nas variáveis protegidas do Render. Com `STORAGE_PROVIDER=cloudinary`, imagens novas permanecem disponíveis mesmo quando o Render reinicia.

## 4. Publicar a API no Render Free

1. Escolha **New > Blueprint** no Render.
2. Conecte o repositório e selecione o `render.yaml` existente.
3. Preencha as variáveis solicitadas:

| Variável | Valor |
| --- | --- |
| `MONGODB_URI` | Connection string do Atlas |
| `ADMIN_NAME` | Nome do administrador |
| `ADMIN_EMAIL` | E-mail de login |
| `ADMIN_PASSWORD` | Senha inicial forte |
| `CLIENT_URLS` | Preencha depois de criar o Pages |
| `PUBLIC_SITE_URL` | Preencha depois de criar o Pages |
| `CLOUDINARY_CLOUD_NAME` | Cloud name do Cloudinary |
| `CLOUDINARY_API_KEY` | API key do Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret do Cloudinary |

O plano gratuito pode adormecer após um período sem acessos. O primeiro acesso seguinte pode demorar enquanto a API inicia.

Confirme que `https://SEU-SERVICO.onrender.com/health` responde:

```json
{"status":"ok"}
```

## 5. Publicar o frontend no Cloudflare Pages

1. Abra **Workers & Pages > Create > Pages > Connect to Git**.
2. Selecione o repositório.
3. Configure:

| Campo | Valor |
| --- | --- |
| Root directory | `frontend` |
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20` |

4. Cadastre a variável de build:

```env
VITE_API_URL=https://SEU-SERVICO.onrender.com/api
```

5. Publique e copie o endereço `https://SEU-PROJETO.pages.dev`.

O arquivo `frontend/public/_redirects` permite atualizar diretamente rotas como `/sites/:id` e `/preview/:slug`.

## 6. Conectar frontend e API

No Render, defina:

```env
CLIENT_URLS=https://SEU-PROJETO.pages.dev
PUBLIC_SITE_URL=https://SEU-PROJETO.pages.dev
```

Para aceitar produção e desenvolvimento local:

```env
CLIENT_URLS=https://SEU-PROJETO.pages.dev,http://localhost:5173
```

Salve e aguarde o novo deploy da API.

## 7. Checklist

- O `/health` responde `200` no Render.
- O login funciona no endereço `pages.dev`.
- Uma empresa pode ser cadastrada.
- Uma imagem continua abrindo depois de reiniciar a API.
- O preview público abre em janela anônima.
- O link publicado não contém `localhost`.
- Nenhum `.env` ou segredo foi enviado ao GitHub.

## Limites do plano gratuito

- O Render pode adormecer e demorar no primeiro acesso.
- Atlas, Cloudinary e Cloudflare possuem cotas gratuitas.
- Não há alta disponibilidade real.
- Um domínio próprio é opcional; o endereço `pages.dev` é gratuito.
