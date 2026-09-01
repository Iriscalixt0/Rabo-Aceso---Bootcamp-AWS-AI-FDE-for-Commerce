import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { BenefitStrip, Page } from "@/components/StoreChrome";
import { useCart } from "@/lib/cart";
import { CATEGORY_LABELS, fetchCatalogo, formatarPreco, type Produto } from "@/lib/catalog";
import { useSearch } from "@/lib/search";
import { statusAtual, useAuth } from "@/lib/auth";
import { EtiquetaStatus } from "@/components/StatusPedido";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rabo Aceso — tudo pro seu bicho" },
      {
        name: "description",
        content: "Rabo Aceso: ração, brinquedos, higiene e acessórios pra cães e gatos.",
      },
      { property: "og:title", content: "Rabo Aceso — tudo pro seu bicho" },
      {
        property: "og:description",
        content: "Catálogo headless: 12 produtos carregados de products.json, com busca e filtro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Vitrine,
});

const ORDENACOES = [
  { id: "relevancia", label: "Mais relevantes" },
  { id: "menor", label: "Menor preço" },
  { id: "maior", label: "Maior preço" },
  { id: "nome", label: "Nome A-Z" },
];

function Vitrine() {
  const { query, setQuery, categoria, setCategoria } = useSearch();
  const { usuario, verPromocao } = useAuth();
  const [ordem, setOrdem] = useState("relevancia");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["catalogo"],
    queryFn: fetchCatalogo,
  });

  const produtos = Array.isArray(data) ? data : [];

  const categorias = useMemo(
    () => ["todos", "ofertas", ...Array.from(new Set(produtos.map((p) => p.category)))],
    [produtos],
  );

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    const lista = produtos.filter((p) => {
      const casaCategoria =
        categoria === "todos"
          ? true
          : categoria === "ofertas"
            ? Boolean(p.badge)
            : p.category === categoria;
      const casaBusca =
        !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return casaCategoria && casaBusca;
    });
    if (ordem === "menor") return [...lista].sort((a, b) => a.price - b.price);
    if (ordem === "maior") return [...lista].sort((a, b) => b.price - a.price);
    if (ordem === "nome") return [...lista].sort((a, b) => a.name.localeCompare(b.name));
    return lista;
  }, [produtos, query, categoria, ordem]);

  const destaques = produtos.filter((p) => p.badge).slice(0, 4);

  function selecionarCategoria(c: string) {
    setCategoria(c);
    if (c === "ofertas") verPromocao("Promoções do dia");
    if (c === "petiscos") verPromocao("Leve 3, pague 2 — Petiscos");
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Page>
      {usuario ? <PainelCliente produtos={produtos} /> : null}
      <section className="bg-background px-6 pt-6">

        <div className="mx-auto flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:max-w-7xl lg:grid-cols-[2fr_1fr] lg:overflow-visible lg:pb-0">
          <div className="relative w-[86%] shrink-0 snap-center overflow-hidden rounded-2xl bg-primary px-8 py-12 text-primary-foreground lg:w-auto lg:px-14 lg:py-16">
            <img
              src="/promos/hero-mulher-cachorro.jpg"
              alt="Mulher sorrindo brincando com seu cachorro no parque"
              width={1536}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover object-right"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/30"
            />
            <div className="relative">
              <span className="inline-block rounded-full bg-mustard px-3 py-1 text-xs font-bold uppercase tracking-wider text-mustard-foreground">
                Semana do pet
              </span>
              <h1 className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-tight lg:text-5xl">
                Até 25% OFF em ração, petiscos e brinquedos
              </h1>
              <p className="mt-4 max-w-md text-primary-foreground/80">
                Frete grátis acima de R$ 199 e 5% de desconto pagando no Pix.
              </p>
              <button
                type="button"
                onClick={() => selecionarCategoria("ofertas")}
                className="mt-8 inline-block rounded-full bg-mustard px-8 py-3.5 font-semibold text-mustard-foreground transition-opacity hover:opacity-90"
              >
                Ver ofertas
              </button>
            </div>
          </div>
          <div className="contents lg:grid lg:gap-4">
            <button
              type="button"
              onClick={() => selecionarCategoria("petiscos")}
              className="group relative w-[86%] shrink-0 snap-center overflow-hidden rounded-2xl bg-mustard text-left text-mustard-foreground transition-shadow hover:shadow-xl lg:w-auto"
            >
              <img
                src="/promos/leve3.jpg"
                alt="Petiscos em promoção leve 3 pague 2"
                loading="lazy"
                width={1024}
                height={768}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-mustard via-mustard/85 to-transparent"
              />
              <div className="relative px-7 py-8">
                <span className="inline-block rounded-full bg-mustard-foreground/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  Oferta
                </span>
                <p className="mt-3 font-display text-2xl font-extrabold">Leve 3, pague 2</p>
                <p className="mt-2 text-sm opacity-80">Em petiscos selecionados</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Ver petiscos
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </button>

            {usuario ? null : (
              <Link
                to="/assinatura"
                className="group relative flex h-full w-[86%] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-2xl bg-brick px-7 py-8 text-left text-brick-foreground transition-shadow hover:shadow-xl lg:w-auto"
              >
                <img
                  src="/promos/assinatura-racao.jpg"
                  alt="Saco de ração premium com cachorro ao lado"
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brick via-brick/90 to-brick/20"
                />

                <div className="relative">
                  <span className="inline-block rounded-full bg-brick-foreground/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                    Economize sempre
                  </span>
                  <p className="mt-4 font-display text-2xl font-extrabold leading-tight">
                    Assinatura de ração
                  </p>
                  <p className="mt-2 text-sm opacity-80">
                    10% off em toda recompra + entrega programada
                  </p>
                </div>
                <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  Assinar agora
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            )}

          </div>
        </div>
      </section>

      <div className="mt-8">
        <BenefitStrip />
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-5 font-display text-xl font-bold text-foreground">
          Compre por categoria
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categorias
            .filter((c) => c !== "todos")
            .map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => selecionarCategoria(c)}
                className={
                  "rounded-xl border px-4 py-5 text-sm font-semibold transition-colors " +
                  (categoria === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary hover:text-brick")
                }
              >
                {CATEGORY_LABELS[c] ?? c}
              </button>
            ))}
        </div>
      </section>

      {destaques.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-4">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">Destaques da semana</h2>
            <a href="#catalogo" className="text-sm font-semibold text-brick hover:underline">
              Ver todos
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {destaques.map((p) => (
              <CardProduto key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}

      <section id="catalogo" className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-foreground">
              {categoria === "todos"
                ? "Todos os produtos"
                : (CATEGORY_LABELS[categoria] ?? categoria)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground" role="status">
              {isPending
                ? "carregando…"
                : `${filtrados.length} produto${filtrados.length === 1 ? "" : "s"} encontrados`}
              {query.trim() && ` para “${query.trim()}”`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {categoria !== "todos" && (
              <button
                type="button"
                onClick={() => selecionarCategoria("todos")}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-brick hover:text-brick"
              >
                Limpar filtro
              </button>
            )}
            <label htmlFor="ordem" className="text-sm text-muted-foreground">
              Ordenar por
            </label>
            <select
              id="ordem"
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-mustard"
            >
              {ORDENACOES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 md:hidden">
          <label htmlFor="busca-mobile" className="sr-only">
            Buscar produtos
          </label>
          <input
            id="busca-mobile"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busque por ração, brinquedo, coleira…"
            className="w-full rounded-full border border-border bg-card px-5 py-3 text-foreground outline-none focus:ring-2 focus:ring-mustard"
          />
        </div>

        {isError && (
          <div className="rounded-2xl border border-brick bg-card p-4 text-sm text-brick">
            Não deu pra carregar o catálogo agora. ({(error as Error).message})
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {isPending &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl border border-border bg-muted"
              />
            ))}
          {filtrados.map((p) => (
            <CardProduto key={p.id} produto={p} />
          ))}
        </div>

        {!isPending && !isError && filtrados.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            Nada encontrado. Tenta outra palavra ou categoria.
          </div>
        )}
      </section>
    </Page>
  );
}

function PainelCliente({ produtos }: { produtos: Produto[] }) {
  const { usuario } = useAuth();
  const { adicionar } = useCart();
  const [repetido, setRepetido] = useState(false);

  if (!usuario) return null;

  const ultimoPedido = [...usuario.pedidos].sort(
    (a, b) => new Date(b.criadoEm ?? 0).getTime() - new Date(a.criadoEm ?? 0).getTime(),
  )[0];
  const assinatura = usuario.assinaturas[0];

  function repetirPedido() {
    if (!ultimoPedido) return;
    ultimoPedido.itens.forEach((item) => {
      const produto = produtos.find((p) => p.name === item.name);
      if (produto) adicionar(produto, item.quantidade);
    });
    setRepetido(true);
  }

  return (
    <section className="bg-background px-6 pt-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sua área
            </p>
            <h2 className="font-display text-2xl font-extrabold">
              Bem-vinda de volta, {usuario.nome.split(" ")[0]}
            </h2>
          </div>
          <Link
            to="/conta"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-brick hover:text-brick"
          >
            Minha conta
          </Link>
        </div>

        <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
          <div className="flex w-[85%] min-w-0 shrink-0 snap-start flex-col rounded-xl bg-muted p-4 sm:w-[60%] md:w-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Último pedido
            </p>
            {ultimoPedido ? (
              <>
                <p className="mt-2 text-sm font-semibold">{ultimoPedido.codigo}</p>
                <div className="mt-2">
                  <EtiquetaStatus status={statusAtual(ultimoPedido)} />
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Nenhum pedido ainda.</p>
            )}
          </div>

          <div className="flex w-[85%] min-w-0 shrink-0 snap-start flex-col rounded-xl bg-muted p-4 sm:w-[60%] md:w-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Comprar de novo
            </p>
            {ultimoPedido ? (
              <>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {ultimoPedido.itens.map((i) => `${i.quantidade}× ${i.name}`).join(", ")}
                </p>
                <button
                  type="button"
                  onClick={repetirPedido}
                  className="mt-3 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brick"
                >
                  {repetido ? "Adicionado ✓" : "Repetir pedido"}
                </button>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Faça seu primeiro pedido para repetir com um clique.
              </p>
            )}
          </div>

          <div className="flex w-[85%] min-w-0 shrink-0 snap-start flex-col rounded-xl bg-muted p-4 sm:w-[60%] md:w-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Assinatura
            </p>
            {assinatura ? (
              <>
                <p className="mt-2 text-sm font-semibold">{assinatura.racao}</p>
                <p className="text-sm text-muted-foreground">Plano {assinatura.plano}</p>
                <Link
                  to="/assinatura"
                  className="mt-3 inline-block text-sm font-semibold text-brick underline-offset-4 hover:underline"
                >
                  Gerenciar assinatura
                </Link>
              </>
            ) : (
              <Link
                to="/assinatura"
                className="mt-3 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brick"
              >
                Assinar ração
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


function CardProduto({ produto }: { produto: Produto }) {
  const { adicionar } = useCart();
  const [adicionado, setAdicionado] = useState(false);
  const leve3 = produto.badge?.toLowerCase().includes("leve 3") ?? false;
  const [qtd, setQtd] = useState(leve3 ? 3 : 1);

  const precoDe = produto.price * 1.25;
  const precoPix = produto.price * 0.95;
  const parcela = produto.price / 10;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lift">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-background">
        <div className="absolute left-2 right-2 top-2 z-10 flex flex-wrap items-start gap-1">
          <span className="rounded-md bg-brick px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brick-foreground">
            25% OFF
          </span>
          {produto.badge && (
            <span className="rounded-md bg-mustard px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-mustard-foreground">
              {produto.badge}
            </span>
          )}
        </div>
        {produto.image ? (
          <img
            src={produto.image}
            alt={produto.name}
            loading="lazy"
            width={768}
            height={768}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-6xl" aria-hidden>
            {produto.icon}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {CATEGORY_LABELS[produto.category] ?? produto.category}
        </span>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {produto.name}
        </h3>
        <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <span className="text-mustard" aria-hidden>
            ★★★★★
          </span>
          <span>(4,8)</span>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-muted-foreground line-through">{formatarPreco(precoDe)}</p>
          <p className="font-display text-2xl font-extrabold text-foreground">
            {formatarPreco(produto.price)}
          </p>
          <p className="text-xs font-semibold text-primary">
            {formatarPreco(precoPix)} no Pix (5% off)
          </p>
          <p className="mb-4 text-xs text-muted-foreground">
            ou 10x de {formatarPreco(parcela)} sem juros
          </p>
          <div className="mb-2 flex items-center justify-between rounded-full border border-border px-1 py-1">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              onClick={() => setQtd((q) => Math.max(1, q - 1))}
              className="h-8 w-8 rounded-full text-lg font-bold text-foreground transition-colors hover:bg-background"
            >
              −
            </button>
            <span className="text-sm font-semibold tabular-nums" aria-live="polite">
              {qtd}
            </span>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => setQtd((q) => Math.min(99, q + 1))}
              className="h-8 w-8 rounded-full text-lg font-bold text-foreground transition-colors hover:bg-background"
            >
              +
            </button>
          </div>
          <button
            type="button"
            aria-label={`Adicionar ${produto.name} ao carrinho`}
            onClick={() => {
              adicionar(produto, qtd);
              setAdicionado(true);
              window.setTimeout(() => setAdicionado(false), 1600);
            }}
            className="w-full rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-brick"
          >
            {adicionado ? "Adicionado ✓" : "Adicionar"}
          </button>
        </div>
      </div>
    </article>
  );
}
