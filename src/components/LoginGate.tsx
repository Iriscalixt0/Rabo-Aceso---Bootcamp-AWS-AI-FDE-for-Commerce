import { Link } from "@tanstack/react-router";

import { Page } from "@/components/StoreChrome";
import { DEMO_EMAIL, DEMO_SENHA, useAuth } from "@/lib/auth";

export function LoginGate({ acao }: { acao: string }) {
  const { entrarComoDemo } = useAuth();

  return (
    <Page>
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-mustard text-3xl">
          🔒
        </span>
        <h1 className="mb-4 font-display text-3xl font-extrabold lg:text-4xl">Entre para {acao}</h1>
        <p className="mb-8 text-muted-foreground">
          Este é um projeto de bootcamp: o cadastro real está desativado. Use o perfil demo para ter
          a experiência completa — pedidos, assinatura e histórico já ficam salvos nele.
        </p>
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={entrarComoDemo}
            className="w-full rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-colors hover:bg-brick sm:w-auto"
          >
            Entrar com o perfil demo
          </button>
          <p className="text-xs text-muted-foreground">
            {DEMO_EMAIL} · senha {DEMO_SENHA}
          </p>
          <Link
            to="/entrar"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ver a página de login
          </Link>
        </div>
      </section>
    </Page>
  );
}
