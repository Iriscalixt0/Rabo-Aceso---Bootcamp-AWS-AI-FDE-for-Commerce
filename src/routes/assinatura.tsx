import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { LoginGate } from "@/components/LoginGate";
import { Page } from "@/components/StoreChrome";
import { DADOS_DEMO, DEMO_EMAIL, useAuth } from "@/lib/auth";
import { Campo } from "@/routes/checkout";
import { formatarPreco } from "@/lib/catalog";

export const Route = createFileRoute("/assinatura")({
  head: () => ({
    meta: [
      { title: "Assinatura de ração — Rabo Aceso" },
      {
        name: "description",
        content:
          "Assine a ração do seu pet: 10% off em toda recompra, entrega programada e cancelamento quando quiser.",
      },
      { property: "og:title", content: "Assinatura de ração — Rabo Aceso" },
      {
        property: "og:description",
        content: "10% off em toda recompra, frete grátis e entrega no intervalo que você escolher.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssinaturaPage,
});

const RACOES = [
  {
    id: "frango",
    nome: "Focinho Feliz Frango 15kg",
    detalhe: "Cães adultos",
    preco: 189.9,
    image: "/products/p01.jpg",
  },
  {
    id: "salmao",
    nome: "Focinho Feliz Salmão 15kg",
    detalhe: "Cães com pele sensível",
    preco: 214.9,
    image: "/products/racao-salmao.jpg",
  },
  {
    id: "gato",
    nome: "Miado Feliz Gatos 7,5kg",
    detalhe: "Gatos adultos castrados",
    preco: 159.9,
    image: "/products/racao-gato.jpg",
  },
];

const BRINDES = [
  { id: "b1", nome: "Petisco Sardinha Crocante", image: "/products/p02.jpg" },
  { id: "b2", nome: "Ratinho de Feltro pra Gato", image: "/products/p04.jpg" },
  { id: "b3", nome: "Dental Stick Hálito Fresco", image: "/products/p14.jpg" },
];

const PLANOS = [
  { id: "mensal", nome: "Mensal", intervalo: "a cada 30 dias", entregas: 1, off: 0.1 },
  { id: "bimestral", nome: "Bimestral", intervalo: "a cada 60 dias", entregas: 2, off: 0.15 },
  { id: "trimestral", nome: "Trimestral", intervalo: "a cada 90 dias", entregas: 3, off: 0.2 },
];

function AssinaturaPage() {
  const [plano, setPlano] = useState("mensal");
  const [racaoId, setRacaoId] = useState(RACOES[0]!.id);
  const [brindeId, setBrindeId] = useState(BRINDES[0]!.id);
  const [etapa, setEtapa] = useState<"config" | "checkout" | "ok">("config");
  const [codigo, setCodigo] = useState("");
  const { registrarAssinatura, atualizarAssinatura, cancelarAssinatura, usuario } = useAuth();
  const atual = usuario?.assinaturas[0] ?? null;
  const demo = usuario?.email === DEMO_EMAIL ? DADOS_DEMO : null;
  const [modo, setModo] = useState<"gerenciar" | "novo">("gerenciar");
  const [aviso, setAviso] = useState("");
  const escolhido = PLANOS.find((p) => p.id === plano) ?? PLANOS[0]!;
  const racao = RACOES.find((r) => r.id === racaoId) ?? RACOES[0]!;
  const brinde = BRINDES.find((b) => b.id === brindeId) ?? BRINDES[0]!;
  const de = racao.preco * escolhido.entregas;
  const total = Math.round(de * (1 - escolhido.off) * 100) / 100;

  const resumo = (
    <>
      <h2 className="mb-5 font-display text-xl font-bold">Resumo da assinatura</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Ração</dt>
          <dd className="text-right font-semibold">{racao.nome}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Plano</dt>
          <dd className="font-semibold">{escolhido.nome}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Entrega</dt>
          <dd className="font-semibold">{escolhido.intervalo}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Brinde</dt>
          <dd className="text-right font-semibold">{brinde.nome}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Desconto</dt>
          <dd className="font-semibold text-brick">
            −{formatarPreco(Math.round((de - total) * 100) / 100)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Frete</dt>
          <dd className="font-semibold">grátis</dd>
        </div>
      </dl>
      <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
        <span className="font-display text-lg font-bold">Total por entrega</span>
        <span className="font-display text-2xl font-extrabold">{formatarPreco(total)}</span>
      </div>
    </>
  );

  if (!usuario && etapa !== "ok") return <LoginGate acao="assinar" />;

  return (
    <Page>
      <section className="relative overflow-hidden bg-brick px-6 py-16 text-brick-foreground">
        <img
          src="/promos/assinatura-racao.jpg"
          alt="Saco de ração premium com cachorro ao lado"
          width={1024}
          height={768}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brick via-brick/90 to-brick/30"
        />
        <div className="relative mx-auto max-w-7xl">
          <span className="inline-block rounded-full bg-brick-foreground/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            Economize sempre
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-tight lg:text-5xl">
            Assinatura de ração
          </h1>
          <p className="mt-4 max-w-xl opacity-90">
            Até 20% off em toda recompra, entrega programada e cancelamento quando quiser.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {atual && modo === "gerenciar" && etapa === "config" ? (
          (() => {
            const racaoAtual = RACOES.find((r) => r.nome === atual.racao) ?? RACOES[0]!;
            const indiceAtual = Math.max(
              0,
              PLANOS.findIndex((p) => p.nome === atual.plano),
            );
            return (
              <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                <div>
                  <h2 className="mb-2 font-display text-2xl font-bold">Sua assinatura atual</h2>
                  <p className="mb-6 text-muted-foreground">
                    Código <strong className="text-foreground">{atual.codigo}</strong> · ativa desde{" "}
                    {new Date(atual.data).toLocaleDateString("pt-BR")}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-border bg-card p-5">
                    <img
                      src={racaoAtual.image}
                      alt={atual.racao}
                      loading="lazy"
                      width={768}
                      height={768}
                      className="h-20 w-20 rounded-2xl bg-muted object-cover"
                    />
                    <div className="min-w-[12rem] flex-1">
                      <p className="font-display text-lg font-bold leading-tight">{atual.racao}</p>
                      <p className="text-sm text-muted-foreground">
                        Plano {atual.plano} · brinde: {atual.brinde}
                      </p>
                    </div>
                    <p className="font-display text-2xl font-extrabold">
                      {formatarPreco(atual.valor)}
                    </p>
                  </div>

                  <h2 className="mb-2 mt-12 font-display text-2xl font-bold">
                    Evoluir ou regressar de plano
                  </h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Planos mais longos economizam mais. A troca vale já na próxima entrega.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {PLANOS.map((p, i) => {
                      const ativo = i === indiceAtual;
                      const valor =
                        Math.round(racaoAtual.preco * p.entregas * (1 - p.off) * 100) / 100;
                      return (
                        <div
                          key={p.id}
                          className={`rounded-2xl border p-5 ${
                            ativo ? "border-primary bg-primary/5" : "border-border bg-card"
                          }`}
                        >
                          <span className="inline-block rounded-full bg-mustard px-2.5 py-0.5 text-[11px] font-bold uppercase text-mustard-foreground">
                            {Math.round(p.off * 100)}% off
                          </span>
                          <p className="mt-3 font-display text-lg font-bold">{p.nome}</p>
                          <p className="text-sm text-muted-foreground">{p.intervalo}</p>
                          <p className="mt-3 font-display text-xl font-extrabold">
                            {formatarPreco(valor)}
                          </p>
                          {ativo ? (
                            <p className="mt-4 text-center text-sm font-semibold text-primary">
                              Plano atual
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                atualizarAssinatura(atual.codigo, { plano: p.nome, valor });
                                setAviso(
                                  `${i > indiceAtual ? "Plano evoluído" : "Plano alterado"} para ${p.nome}.`,
                                );
                              }}
                              className="mt-4 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brick"
                            >
                              {i > indiceAtual ? "Evoluir" : "Regressar"} para {p.nome}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {aviso ? (
                    <p className="mt-6 rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                      {aviso}
                    </p>
                  ) : null}
                </div>

                <aside className="h-fit space-y-3 rounded-3xl border border-border bg-card p-6">
                  <h2 className="font-display text-xl font-bold">Gerenciar</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setRacaoId(racaoAtual.id);
                      setPlano(PLANOS[indiceAtual]!.id);
                      setBrindeId((BRINDES.find((b) => b.nome === atual.brinde) ?? BRINDES[0]!).id);
                      setModo("novo");
                    }}
                    className="w-full rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-brick"
                  >
                    Trocar ração ou brinde
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      cancelarAssinatura(atual.codigo);
                      setModo("novo");
                    }}
                    className="w-full rounded-full border border-border px-6 py-3.5 font-semibold transition-colors hover:border-brick hover:text-brick"
                  >
                    Cancelar assinatura
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    Assinatura fictícia, sem cobrança real.
                  </p>
                </aside>
              </div>
            );
          })()
        ) : etapa === "ok" ? (
          <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-border bg-card">
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
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                Assinatura ativada
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Código <strong className="font-semibold">{codigo}</strong>
              </p>
            </div>

            <dl className="divide-y divide-border px-6 sm:px-10">
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm text-muted-foreground">Produto</dt>
                <dd className="text-right text-sm font-semibold text-foreground">{racao.nome}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm text-muted-foreground">Plano</dt>
                <dd className="text-right text-sm font-semibold text-foreground">
                  {escolhido.nome}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm text-muted-foreground">Brinde incluso</dt>
                <dd className="text-right text-sm font-semibold text-foreground">{brinde.nome}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm font-semibold text-foreground">Valor por entrega</dt>
                <dd className="text-right">
                  <span className="block font-display text-xl font-extrabold text-foreground">
                    {formatarPreco(total)}
                  </span>
                  <span className="text-xs text-muted-foreground">{escolhido.intervalo}</span>
                </dd>
              </div>
            </dl>

            <div className="space-y-3 border-t border-border bg-muted px-6 py-6 sm:px-10">
              <Link
                to="/conta"
                className="block rounded-full bg-primary px-8 py-3.5 text-center font-semibold text-primary-foreground transition-colors hover:bg-brick"
              >
                Ver minha assinatura
              </Link>
              <Link
                to="/"
                className="block rounded-full border border-border bg-card px-8 py-3.5 text-center font-semibold text-foreground transition-colors hover:border-brick hover:text-brick"
              >
                Voltar para a loja
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                Assinatura fictícia: nada foi cobrado.
              </p>
            </div>
          </div>
        ) : etapa === "checkout" ? (
          <div>
            <h2 className="mb-2 font-display text-3xl font-extrabold">Checkout da assinatura</h2>
            <p className="mb-10 text-muted-foreground">
              Fluxo de demonstração — os dados não saem do seu navegador.
            </p>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <form
                key={demo ? "demo" : "vazio"}
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  const novo = `AS-${Math.floor(100000 + Math.random() * 900000)}`;
                  setCodigo(novo);
                  registrarAssinatura({
                    codigo: novo,
                    data: new Date().toISOString().slice(0, 10),
                    racao: racao.nome,
                    plano: escolhido.nome,
                    brinde: brinde.nome,
                    valor: total,
                  });
                  setModo("gerenciar");
                  setEtapa("ok");
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
                  <legend className="px-2 font-display text-lg font-bold">
                    Pagamento recorrente (fictício)
                  </legend>
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
                  <p className="mt-4 text-xs text-muted-foreground">
                    Cobrança {escolhido.intervalo}. Cancele quando quiser.
                  </p>
                </fieldset>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-brick"
                  >
                    Confirmar assinatura {formatarPreco(total)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEtapa("config")}
                    className="text-sm text-muted-foreground underline hover:text-foreground"
                  >
                    Voltar e editar
                  </button>
                </div>
              </form>

              <aside className="h-fit rounded-3xl border border-border bg-card p-6">
                {resumo}
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-muted p-3">
                  <img
                    src={brinde.image}
                    alt={brinde.nome}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <span className="text-sm">
                    <span className="block font-semibold leading-tight">{brinde.nome}</span>
                    <span className="text-xs font-bold uppercase text-brick">brinde grátis</span>
                  </span>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="mb-6 font-display text-2xl font-bold">1. Escolha a ração</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {RACOES.map((r) => {
                  const ativo = r.id === racaoId;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRacaoId(r.id)}
                      aria-pressed={ativo}
                      className={`overflow-hidden rounded-2xl border text-left transition-colors ${
                        ativo
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={r.image}
                        alt={r.nome}
                        loading="lazy"
                        width={768}
                        height={768}
                        className="h-36 w-full bg-muted object-cover"
                      />
                      <span className="block p-4">
                        <span className="block font-display text-base font-bold leading-tight">
                          {r.nome}
                        </span>
                        <span className="block text-sm text-muted-foreground">{r.detalhe}</span>
                        <span className="mt-2 block font-display text-lg font-extrabold">
                          {formatarPreco(r.preco)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <h2 className="mb-6 mt-12 font-display text-2xl font-bold">
                2. Escolha a frequência
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {PLANOS.map((p) => {
                  const ativo = p.id === plano;
                  const bruto = racao.preco * p.entregas;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlano(p.id)}
                      aria-pressed={ativo}
                      className={`rounded-2xl border p-5 text-left transition-colors ${
                        ativo
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span className="inline-block rounded-full bg-mustard px-2.5 py-0.5 text-[11px] font-bold uppercase text-mustard-foreground">
                        {Math.round(p.off * 100)}% off
                      </span>
                      <p className="mt-3 font-display text-lg font-bold">{p.nome}</p>
                      <p className="text-sm text-muted-foreground">{p.intervalo}</p>
                      <p className="mt-3 text-sm text-muted-foreground line-through">
                        {formatarPreco(bruto)}
                      </p>
                      <p className="font-display text-xl font-extrabold">
                        {formatarPreco(Math.round(bruto * (1 - p.off) * 100) / 100)}
                      </p>
                    </button>
                  );
                })}
              </div>

              <h2 className="mb-2 mt-12 font-display text-2xl font-bold">3. Escolha seu brinde</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Um mimo grátis em toda entrega da assinatura.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {BRINDES.map((b) => {
                  const ativo = b.id === brindeId;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBrindeId(b.id)}
                      aria-pressed={ativo}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                        ativo
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={b.image}
                        alt={b.nome}
                        loading="lazy"
                        width={768}
                        height={768}
                        className="h-14 w-14 shrink-0 rounded-xl bg-muted object-cover"
                      />
                      <span>
                        <span className="block text-sm font-semibold leading-tight">{b.nome}</span>
                        <span className="text-xs font-bold uppercase text-brick">grátis</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <h2 className="mb-4 mt-12 font-display text-2xl font-bold">Como funciona</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>1. Você escolhe a ração e o intervalo de entrega.</li>
                <li>2. A gente envia automaticamente, sempre com desconto.</li>
                <li>3. Pode pausar, trocar o produto ou cancelar a qualquer momento.</li>
              </ul>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6">
              {resumo}
              <button
                type="button"
                onClick={() => setEtapa("checkout")}
                className="mt-6 w-full rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-brick"
              >
                Ir para o checkout
              </button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Assinatura fictícia, sem cobrança real.
              </p>
            </aside>
          </div>
        )}
      </section>
    </Page>
  );
}
