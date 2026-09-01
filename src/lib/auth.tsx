import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const STATUS_PEDIDO = ["Em preparação", "Em andamento", "Entregue"] as const;

export type StatusPedido = (typeof STATUS_PEDIDO)[number];

export const ETAPAS_PEDIDO: { status: StatusPedido; descricao: string; minutos: number }[] = [
  {
    status: "Em preparação",
    descricao: "Separando os itens no centro de distribuição",
    minutos: 0,
  },
  { status: "Em andamento", descricao: "Pedido despachado e a caminho do endereço", minutos: 2 },
  { status: "Entregue", descricao: "Entrega concluída", minutos: 5 },
];

export function statusAtual(pedido: Pedido): StatusPedido {
  if (!pedido.criadoEm) return pedido.status ?? "Em preparação";
  const minutos = (Date.now() - new Date(pedido.criadoEm).getTime()) / 60000;
  const etapa = [...ETAPAS_PEDIDO].reverse().find((e) => minutos >= e.minutos);
  return etapa?.status ?? "Em preparação";
}

export type Pedido = {
  codigo: string;
  data: string;
  status?: StatusPedido;
  criadoEm?: string;
  valor: number;
  itens: { name: string; quantidade: number; price: number }[];
};

export type Assinatura = {
  codigo: string;
  data: string;
  racao: string;
  plano: string;
  brinde: string;
  valor: number;
};

export type Conta = {
  email: string;
  nome: string;
  senha: string;
  pedidos: Pedido[];
  promocoesVistas: { nome: string; data: string }[];
  assinaturas: Assinatura[];
};

