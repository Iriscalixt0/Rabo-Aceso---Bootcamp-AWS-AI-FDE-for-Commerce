import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Produto } from "./catalog";

export type ItemCarrinho = {
  id: string;
  name: string;
  price: number;
  icon: string;
  image?: string | undefined;
  quantidade: number;
  leve3?: boolean | undefined;
};

export function descontoItem(item: ItemCarrinho) {
  if (!item.leve3) return 0;
  return Math.floor(item.quantidade / 3) * item.price;
}

type CartContextValue = {
  itens: ItemCarrinho[];
  totalItens: number;
  total: number;
  desconto: number;
  adicionar: (produto: Produto, quantidade?: number) => void;
  definirQuantidade: (id: string, quantidade: number) => void;
  remover: (id: string) => void;
  limpar: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "rabo-aceso-carrinho";

export function CartProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(STORAGE_KEY);
      const salvo: unknown = bruto ? JSON.parse(bruto) : null;
      if (Array.isArray(salvo)) setItens(salvo as ItemCarrinho[]);
    } catch {
      void 0;
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    } catch {
      void 0;
    }
  }, [itens]);

  const value = useMemo<CartContextValue>(() => {
    const bruto = itens.reduce((soma, i) => soma + i.price * i.quantidade, 0);
    const desconto = itens.reduce((soma, i) => soma + descontoItem(i), 0);
    return {
      itens,
      desconto,
      total: bruto - desconto,
      totalItens: itens.reduce((soma, i) => soma + i.quantidade, 0),
      adicionar: (produto, quantidade = 1) =>
        setItens((atual) => {
          const qtd = Math.max(1, Math.floor(quantidade));
          const existente = atual.find((i) => i.id === produto.id);
          if (existente) {
            return atual.map((i) =>
              i.id === produto.id ? { ...i, quantidade: i.quantidade + qtd } : i,
            );
          }
          return [
            ...atual,
            {
              id: produto.id,
              name: produto.name,
              price: produto.price,
              icon: produto.icon,
              image: produto.image,
              leve3: produto.badge?.toLowerCase().includes("leve 3") ?? false,
              quantidade: qtd,
            },
          ];
        }),

      definirQuantidade: (id, quantidade) =>
        setItens((atual) =>
          quantidade <= 0
            ? atual.filter((i) => i.id !== id)
            : atual.map((i) => (i.id === id ? { ...i, quantidade } : i)),
        ),
      remover: (id) => setItens((atual) => atual.filter((i) => i.id !== id)),
      limpar: () => setItens([]),
    };
  }, [itens]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
