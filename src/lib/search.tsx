import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type SearchContextValue = {
  query: string;
  setQuery: (q: string) => void;
  categoria: string;
  setCategoria: (c: string) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("todos");
  const value = useMemo(() => ({ query, setQuery, categoria, setCategoria }), [query, categoria]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch precisa estar dentro de <SearchProvider>");
  return ctx;
}
