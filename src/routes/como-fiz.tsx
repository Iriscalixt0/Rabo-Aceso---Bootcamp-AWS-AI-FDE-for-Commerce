import { createFileRoute, Link } from "@tanstack/react-router";

import { Page } from "@/components/StoreChrome";

const VIDEO_EMBED_URL = "https://www.youtube.com/embed/QnLHFwRTioU";

export const Route = createFileRoute("/como-fiz")({
  head: () => ({
    meta: [
      { title: "Como eu fiz — Rabo Aceso" },
      {
        name: "description",
        content:
          "Arquitetura da loja Rabo Aceso: catálogo headless em JSON, mapeamento pra AWS, CDN/cache e BFF.",
      },
      { property: "og:title", content: "Como eu fiz a loja Rabo Aceso" },
      {
        property: "og:description",
        content: "Headless commerce, CloudFront/S3, Lighthouse e onde entraria um BFF.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComoFiz,
});

const secoes = [
  {
    titulo: "O que é isso",
    texto:
      "Rabo Aceso é uma loja de artigos pra pets construída como aplicação React com TanStack Start (rotas + SSR). O catálogo vive fora do código, em um products.json com 16 produtos (ração, petiscos, brinquedos, higiene, acessórios, camas e saúde), cada um com foto, preço, badge e categoria. Não há back-end nem banco: todo o estado do cliente (carrinho, conta, assinatura) é mantido em contexto React e persistido em localStorage.",
  },
  {
    titulo: "Por que separar o catálogo do front (headless commerce)",
    texto:
      "Nenhum produto está escrito dentro do JSX. A vitrine só sabe pedir “me dá a lista de produtos” (fetch do products.json em src/lib/catalog.ts) e desenhar o que receber — ela não sabe de antemão quantos produtos existem. Esse é o miolo do headless commerce: separar onde os dados moram (o “corpo”, que numa loja real seria uma API/CMS) de como eles aparecem (a “cabeça”, aqui a interface React). Trocar o catálogo inteiro não exige tocar em uma linha de componente.",
  },
  {
    titulo: "O que a loja faz hoje",
    texto:
      "Vitrine no estilo dos grandes varejistas pet: topbar utilitária, busca no header, barra de categorias, banner principal, faixa de benefícios e cards com preço no Pix e parcelamento. A busca e o filtro por categoria são estado global (SearchProvider), então clicar em “Ver ofertas” ou no banner “Leve 3, pague 2” já filtra a vitrine. Cada card tem seletor de quantidade antes de adicionar, e produtos “leve 3” já vêm com 3 unidades pré-selecionadas.",
  },
  {
    titulo: "Carrinho, promoção e checkout",
    texto:
      "O CartProvider guarda itens, quantidades e total, com frete grátis acima de R$ 199 e a regra “leve 3, pague 2” (a cada trio do mesmo item, uma unidade sai de graça) calculada no próprio contexto e mostrada no resumo. O checkout é fictício: formulário de entrega e pagamento, tela de confirmação com código do pedido, e o pedido é gravado no histórico da conta.",
  },
  {
    titulo: "Conta demo e assinatura",
    texto:
      "Como é um projeto de avaliação, existe um perfil demo (avaliador@raboaceso.com / bootcamp) que entra com um clique. Logado, a página /conta mostra histórico de pedidos, carrinho atual, promoções já vistas e a assinatura ativa; os checkouts já vêm preenchidos com dados pessoais e de pagamento. A assinatura de ração tem escolha de sabor, frequência e brinde — e, se já existir uma ativa, a página vira painel de gestão para evoluir/regressar de plano, trocar ração ou cancelar. Sem login, comprar ou assinar pede acesso primeiro (cadastro real está desativado de propósito).",
  },
  {
    titulo: "Se fosse pra AWS",
    texto:
      "Hoje o fetch busca um arquivo estático servido ao lado do site. Numa versão AWS, o navegador bateria numa CDN (CloudFront) servindo os assets de um bucket S3, e o products.json viraria uma chamada de API (API Gateway + Lambda lendo de um DynamoDB). O cache do CloudFront é o que evita que 10 mil acessos simultâneos cheguem todos na origem: a maioria é respondida na borda, perto do usuário. Carrinho e conta, hoje em localStorage, migrariam para uma sessão autenticada (Cognito) com persistência no banco.",
  },
  {
    titulo: "Performance e Lighthouse",
    texto:
      "Auditoria rodada ao vivo no vídeo (F12 → Lighthouse → Analyze), na página publicada e não na local. As fontes (Outfit + Figtree) usam display=swap com preconnect, as fotos de produto são JPGs otimizados com carregamento tardio fora da dobra e o SSR do TanStack Start entrega HTML pronto. Os primeiros alvos de melhoria são o peso do JavaScript e o dimensionamento das imagens promocionais.",
  },
  {
    titulo: "Onde entraria IA",
    texto:
      "Na busca: hoje ela compara texto literal; com embeddings, “algo pro meu cachorro que destrói tudo” encontraria a bolinha anti-tédio. Depois viria recomendação “quem comprou isso também levou” usando o histórico de pedidos da conta, sugestão automática de sabor/frequência na assinatura e um chat de atendimento que responde sobre tamanho e material lendo o próprio products.json.",
  },
];

const stack = [
  {
    item: "React 19 + TanStack Start (rotas em src/routes, SSR)",
    porque:
      "Cada arquivo vira uma página, o que mantém a navegação óbvia, e o SSR entrega HTML pronto — bom para o primeiro carregamento e para o SEO da loja.",
  },
  {
    item: "Catálogo headless em public/products.json, buscado via fetch — sem back-end",
    porque:
      "Separa dado de interface: dá para trocar o catálogo inteiro sem mexer no código, e amanhã esse fetch vira uma API real sem reescrever a vitrine.",
  },
  {
    item: "Tailwind CSS v4 com tokens da marca (pinho, mostarda, telha) em src/styles.css",
    porque:
      "As cores e espaçamentos ficam em um lugar só, então a identidade se mantém consistente em todas as telas e uma mudança de marca é um ajuste de tokens.",
  },
  {
    item: "Tipografia Outfit (títulos) + Figtree (texto)",
    porque:
      "Outfit dá presença aos títulos e Figtree é feita para leitura em tela; as duas carregam com display=swap para não bloquear a renderização.",
  },
  {
    item: "Contextos React: CartProvider, AuthProvider e SearchProvider, com localStorage",
    porque:
      "Carrinho, sessão e busca são usados por várias páginas ao mesmo tempo; contexto evita passar dados de componente em componente e o localStorage faz nada se perder ao recarregar.",
  },
  {
    item: "Rotas: / (vitrine), /carrinho, /checkout, /assinatura, /entrar, /conta, /como-fiz",
    porque:
      "Cada etapa da compra tem seu próprio endereço, então dá para compartilhar, favoritar e medir cada página separadamente.",
  },
  {
    item: "Fotos de produto e banners gerados por IA",
    porque:
      "A loja é fictícia e não existe acervo de fotos; gerar as imagens garante padrão visual consistente sem problema de direito de uso.",
  },
  {
    item: "Hospedagem estática com CDN na frente",
    porque:
      "Sem servidor para manter: o conteúdo é servido da borda, perto do usuário, o que deixa a loja rápida e aguenta pico de acesso.",
  },
];


function ComoFiz() {
  return (
    <Page>
      <div className="mx-auto max-w-[760px] px-[6vw] pb-24 pt-14">
        <Link to="/" className="mb-8 inline-block border-b border-foreground text-sm">
          ← voltar pra loja
        </Link>
        <h1 className="mb-2 font-display text-[clamp(2rem,4vw,2.8rem)] font-semibold">
          Como eu fiz essa loja
        </h1>
        <p className="mb-8 text-muted-foreground">
          Desafio Bootcamp AI/R — Trilha Commerce, agosto/2026
        </p>

        <div className="mb-10 aspect-video w-full overflow-hidden rounded-sm bg-primary">
          {VIDEO_EMBED_URL ? (
            <iframe
              src={VIDEO_EMBED_URL}
              title="Explicação da loja Rabo Aceso"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-primary-foreground">
              <span className="text-3xl" aria-hidden>
                🎬
              </span>
              <p className="font-display text-lg font-bold">Vídeo em breve</p>
              <p className="max-w-sm text-sm opacity-80">
                Cole o link do YouTube não listado ou do Loom em VIDEO_EMBED_URL.
              </p>
            </div>
          )}
        </div>

        {secoes.map((s) => (
          <section key={s.titulo} className="mb-9">
            <h2 className="mb-2.5 font-display text-[1.3rem] font-semibold">{s.titulo}</h2>
            <p className="text-muted-foreground">{s.texto}</p>
          </section>
        ))}

        <section className="mb-9">
          <h2 className="mb-2.5 font-display text-[1.3rem] font-semibold">
            Bônus: onde entraria um BFF
          </h2>
          <p className="text-muted-foreground">
            Se essa loja ganhasse um app mobile, um Backend for Frontend (BFF) entraria entre o app
            e as APIs internas — uma camada só pra moldar e agregar dados especificamente pro
            formato que o app mobile precisa, diferente do que o site web consome. Evita que o
            cliente mobile tenha que fazer várias chamadas separadas ou lidar com payloads pensados
            pra web.
          </p>
          <svg
            viewBox="0 0 720 300"
            xmlns="http://www.w3.org/2000/svg"
            className="mt-4 h-auto w-full rounded-sm border border-border bg-card"
            role="img"
            aria-label="Diagrama: site web e app mobile acessando catálogo via CDN e BFF"
          >
            <defs>
              <marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#3a4a43" />
              </marker>
            </defs>
            <g fill="#f6f1e4" stroke="#16241f" strokeWidth="1.5">
              <rect x="20" y="30" width="120" height="50" rx="4" />
              <rect x="20" y="200" width="120" height="50" rx="4" />
              <rect x="480" y="30" width="140" height="50" rx="4" />
              <rect x="480" y="115" width="140" height="50" rx="4" />
              <rect x="480" y="200" width="140" height="50" rx="4" />
              <rect x="220" y="200" width="140" height="50" rx="4" fill="#e2a53a" />
            </g>
            <g fontSize="13" fill="#16241f" textAnchor="middle" fontFamily="Work Sans, sans-serif">
              <text x="80" y="52">
                Site web
              </text>
              <text x="80" y="222">
                App mobile
              </text>
              <text x="290" y="222">
                BFF mobile
              </text>
              <text x="550" y="52">
                CDN (cache)
              </text>
              <text x="550" y="137">
                API produtos
              </text>
              <text x="550" y="222">
                Banco
              </text>
            </g>
            <g
              fontSize="10.5"
              fill="#3a4a43"
              textAnchor="middle"
              fontFamily="Work Sans, sans-serif"
            >
              <text x="80" y="67">
                este projeto
              </text>
              <text x="80" y="237">
                futuro
              </text>
              <text x="290" y="237">
                molda os dados p/ o app
              </text>
              <text x="550" y="67">
                CloudFront
              </text>
              <text x="550" y="152">
                API Gateway + Lambda
              </text>
              <text x="550" y="237">
                DynamoDB
              </text>
            </g>
            <g stroke="#3a4a43" strokeWidth="1.5" fill="none" markerEnd="url(#ah)">
              <path d="M140,55 L480,55" />
              <path d="M140,225 L220,225" />
              <path d="M360,215 L480,150" />
              <path d="M550,165 L550,200" />
            </g>
          </svg>
        </section>

        <section>
          <h2 className="mb-2.5 font-display text-[1.3rem] font-semibold">
            Stack — e por que cada escolha
          </h2>
          <ul className="grid gap-2">
            {stack.map((s) => (
              <li
                key={s.item}
                className="rounded-sm border border-border bg-card px-3.5 py-3 text-[0.92rem]"
              >
                <p className="font-medium">{s.item}</p>
                <p className="mt-1 text-[0.86rem] text-muted-foreground">{s.porque}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Page>
  );
}
