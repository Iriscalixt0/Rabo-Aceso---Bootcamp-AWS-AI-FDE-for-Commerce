import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Page } from "@/components/StoreChrome";
import { EtiquetaStatus, TrilhaStatus } from "@/components/StatusPedido";
import { STATUS_PEDIDO, statusAtual, useAuth, type StatusPedido } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { formatarPreco } from "@/lib/catalog";

const ABAS = ["Todos", ...STATUS_PEDIDO] as const;

type Aba = (typeof ABAS)[number];

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Rabo Aceso" },
      {
        name: "description",
        content:
          "Histórico de pedidos, carrinho atual, promoções vistas e assinatura ativa da sua conta Rabo Aceso.",
      },
      { property: "og:title", content: "Minha conta — Rabo Aceso" },
      {
        property: "og:description",
        content: "Painel do cliente da loja de estudo Rabo Aceso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContaPage,
});

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="mb-4 font-display text-xl font-extrabold">{titulo}</h2>
      {children}
    </section>
  );
}

function ContaPage() {
  const { usuario, sair } = useAuth();
  const [aba, setAba] = useState<Aba>("Todos");
  const { itens, total, totalItens } = useCart();

  if (!usuario) {
    return (
      <Page>
        <section className="mx-auto max-w-lg px-6 py-24 text-center">
          <h1 className="mb-4 font-display text-3xl font-extrabold">Entre na sua conta</h1>
          <p className="mb-8 text-muted-foreground">
            Faça login para ver pedidos, promoções vistas e sua assinatura.
          </p>
          <Link
            to="/entrar"
            className="inline-block rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-colors hover:bg-brick"
          >
            Entrar ou criar conta
          </Link>
        </section>
      </Page>
    );
  }

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Minha conta</p>
            <h1 className="font-display text-4xl font-extrabold">Olá, {usuario.nome}</h1>
            <p className="text-sm text-muted-foreground">{usuario.email}</p>
          </div>
          <button
            type="button"
            onClick={sair}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-brick hover:text-brick"
          >
            Sair
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Bloco titulo="Histórico de pedidos">
            {usuario.pedidos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
            ) : (
              (() => {
                const contar = (a: Aba) =>
                  a === "Todos"
                    ? usuario.pedidos.length
                    : usuario.pedidos.filter((p) => statusAtual(p) === (a as StatusPedido)).length;
                const visiveis =
                  aba === "Todos"
                    ? usuario.pedidos
                    : usuario.pedidos.filter((p) => statusAtual(p) === (aba as StatusPedido));
                return (
                  <>
                    <div className="mb-5 flex flex-wrap gap-2 border-b border-border pb-3">
                      {ABAS.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setAba(a)}
                          className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                            aba === a
                              ? "bg-primary text-primary-foreground"
                              : "border border-border text-muted-foreground hover:border-brick hover:text-brick"
                          }`}
                        >
                          {a} ({contar(a)})
                        </button>
                      ))}
                    </div>
                    {visiveis.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhum pedido nesta etapa por enquanto.
                      </p>
                    ) : (
                      <ul className="space-y-4">
                        {visiveis.map((p) => (
                          <li key={p.codigo} className="rounded-2xl border border-border p-4">
                            <div className="flex justify-between text-sm font-semibold">
                              <span>{p.codigo}</span>
                              <span>{formatarPreco(p.valor)}</span>
                            </div>
                            <div className="mb-2 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{p.data}</span>
                              <EtiquetaStatus status={statusAtual(p)} />
                            </div>
                            <ul className="space-y-0.5 text-sm text-muted-foreground">
                              {p.itens.map((i) => (
                                <li key={i.name}>
                                  {i.quantidade}× {i.name}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 border-t border-border pt-4">
                              <TrilhaStatus status={statusAtual(p)} compacto />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                );
              })()
            )}
          </Bloco>


          <Bloco titulo="Carrinho atual">
            {itens.length === 0 ? (
              <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
            ) : (
              <>
                <ul className="mb-4 space-y-2 text-sm">
                  {itens.map((i) => (
                    <li key={i.id} className="flex justify-between">
                      <span>
                        {i.quantidade}× {i.name}
                      </span>
                      <span className="font-semibold">{formatarPreco(i.price * i.quantidade)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mb-4 flex justify-between border-t border-border pt-3 font-semibold">
                  <span>{totalItens} item(ns)</span>
                  <span>{formatarPreco(total)}</span>
                </div>
                <Link
                  to="/carrinho"
                  className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brick"
                >
                  Ir para o carrinho
                </Link>
              </>
            )}
          </Bloco>

          <Bloco titulo="Promoções que você viu">
            {usuario.promocoesVistas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Navegue pelas ofertas da home para elas aparecerem aqui.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {usuario.promocoesVistas.map((p) => (
                  <li key={p.nome} className="flex justify-between rounded-xl bg-muted px-4 py-3">
                    <span className="font-medium">{p.nome}</span>
                    <span className="text-muted-foreground">{p.data}</span>
                  </li>
                ))}
              </ul>
            )}
          </Bloco>

          <Bloco titulo="Minha assinatura">
            {usuario.assinaturas.length === 0 ? (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  Você ainda não tem assinatura ativa.
                </p>
                <Link
                  to="/assinatura"
                  className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brick"
                >
                  Assinar ração
                </Link>
              </>
            ) : (
              <ul className="space-y-4">
                {usuario.assinaturas.map((a) => (
                  <li key={a.codigo} className="rounded-2xl border-2 border-mustard p-4">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{a.codigo}</span>
                      <span>{formatarPreco(a.valor)}/entrega</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.racao} — plano {a.plano}
                    </p>
                    <p className="text-sm text-muted-foreground">Brinde: {a.brinde}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Ativa desde {a.data}</p>
                  </li>
                ))}
              </ul>
            )}
          </Bloco>
        </div>
      </section>
    </Page>
  );
}
