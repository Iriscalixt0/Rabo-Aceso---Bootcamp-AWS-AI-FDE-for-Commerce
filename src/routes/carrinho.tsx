import { createFileRoute, Link } from "@tanstack/react-router";

import { Page } from "@/components/StoreChrome";
import { descontoItem, useCart } from "@/lib/cart";
import { formatarPreco } from "@/lib/catalog";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — Rabo Aceso" },
      {
        name: "description",
        content: "Revise os itens do seu carrinho, ajuste quantidades e veja o total do pedido.",
      },
      { property: "og:title", content: "Carrinho — Rabo Aceso" },
      {
        property: "og:description",
        content: "Quantidades, subtotal e frete calculados antes do checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarrinhoPage,
});

function CarrinhoPage() {
  const { itens, total, desconto, definirQuantidade, remover, limpar } = useCart();
  const frete = total >= 199 || total === 0 ? 0 : 24.9;

  return (
    <Page>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="mb-2 font-display text-4xl font-extrabold text-foreground lg:text-5xl">
          Seu carrinho
        </h1>
        <p className="mb-10 text-muted-foreground">
          Ajuste as quantidades e siga para o checkout quando estiver tudo certo.
        </p>

        {itens.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <p className="mb-6 text-muted-foreground">Seu carrinho ainda está vazio.</p>
            <Link
              to="/"
              className="inline-block rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-brick"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <ul className="space-y-4">
              {itens.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-5 rounded-3xl border border-border bg-card p-5"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-20 w-20 items-center justify-center rounded-2xl bg-background text-4xl"
                      aria-hidden
                    >
                      {item.icon}
                    </span>
                  )}
                  <div className="min-w-[180px] flex-1">
                    <h2 className="font-display text-lg font-bold text-foreground">{item.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {formatarPreco(item.price)} por unidade
                    </p>
                    {item.leve3 ? (
                      <p className="mt-1 text-sm font-semibold text-brick">
                        {descontoItem(item) > 0
                          ? `Leve 3, pague 2 — economia de ${formatarPreco(descontoItem(item))}`
                          : `Leve 3, pague 2 — adicione ${3 - (item.quantidade % 3)} pra ganhar 1`}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-border">
                      <button
                        type="button"
                        aria-label={`Diminuir quantidade de ${item.name}`}
                        onClick={() => definirQuantidade(item.id, item.quantidade - 1)}
                        className="px-3 py-2 text-lg leading-none text-foreground hover:text-brick"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center font-semibold">{item.quantidade}</span>
                      <button
                        type="button"
                        aria-label={`Aumentar quantidade de ${item.name}`}
                        onClick={() => definirQuantidade(item.id, item.quantidade + 1)}
                        className="px-3 py-2 text-lg leading-none text-foreground hover:text-brick"
                      >
                        +
                      </button>
                    </div>
                    <span className="min-w-24 text-right font-display text-lg font-extrabold">
                      {formatarPreco(item.price * item.quantidade)}
                    </span>
                    <button
                      type="button"
                      onClick={() => remover(item.id)}
                      className="text-sm text-muted-foreground underline hover:text-brick"
                    >
                      remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6">
              <h2 className="mb-5 font-display text-xl font-bold">Resumo do pedido</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatarPreco(total + desconto)}</dd>
                </div>
                {desconto > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Leve 3, pague 2</dt>
                    <dd className="font-semibold text-brick">−{formatarPreco(desconto)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Frete</dt>
                  <dd className="font-semibold">{frete === 0 ? "grátis" : formatarPreco(frete)}</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
                <span className="font-display text-lg font-bold">Total</span>
                <span className="font-display text-2xl font-extrabold">
                  {formatarPreco(total + frete)}
                </span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 block rounded-full bg-primary px-6 py-4 text-center font-semibold text-primary-foreground transition-colors hover:bg-brick"
              >
                Finalizar compra
              </Link>
              <div className="mt-4 flex justify-between text-sm">
                <Link to="/" className="text-muted-foreground underline hover:text-foreground">
                  Continuar comprando
                </Link>
                <button
                  type="button"
                  onClick={limpar}
                  className="text-muted-foreground underline hover:text-brick"
                >
                  Esvaziar carrinho
                </button>
              </div>
            </aside>
          </div>
        )}
      </section>
    </Page>
  );
}
