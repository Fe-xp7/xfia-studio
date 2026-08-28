# Publicação multi-tenant da XFia Tech

Arquitetura fixa desta versão:

- **Sites públicos:** um Cloudflare Worker com Static Assets
- **Roteamento:** uma Route `*.sites.xfiatech.com/*`
- **API:** Render
- **Banco:** MongoDB Atlas
- **Imagens:** Cloudinary

Não é usado Cloudflare Pages, Workers for Platforms ou um Worker por cliente.

## 1. API no Render

O `render.yaml` configura o provedor multi-tenant. Preencha as credenciais solicitadas e confirme:

```env
CLIENT_URLS=https://app.xfiatech.com
PUBLIC_SITE_URL=https://app.xfiatech.com
PUBLIC_SITE_BASE_DOMAIN=sites.xfiatech.com
PUBLIC_SITE_SCHEME=https
DEPLOYMENT_PROVIDER=multitenant
```

`CLIENT_URLS` contém as origens exatas do painel. A API também autoriza, via CORS, origens HTTPS abaixo de `*.sites.xfiatech.com`.

## 2. Frontend público

Configure no build:

```env
VITE_API_URL=https://SEU-SERVICO.onrender.com/api
VITE_PUBLIC_SITE_BASE_DOMAIN=sites.xfiatech.com
VITE_ENABLE_CUSTOM_DOMAINS=false
```

Autentique o Wrangler e publique a partir da raiz:

```bash
npm install
npm --prefix frontend run worker:deploy
```

O arquivo `frontend/wrangler.jsonc` declara um único Worker, os assets compilados, fallback SPA e a Route wildcard.

## 3. DNS curinga

Mantenha `xfiatech.com` como zona no Cloudflare. Crie um registro DNS proxied para `*.sites` e associe a Route `*.sites.xfiatech.com/*` ao Worker `xfia-sites`. Registros DNS mais específicos têm precedência e podem ser usados para reservar hosts operacionais.

## 4. Cache

- JSON de resolução e preview: `no-store`.
- HTML do Worker: `max-age=0, must-revalidate`.
- Assets Vite com hash: cache da plataforma, sem conteúdo de cliente embutido.
- Imagens: URL do Cloudinary.

Não há purga obrigatória no MVP porque o conteúdo mutável não é armazenado na borda. `publication.version` é incrementada em cada publicação para permitir URLs imutáveis numa evolução posterior.

## 5. Teste local de subdomínio

Use um site já publicado e abra:

```text
http://slug-do-site.localhost:5173
```

Variáveis locais esperadas:

```env
PUBLIC_SITE_BASE_DOMAIN=localhost:5173
PUBLIC_SITE_SCHEME=http
VITE_PUBLIC_SITE_BASE_DOMAIN=localhost
```

## Checklist

- A API `/health` responde `200`.
- Publicar grava `publication.subdomain`, `publication.version` e `productionUrl`.
- `GET /api/public/sites/resolve?hostname=<slug>.sites.xfiatech.com` encontra apenas sites publicados ou suspensos.
- Rascunhos não são expostos pelo hostname.
- Site suspenso mostra a página neutra da XFia Tech.
- O JSON público responde com `Cache-Control: no-store`.
- Nenhuma credencial ou arquivo `.env` foi versionado.
