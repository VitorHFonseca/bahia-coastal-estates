import { Link } from "@tanstack/react-router";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { formatArea, formatBRL, tipoLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export type PropertyCardData = {
  id: string;
  titulo: string;
  preco: number;
  cidade: string;
  bairro: string | null;
  tipo: string;
  quartos: number;
  banheiros: number;
  area: number;
  imagens: string[];
  caracteristicas: string[];
  destaque: boolean;
  created_at: string;
};

const FALLBACK = "/images/imovel-1.jpg";

function badges(p: PropertyCardData): string[] {
  const list: string[] = [];
  if (p.caracteristicas.includes("Frente-mar")) list.push("Frente-mar");
  if (p.destaque) list.push("Exclusivo");
  const dias = (Date.now() - new Date(p.created_at).getTime()) / 86400000;
  if (dias < 30) list.push("Novo");
  return list.slice(0, 3);
}

export function PropertyCard({
  imovel,
  className,
}: {
  imovel: PropertyCardData;
  className?: string;
}) {
  const capa = imovel.imagens?.[0] || FALLBACK;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift",
        className,
      )}
    >
      <Link
        to="/imoveis/$id"
        params={{ id: imovel.id }}
        className="hover-zoom relative block aspect-[4/3] bg-muted"
      >
        <img
          src={capa}
          alt={imovel.titulo}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {badges(imovel).map((b) => (
            <span
              key={b}
              className="rounded-full bg-background/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-ocean-deep backdrop-blur"
            >
              {b}
            </span>
          ))}
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-ocean-deep/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-primary-foreground backdrop-blur">
          {tipoLabel(imovel.tipo)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">
            {imovel.bairro ? `${imovel.bairro}, ` : ""}
            {imovel.cidade}
          </span>
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug">
          <Link to="/imoveis/$id" params={{ id: imovel.id }} className="hover:text-primary">
            {imovel.titulo}
          </Link>
        </h3>
        <p className="mt-3 font-display text-2xl text-primary">{formatBRL(imovel.preco)}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
          {imovel.quartos > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-4 text-madeira" /> {imovel.quartos} quartos
            </span>
          )}
          {imovel.banheiros > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="size-4 text-madeira" /> {imovel.banheiros} banheiros
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Ruler className="size-4 text-madeira" /> {formatArea(imovel.area)}
          </span>
        </div>
      </div>
    </article>
  );
}
