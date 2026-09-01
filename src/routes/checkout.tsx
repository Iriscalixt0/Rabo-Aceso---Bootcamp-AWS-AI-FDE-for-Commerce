import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { LoginGate } from "@/components/LoginGate";
import { EtiquetaStatus, TrilhaStatus } from "@/components/StatusPedido";
import { Page } from "@/components/StoreChrome";
import { DADOS_DEMO, DEMO_EMAIL, useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { formatarPreco } from "@/lib/catalog";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Rabo Aceso" },
      {
        name: "description",
        content: "Checkout de demonstração: dados de entrega, pagamento fictício e confirmação.",
      },
      { property: "og:title", content: "Checkout — Rabo Aceso" },
      {
        property: "og:description",
        content: "Fluxo de compra fictício para o projeto de estudo da loja Rabo Aceso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { itens, total, desconto, limpar } = useCart();
  const { registrarPedido, usuario } = useAuth();
  const demo = usuario?.email === DEMO_EMAIL ? DADOS_DEMO : null;
  const [pedido, setPedido] = useState<{
    codigo: string;
    valor: number;
    itens: { name: string; quantidade: number; price: number }[];
  } | null>(null);
  const frete = total >= 199 || total === 0 ? 0 : 24.9;

  if (!usuario && !pedido) return <LoginGate acao="finalizar a compra" />;

  if (pedido) {
    return (
      <Page>
        <section className="mx-auto max-w-xl px-6 py-16">
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="border-b border-border bg-primary px-6 py-8 text-center text-primary-foreground sm:px-10">
              <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-mustard text-mustard-foreground">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
                Pedido confirmado
              </h1>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Código <strong className="font-semibold">{pedido.codigo}</strong>
              </p>
            </div>

            <dl className="divide-y divide-border px-6 sm:px-10">
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm text-muted-foreground">Confirmação enviada</dt>
                <dd className="text-right text-sm font-semibold text-foreground">
                  {demo?.email ?? usuario?.email}
                </dd>
              </div>
              {demo && (
                <div className="flex items-start justify-between gap-4 py-4">
                  <dt className="text-sm text-muted-foreground">Entrega</dt>
                  <dd className="text-right text-sm font-semibold text-foreground">
                    {demo.endereco} — {demo.cidade}/{demo.uf}
                  </dd>
                </div>
              )}
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="text-right">
                  <EtiquetaStatus status="Em preparação" />
                </dd>
              </div>
              {pedido.itens.map((i) => (
                <div key={i.name} className="flex items-start justify-between gap-4 py-4">
                  <dt className="text-sm text-muted-foreground">
                    {i.quantidade}× {i.name}
                  </dt>
                  <dd className="text-right text-sm font-semibold text-foreground">
                    {formatarPreco(i.price * i.quantidade)}
                  </dd>
                </div>
              ))}
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm font-semibold text-foreground">Total pago</dt>
                <dd className="text-right">
                  <span className="block font-display text-xl font-extrabold text-foreground">
                    {formatarPreco(pedido.valor)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {frete === 0 ? "Frete grátis" : `Frete ${formatarPreco(frete)}`}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="border-t border-border px-6 py-6 sm:px-10">
              <h2 className="mb-4 font-display text-base font-bold">Acompanhamento</h2>
              <TrilhaStatus status="Em preparação" />
              <p className="mt-4 text-xs text-muted-foreground">
                A loja atualiza o status automaticamente a cada etapa da logística.
              </p>
            </div>

            <div className="space-y-3 border-t border-border bg-muted px-6 py-6 sm:px-10">
              <Link
                to="/conta"
                className="block rounded-full bg-primary px-8 py-3.5 text-center font-semibold text-primary-foreground transition-colors hover:bg-brick"
              >
                Acompanhar pedido
              </Link>
              <Link
                to="/"
                className="block rounded-full border border-border bg-card px-8 py-3.5 text-center font-semibold text-foreground transition-colors hover:border-brick hover:text-brick"
              >
                Continuar comprando
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                Checkout fictício: nenhum pagamento real foi processado.
              </p>
            </div>
          </div>
        </section>
      </Page>
    );
  }

  if (itens.length === 0) {
    return (
      <Page>
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="mb-4 font-display text-3xl font-extrabold">Nada pra finalizar ainda</h1>
          <p className="mb-8 text-muted-foreground">Adicione produtos ao carrinho pra continuar.</p>
          <Link
            to="/"
            className="inline-block rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-colors hover:bg-brick"
          >
            Ver produtos
          </Link>
        </section>
      </Page>
    );
  }

  return (
    <Page>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="mb-2 font-display text-4xl font-extrabold lg:text-5xl">Checkout</h1>
        <p className="mb-10 text-muted-foreground">
          Fluxo de demonstração — os dados não saem do seu navegador.
        </p>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <form
            key={demo ? "demo" : "vazio"}
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              const codigo = `RA-${Math.floor(100000 + Math.random() * 900000)}`;
              const valor = total + frete;
              registrarPedido({
                codigo,
                valor,
                data: new Date().toISOString().slice(0, 10),
                itens: itens.map((i) => ({
                  name: i.name,
                  quantidade: i.quantidade,
                  price: i.price,
                })),
              });
              setPedido({
                codigo,
                valor,
                itens: itens.map((i) => ({
                  name: i.name,
                  quantidade: i.quantidade,
                  price: i.price,
                })),
              });
              limpar();
            }}
          >
            <fieldset className="rounded-3xl border border-border bg-card p-6">
              <legend className="px-2 font-display text-lg font-bold">Entrega</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo
                  id="nome"
                  label="Nome completo"
                  className="sm:col-span-2"
                  defaultValue={demo?.nome}
                />
                <Campo id="email" label="E-mail" type="email" defaultValue={demo?.email} />
                <Campo id="cep" label="CEP" defaultValue={demo?.cep} />
                <Campo
                  id="endereco"
                  label="Endereço"
                  className="sm:col-span-2"
                  defaultValue={demo?.endereco}
                />
                <Campo id="cidade" label="Cidade" defaultValue={demo?.cidade} />
                <Campo id="uf" label="Estado" defaultValue={demo?.uf} />
              </div>
            </fieldset>

            <fieldset className="rounded-3xl border border-border bg-card p-6">
              <legend className="px-2 font-display text-lg font-bold">Pagamento (fictício)</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo
                  id="cartao"
                  label="Número do cartão"
                  className="sm:col-span-2"
                  placeholder="4242 4242 4242 4242"
                  defaultValue={demo?.cartao}
                />
                <Campo
                  id="validade"
                  label="Validade"
                  placeholder="12/30"
                  defaultValue={demo?.validade}
                />
                <Campo id="cvv" label="CVV" placeholder="123" defaultValue={demo?.cvv} />
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-brick"
            >
              Pagar {formatarPreco(total + frete)}
            </button>
          </form>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6">
            <h2 className="mb-5 font-display text-xl font-bold">Seu pedido</h2>
            <ul className="space-y-3 text-sm">
              {itens.map((i) => (
                <li key={i.id} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    {i.quantidade}× {i.name}
                  </span>
                  <span className="font-semibold">{formatarPreco(i.price * i.quantidade)}</span>
                </li>
              ))}
            </ul>
            {desconto > 0 && (
              <div className="mt-5 flex justify-between border-t border-border pt-5 text-sm">
                <span className="text-muted-foreground">Leve 3, pague 2</span>
                <span className="font-semibold text-brick">−{formatarPreco(desconto)}</span>
              </div>
            )}
            <div className="mt-5 flex justify-between border-t border-border pt-5 text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className="font-semibold">{frete === 0 ? "grátis" : formatarPreco(frete)}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-lg font-bold">Total</span>
              <span className="font-display text-2xl font-extrabold">
                {formatarPreco(total + frete)}
              </span>
            </div>
            <Link
              to="/carrinho"
              className="mt-5 block text-center text-sm text-muted-foreground underline hover:text-foreground"
            >
              Voltar ao carrinho
            </Link>
          </aside>
        </div>
      </section>
    </Page>
  );
}

export function Campo({
  id,
  label,
  type = "text",
  className = "",
  placeholder,
  defaultValue,
}: {
  id: string;
  label: string;
  type?: string;
  className?: string;
  placeholder?: string | undefined;
  defaultValue?: string | undefined;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-mustard"
      />
    </div>
  );
}
