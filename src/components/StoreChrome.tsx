import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { CATEGORY_LABELS, formatarPreco } from "@/lib/catalog";
import { useSearch } from "@/lib/search";

const CATEGORIAS = ["racao", "petiscos", "brinquedos", "higiene", "acessorios", "camas", "saude"];

export function StoreHeader() {
  const { totalItens, total } = useCart();
  const { usuario } = useAuth();
  const { query, setQuery, setCategoria } = useSearch();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs">
          <p className="font-medium">Frete grátis acima de R$ 199 para todo o Brasil</p>
          <div className="hidden gap-6 sm:flex">
            <span>Atendimento seg a sex, 9h às 18h</span>
            <span>Até 10x sem juros</span>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6">
          <Link to="/" className="flex shrink-0 items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold tracking-tight text-foreground">
              RABO ACESO
            </span>
          </Link>

          <form
            className="relative hidden flex-1 md:block"
            onSubmit={(e) => {
              e.preventDefault();
              void navigate({ to: "/", hash: "catalogo" });
            }}
          >
            <label htmlFor="busca-topo" className="sr-only">
              Buscar produtos
            </label>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              id="busca-topo"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por ração, brinquedo, coleira…"
              className="w-full rounded-full border border-border bg-card py-3 pl-12 pr-4 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-mustard"
            />
          </form>

          <nav className="hidden shrink-0 gap-6 text-sm font-medium lg:flex">
            <Link to="/como-fiz" className="transition-colors hover:text-brick">
              Como eu fiz
            </Link>
            <Link
              to={usuario ? "/conta" : "/entrar"}
              className="transition-colors hover:text-brick"
            >
              {usuario ? usuario.nome.split(" ")[0] : "Entrar"}
            </Link>
          </nav>

          <Link
            to={usuario ? "/conta" : "/entrar"}
            aria-label={usuario ? "Minha conta" : "Entrar"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brick hover:text-brick lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 20v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1M12 11a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </Link>

          <Link
            to="/carrinho"
            aria-label={`Carrinho com ${totalItens} item(ns)`}
            className="flex shrink-0 items-center gap-3 rounded-full bg-primary px-4 py-2.5 text-primary-foreground transition-colors hover:bg-brick"
          >
            <span className="relative">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItens > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-mustard px-1 text-[11px] font-bold text-mustard-foreground">
                  {totalItens}
                </span>
              )}
            </span>
            <span className="hidden text-sm font-semibold sm:inline">{formatarPreco(total)}</span>
          </Link>
        </div>

        <form
          className="relative mx-auto max-w-7xl px-6 pb-4 md:hidden"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ to: "/", hash: "catalogo" });
          }}
        >
          <label htmlFor="busca-mobile" className="sr-only">
            Buscar produtos
          </label>
          <input
            id="busca-mobile"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produtos…"
            className="w-full rounded-full border border-border bg-card py-3 pl-5 pr-4 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-mustard"
          />
        </form>
      </div>


      {usuario ? null : (
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl snap-x gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1 sm:px-6 sm:py-0">
            <Link
              to="/"
              hash="catalogo"
              onClick={() => setCategoria("ofertas")}
              className="snap-start whitespace-nowrap rounded-full bg-brick/10 px-3.5 py-2 text-sm font-bold text-brick transition-colors sm:rounded-none sm:border-b-2 sm:border-transparent sm:bg-transparent sm:px-4 sm:py-3 sm:hover:border-brick"
            >
              Promoções do dia
            </Link>
            {CATEGORIAS.map((c) => (
              <Link
                key={c}
                to="/"
                hash="catalogo"
                onClick={() => setCategoria(c)}
                className="snap-start whitespace-nowrap rounded-full border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:text-brick sm:rounded-none sm:border-0 sm:border-b-2 sm:border-transparent sm:px-4 sm:py-3 sm:hover:border-brick"
              >
                {CATEGORY_LABELS[c] ?? c}
              </Link>
            ))}
          </div>
        </div>
      )}

    </header>
  );
}

export function BenefitStrip() {
  const itens = [
    { titulo: "Frete grátis", texto: "Acima de R$ 199" },
    { titulo: "Até 10x sem juros", texto: "No cartão de crédito" },
    { titulo: "5% off no Pix", texto: "Desconto à vista" },
    { titulo: "Troca fácil", texto: "Até 30 dias" },
  ];
  return (
    <section className="border-y border-border bg-card">
      <ul className="mx-auto flex max-w-7xl snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:py-6">
        {itens.map((i) => (
          <li
            key={i.titulo}
            className="flex w-[70%] shrink-0 snap-start items-center gap-3 rounded-xl border border-border bg-background p-3 sm:w-[45%] lg:w-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mustard/25 text-primary lg:h-10 lg:w-10">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <strong className="block text-sm font-bold leading-tight text-foreground">
                {i.titulo}
              </strong>
              <span className="text-xs leading-tight text-muted-foreground">{i.texto}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function StoreFooter() {
  return (
    <footer className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2 className="mb-5 font-display text-3xl font-extrabold">RABO ACESO</h2>
          <p className="mb-6 max-w-sm text-primary-foreground/60">
            Curadoria de ração, brinquedos, higiene e conforto pra cães e gatos. Catálogo enxuto,
            escolha fácil, entrega em todo o Brasil.
          </p>
          <p className="text-sm text-primary-foreground/40">
            Projeto de estudo — Bootcamp AI/R, Trilha Commerce.
          </p>
          <p className="mt-1 text-sm text-primary-foreground/60">
            Desenvolvido por Thamiris Calixto Bordião.
          </p>
        </div>
        <div>
          <h4 className="mb-5 font-display font-bold">Loja</h4>
          <ul className="space-y-3 text-primary-foreground/60">
            <li>
              <Link to="/" className="transition-colors hover:text-mustard">
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link to="/carrinho" className="transition-colors hover:text-mustard">
                Meu carrinho
              </Link>
            </li>
            <li>
              <Link to="/como-fiz" className="transition-colors hover:text-mustard">
                Como essa loja foi construída
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-5 font-display font-bold">Atendimento</h4>
          <ul className="space-y-3 text-primary-foreground/60">
            <li>suporte@raboaceso.com</li>
            <li>Seg a sex, 9h às 18h</li>
            <li>Rio de Janeiro, RJ</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl border-t border-primary-foreground/10 px-6 pt-8 text-sm text-primary-foreground/30">
        © {new Date().getFullYear()} Rabo Aceso. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  );
}
