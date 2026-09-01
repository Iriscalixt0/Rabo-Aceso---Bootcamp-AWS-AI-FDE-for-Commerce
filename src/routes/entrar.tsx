import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Page } from "@/components/StoreChrome";
import { DEMO_EMAIL, DEMO_SENHA, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — Rabo Aceso" },
      {
        name: "description",
        content:
          "Acesse sua conta Rabo Aceso para ver histórico de pedidos, carrinho, promoções vistas e assinatura.",
      },
      { property: "og:title", content: "Entrar ou criar conta — Rabo Aceso" },
      {
        property: "og:description",
        content: "Login fictício da loja de estudo Rabo Aceso, com perfil demo pronto para teste.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EntrarPage,
});

function Campo({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-mustard"
      />
    </label>
  );
}

function EntrarPage() {
  const { entrar, cadastrar, entrarComoDemo } = useAuth();
  const navigate = useNavigate();
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function irParaConta() {
    void navigate({ to: "/conta" });
  }

  return (
    <Page>
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-[1fr_360px]">
        <div className="order-2 rounded-3xl border border-border bg-card p-8 lg:order-1">
          <div className="mb-6 flex gap-2 rounded-full bg-muted p-1">
            {(["login", "cadastro"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setModo(m);
                  setErro("");
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  modo === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <h1 className="mb-2 font-display text-3xl font-extrabold">
            {modo === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Login fictício deste projeto de bootcamp — nenhum dado real é enviado.
          </p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const r = modo === "login" ? entrar(email, senha) : cadastrar(nome, email, senha);
              if (!r.ok) {
                setErro(r.erro ?? "Não foi possível continuar.");
                return;
              }
              setErro("");
              irParaConta();
            }}
          >
            {modo === "cadastro" && (
              <Campo
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
              />
            )}
            <Campo
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
            <Campo
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
            />
            {erro && <p className="text-sm font-medium text-brick">{erro}</p>}
            <button
              type="submit"
              disabled
              aria-disabled="true"
              className="w-full rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              {modo === "login" ? "Entrar" : "Criar conta e entrar"}
            </button>
          </form>
        </div>

        <aside className="order-1 h-fit rounded-3xl border-2 border-mustard bg-mustard/10 p-6 lg:order-2">
          <span className="mb-3 inline-block rounded-full bg-mustard px-3 py-1 text-xs font-bold uppercase tracking-wide text-mustard-foreground">
            Perfil demo
          </span>
          <h2 className="mb-2 font-display text-xl font-extrabold">
            Experiência completa em 1 clique
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Conta pronta com histórico de pedidos, promoções vistas e assinatura ativa — feita para
            o avaliador e colegas testarem.
          </p>
          <div className="mb-4 rounded-xl bg-card p-4 text-sm">
            <p>
              <strong>E-mail:</strong> {DEMO_EMAIL}
            </p>
            <p>
              <strong>Senha:</strong> {DEMO_SENHA}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              entrarComoDemo();
              irParaConta();
            }}
            className="w-full rounded-full bg-brick px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Entrar com o perfil demo
          </button>
        </aside>
      </section>
    </Page>
  );
}
