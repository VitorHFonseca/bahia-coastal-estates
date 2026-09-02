import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Reveal } from "@/components/site/Reveal";
import { CIDADES } from "@/lib/regioes";
import { TIPOS, formatBRL } from "@/lib/format";
import { catalogoQuery } from "@/lib/properties";

type Search = {
  cidade?: string;
  tipo?: string;
  q?: string;
  max?: number;
  ordem?: string;
};

const TODOS = "todos";

export const Route = createFileRoute("/imoveis")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    cidade: typeof search.cidade === "string" ? search.cidade : undefined,
    tipo: typeof search.tipo === "string" ? search.tipo : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    max: search.max ? Number(search.max) || undefined : undefined,
    ordem: typeof search.ordem === "string" ? search.ordem : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Imóveis no litoral da Bahia — Costa da Bahia" },
      {
        name: "description",
        content:
          "Catálogo de casas, apartamentos, terrenos, pousadas e fazendas à venda no litoral baiano, com filtros por cidade, tipo e preço.",
      },
      { property: "og:title", content: "Imóveis no litoral da Bahia" },
      {
        property: "og:description",
        content: "Busque casas frente-mar, terrenos e pousadas entre Praia do Forte e Trancoso.",
      },
    ],
  }),
  component: Catalogo,
});

const FAIXAS = [
  { value: TODOS, label: "Qualquer preço" },
  { value: "1500000", label: "Até R$ 1,5 mi" },
  { value: "3000000", label: "Até R$ 3 mi" },
  { value: "5000000", label: "Até R$ 5 mi" },
  { value: "10000000", label: "Até R$ 10 mi" },
];

const ORDENS = [
  { value: "recentes", label: "Mais recentes" },
  { value: "menor", label: "Menor preço" },
  { value: "maior", label: "Maior preço" },
  { value: "area", label: "Maior área" },
];

function Catalogo() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: imoveis = [], isLoading } = useQuery(catalogoQuery);
  const [busca, setBusca] = useState(search.q ?? "");

  function setFiltro(patch: Partial<Search>) {
    navigate({ search: (prev) => ({ ...prev, ...patch }) });
  }

  const filtrados = useMemo(() => {
    const termo = (search.q ?? "").trim().toLowerCase();
    let lista = imoveis.filter((imovel) => {
      if (search.cidade && imovel.cidade !== search.cidade) return false;
      if (search.tipo && imovel.tipo !== search.tipo) return false;
      if (search.max && Number(imovel.preco) > search.max) return false;
      if (termo) {
        const alvo = `${imovel.titulo} ${imovel.cidade} ${imovel.bairro ?? ""} ${imovel.descricao}`;
        if (!alvo.toLowerCase().includes(termo)) return false;
      }
      return true;
    });
    const ordem = search.ordem ?? "recentes";
    lista = [...lista].sort((a, b) => {
      if (ordem === "menor") return Number(a.preco) - Number(b.preco);
      if (ordem === "maior") return Number(b.preco) - Number(a.preco);
      if (ordem === "area") return Number(b.area) - Number(a.area);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return lista;
  }, [imoveis, search]);

  const temFiltro = Boolean(search.cidade || search.tipo || search.max || search.q);

  return (
    <>
      <section className="border-b border-border bg-secondary/60">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <p className="eyebrow text-primary">Catálogo</p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-tight">
            Imóveis no litoral da Bahia
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {filtrados.length} imóveis disponíveis entre vilas, praias e ilhas — todos visitados
            pela nossa equipe.
          </p>
        </div>
      </section>

      <section className="sticky top-[4.5rem] z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFiltro({ q: busca.trim() || undefined });
              }}
              className="relative min-w-0"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busca}
                maxLength={80}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, bairro ou cidade"
                className="pl-9"
                aria-label="Buscar imóveis"
              />
            </form>

            <Select
              value={search.cidade ?? TODOS}
              onValueChange={(v) => setFiltro({ cidade: v === TODOS ? undefined : v })}
            >
              <SelectTrigger aria-label="Cidade">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todas as cidades</SelectItem>
                {CIDADES.map((cidade) => (
                  <SelectItem key={cidade} value={cidade}>
                    {cidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={search.tipo ?? TODOS}
              onValueChange={(v) => setFiltro({ tipo: v === TODOS ? undefined : v })}
            >
              <SelectTrigger aria-label="Tipo de imóvel">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos os tipos</SelectItem>
                {TIPOS.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={search.max ? String(search.max) : TODOS}
              onValueChange={(v) => setFiltro({ max: v === TODOS ? undefined : Number(v) })}
            >
              <SelectTrigger aria-label="Faixa de preço">
                <SelectValue placeholder="Preço" />
              </SelectTrigger>
              <SelectContent>
                {FAIXAS.map((faixa) => (
                  <SelectItem key={faixa.value} value={faixa.value}>
                    {faixa.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={search.ordem ?? "recentes"}
              onValueChange={(v) => setFiltro({ ordem: v === "recentes" ? undefined : v })}
            >
              <SelectTrigger aria-label="Ordenar">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                {ORDENS.map((ordem) => (
                  <SelectItem key={ordem.value} value={ordem.value}>
                    {ordem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {temFiltro && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {search.cidade && <Chip label={search.cidade} onClear={() => setFiltro({ cidade: undefined })} />}
              {search.tipo && (
                <Chip
                  label={TIPOS.find((t) => t.value === search.tipo)?.label ?? search.tipo}
                  onClear={() => setFiltro({ tipo: undefined })}
                />
              )}
              {search.max && (
                <Chip
                  label={`até ${formatBRL(search.max)}`}
                  onClear={() => setFiltro({ max: undefined })}
                />
              )}
              {search.q && (
                <Chip
                  label={`"${search.q}"`}
                  onClear={() => {
                    setBusca("");
                    setFiltro({ q: undefined });
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setBusca("");
                  navigate({ search: {} });
                }}
                className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-secondary" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-24 text-center">
            <h2 className="font-display text-2xl">Nenhum imóvel com esses filtros</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Temos imóveis fora do site. Ajuste a busca ou fale com um consultor para receber
              opções reservadas.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setBusca("");
                navigate({ search: {} });
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((imovel, i) => (
              <Reveal key={imovel.id} delay={Math.min(i, 5) * 70} className="h-full">
                <PropertyCard imovel={imovel} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
      {label}
      <button type="button" onClick={onClear} aria-label={`Remover filtro ${label}`}>
        <X className="size-3.5" />
      </button>
    </span>
  );
}
