export type Produto = {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  image?: string;
  badge: string | null;
  description: string;
};

export const CATEGORY_LABELS: Record<string, string> = {
  todos: "Todos",
  ofertas: "Promoções do dia",
  racao: "Ração",
  petiscos: "Petiscos",
  brinquedos: "Brinquedos",
  higiene: "Higiene",
  acessorios: "Acessórios",
  camas: "Camas & conforto",
  saude: "Saúde",
};

export async function fetchCatalogo(): Promise<Produto[]> {
  const base = typeof window === "undefined" ? "http://localhost:8080" : window.location.origin;
  const res = await fetch(new URL("/products.json", base));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json: unknown = await res.json();
  const lista = Array.isArray(json)
    ? json
    : Array.isArray((json as { products?: unknown })?.products)
      ? (json as { products: unknown[] }).products
      : [];
  return lista as Produto[];
}

export const formatarPreco = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
