# 🐾 Rabo Aceso — loja de artigos para pets

Loja fictícia criada para o desafio de bootcamp **"Minha Loja no Ar"** (Trilha Commerce,
AI/R, agosto/2026). O catálogo vive num arquivo JSON separado do front (abordagem
*headless commerce*) e a vitrine consome esse arquivo via `fetch`.

**🔗 Loja no ar:** [SUA_URL_PUBLICADA_AQUI](https://SUA_URL_PUBLICADA_AQUI)
**🎥 Vídeo explicando o projeto:** veja a página [`/como-fiz`](https://SUA_URL_PUBLICADA_AQUI/como-fiz)

---

## O que tem aqui

- Vitrine com **busca e filtro por categoria**
- Catálogo em `public/products.json` (16 produtos, 7 categorias), carregado via
  `fetch` — nenhum produto está escrito no código da página
- Carrinho com a promoção "leve 3, pague 2" e frete grátis acima de R$ 199
- Checkout fictício, login com perfil demo e assinatura recorrente de ração
- Página [`/como-fiz`](./src/routes/como-fiz.tsx) explicando as decisões técnicas
  (headless commerce, mapeamento pra AWS, cache/CDN e onde entraria um BFF)

## Como rodar localmente

```sh
npm i
npm run dev
```

Depois abra `http://localhost:8080`.

### Build de produção

```sh
npm run build
```

Gera o build no formato esperado pela [Vercel](https://vercel.com) (Build Output API,
pasta `.vercel/output`), pronto pra deploy zero-config — basta conectar o
repositório no dashboard da Vercel ou rodar `vercel deploy` na raiz do projeto.

## Mapa do projeto (em português simples)

| Onde                                   | O que é                                                                             |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| `public/products.json`                  | O catálogo: nome, preço, categoria e foto de cada produto. Mexer aqui muda a loja.   |
| `public/products/` e `public/promos/`   | As fotos dos produtos e dos banners.                                               |
| `src/routes/`                           | Cada arquivo é uma página do site (o nome do arquivo vira o endereço).             |
| `src/components/`                       | Pedaços de tela reaproveitados em várias páginas.                                  |
| `src/lib/`                              | A "lógica": carrinho, login, busca e leitura do catálogo.                          |
| `src/server.ts` / `src/start.ts`        | Configuração do servidor: renderização (SSR) e tratamento de erro.                 |
| `src/styles.css`                        | Cores da marca, fontes e estilos gerais.                                           |

### Páginas (`src/routes/`)

| Arquivo           | Endereço      | O que faz                                                                     |
| ------------------ | ------------- | -------------------------------------------------------------------------------- |
| `index.tsx`        | `/`           | Vitrine: banner, busca, filtros por categoria e os cards de produto.          |
| `carrinho.tsx`     | `/carrinho`   | Itens escolhidos, quantidade, frete e total.                                  |
| `checkout.tsx`     | `/checkout`   | Finalização de compra fictícia (dados e pagamento).                           |
| `assinatura.tsx`   | `/assinatura` | Plano de ração recorrente: sabor, frequência, brinde e gestão do plano atual. |
| `entrar.tsx`       | `/entrar`     | Login e cadastro (com o perfil demo do avaliador).                            |
| `conta.tsx`        | `/conta`      | Histórico de pedidos, assinatura ativa e promoções já vistas.                 |
| `como-fiz.tsx`     | `/como-fiz`   | Página de documentação e vídeo exigida pelo desafio.                          |
| `__root.tsx`       | —             | Moldura comum: cabeçalho, rodapé e configurações de SEO.                      |

### Componentes (`src/components/`)

- `StoreChrome.tsx` — cabeçalho com busca, menu de categorias e o rodapé.
- `LoginGate.tsx` — tela que pede login antes de comprar ou assinar.
- `StatusPedido.tsx` — status do pedido na conta.

### Lógica (`src/lib/`)

- `catalog.ts` — lê o `products.json` via `fetch` e entrega os produtos para as páginas.
- `cart.tsx` — carrinho: adicionar, remover, quantidade, total e a promoção "leve 3, pague 2".
- `auth.tsx` — login fictício, perfil demo e o que fica guardado na conta.
- `search.tsx` — texto buscado e categoria selecionada, compartilhados entre header e vitrine.
- `error-capture.ts` / `error-page.ts` — captura e página de fallback para erros do servidor.

## Perfil demo

Para testar tudo sem criar conta: **avaliador@raboaceso.com** / senha **bootcamp**
(ou o botão "Entrar com perfil demo" na página `/entrar`).

## Tecnologias

- **React 19 + TypeScript**
- **TanStack Start / Router** — páginas por arquivo e renderização no servidor (SSR)
- **Vite 8** — build e dev server
- **Tailwind CSS v4** — estilos e tokens de marca
- **Nitro** — build do servidor para deploy

## Sobre o desafio

Projeto individual do Bootcamp AI/R — Trilha Commerce. Requisitos: catálogo headless
via JSON, busca/filtro na vitrine, hospedagem pública gratuita e uma página `/como-fiz`
explicando as decisões técnicas em vídeo. Veja o detalhamento completo em
[`/como-fiz`](https://SUA_URL_PUBLICADA_AQUI/como-fiz).