type AuthContextValue = {
  usuario: Conta | null;
  contas: Conta[];
  entrar: (email: string, senha: string) => { ok: boolean; erro?: string };
  cadastrar: (nome: string, email: string, senha: string) => { ok: boolean; erro?: string };
  entrarComoDemo: () => void;
  sair: () => void;
  registrarPedido: (pedido: Pedido) => void;
  registrarAssinatura: (assinatura: Assinatura) => void;
  atualizarAssinatura: (codigo: string, mudancas: Partial<Assinatura>) => void;
  cancelarAssinatura: (codigo: string) => void;
  verPromocao: (nome: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const CONTAS_KEY = "rabo-aceso-contas";
const SESSAO_KEY = "rabo-aceso-sessao";

export const DEMO_EMAIL = "avaliador@raboaceso.com";
export const DEMO_SENHA = "bootcamp";

export const DADOS_DEMO = {
  nome: "Avaliador Bootcamp",
  email: DEMO_EMAIL,
  cep: "01310-100",
  endereco: "Av. Paulista, 1000 — apto 72",
  cidade: "São Paulo",
  uf: "SP",
  cartao: "4242 4242 4242 4242",
  validade: "12/30",
  cvv: "123",
};

function contaDemo(): Conta {
  return {
    email: DEMO_EMAIL,
    nome: "Avaliador",
    senha: DEMO_SENHA,
    pedidos: [
      {
        codigo: "RA-482915",
        data: "2026-08-12",
        status: "Em andamento",
        valor: 268.6,
        itens: [
          { name: "Ração Premium Frango 10kg", quantidade: 1, price: 189.9 },
          { name: "Coleira ajustável", quantidade: 2, price: 39.35 },
        ],
      },
      {
        codigo: "RA-197340",
        data: "2026-07-03",
        status: "Entregue",
        valor: 96.7,
        itens: [
          { name: "Petisco natural de frango", quantidade: 3, price: 24.9 },
          { name: "Brinquedo mordedor", quantidade: 1, price: 22.0 },
        ],
      },
    ],
    promocoesVistas: [
      { nome: "Leve 3, pague 2 — Petiscos", data: "2026-08-12" },
      { nome: "Promoções do dia", data: "2026-08-20" },
      { nome: "Assinatura de ração — 10% off", data: "2026-08-25" },
    ],
    assinaturas: [
      {
        codigo: "AS-771204",
        data: "2026-08-01",
        racao: "Ração Premium Frango 10kg",
        plano: "Mensal",
        brinde: "Sardinha desidratada",
        valor: 170.91,
      },
    ],
  };
}

function carregarContas(): Conta[] {
  try {
    const bruto = localStorage.getItem(CONTAS_KEY);
    const salvo: unknown = bruto ? JSON.parse(bruto) : null;
    if (Array.isArray(salvo) && salvo.length > 0) return salvo as Conta[];
  } catch {
    void 0;
  }
  return [contaDemo()];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [contas, setContas] = useState<Conta[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const iniciais = carregarContas();
    setContas(iniciais);
    try {
      const sessao = localStorage.getItem(SESSAO_KEY);
      if (sessao && iniciais.some((c) => c.email === sessao)) setEmail(sessao);
    } catch {
      void 0;
    }
  }, []);

  useEffect(() => {
    if (contas.length === 0) return;
    try {
      localStorage.setItem(CONTAS_KEY, JSON.stringify(contas));
    } catch {
      void 0;
    }
  }, [contas]);

  useEffect(() => {
    try {
      if (email) localStorage.setItem(SESSAO_KEY, email);
      else localStorage.removeItem(SESSAO_KEY);
    } catch {
      void 0;
    }
  }, [email]);

  const value = useMemo<AuthContextValue>(() => {
    const usuario = contas.find((c) => c.email === email) ?? null;

    const atualizar = (fn: (c: Conta) => Conta) =>
      setContas((atual) => atual.map((c) => (c.email === email ? fn(c) : c)));

    return {
      usuario,
      contas,
      entrar: (e, s) => {
        const alvo = contas.find((c) => c.email === e.trim().toLowerCase());
        if (!alvo) return { ok: false, erro: "E-mail não cadastrado." };
        if (alvo.senha !== s) return { ok: false, erro: "Senha incorreta." };
        setEmail(alvo.email);
        return { ok: true };
      },
      cadastrar: (nome, e, s) => {
        const limpo = e.trim().toLowerCase();
        if (!nome.trim()) return { ok: false, erro: "Informe seu nome." };
        if (!limpo.includes("@")) return { ok: false, erro: "E-mail inválido." };
        if (s.length < 4) return { ok: false, erro: "Senha com pelo menos 4 caracteres." };
        if (contas.some((c) => c.email === limpo))
          return { ok: false, erro: "Esse e-mail já tem conta." };
        setContas((atual) => [
          ...atual,
          {
            email: limpo,
            nome: nome.trim(),
            senha: s,
            pedidos: [],
            promocoesVistas: [],
            assinaturas: [],
          },
        ]);
        setEmail(limpo);
        return { ok: true };
      },
      entrarComoDemo: () => {
        setContas((atual) =>
          atual.some((c) => c.email === DEMO_EMAIL) ? atual : [...atual, contaDemo()],
        );
        setEmail(DEMO_EMAIL);
      },
      sair: () => setEmail(null),
      registrarPedido: (pedido) =>
        atualizar((c) => ({
          ...c,
          pedidos: [
            {
              status: "Em preparação" as StatusPedido,
              criadoEm: new Date().toISOString(),
              ...pedido,
            },
            ...c.pedidos,
          ],
        })),
      registrarAssinatura: (assinatura) =>
        atualizar((c) => ({ ...c, assinaturas: [assinatura, ...c.assinaturas] })),
      atualizarAssinatura: (codigo, mudancas) =>
        atualizar((c) => ({
          ...c,
          assinaturas: c.assinaturas.map((a) => (a.codigo === codigo ? { ...a, ...mudancas } : a)),
        })),
      cancelarAssinatura: (codigo) =>
        atualizar((c) => ({
          ...c,
          assinaturas: c.assinaturas.filter((a) => a.codigo !== codigo),
        })),
      verPromocao: (nome) =>
        atualizar((c) =>
          c.promocoesVistas.some((p) => p.nome === nome)
            ? c
            : {
                ...c,
                promocoesVistas: [
                  { nome, data: new Date().toISOString().slice(0, 10) },
                  ...c.promocoesVistas,
                ].slice(0, 12),
              },
        ),
    };
  }, [contas, email]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
