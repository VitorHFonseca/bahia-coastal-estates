import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  MapPin,
  MessageCircle,
  Ruler,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { LeadForm } from "@/components/site/LeadForm";
import { useImagens } from "@/lib/storage";
import { consultorQuery, imovelQuery } from "@/lib/properties";
import { STATUS_LABEL, formatArea, formatBRL, tipoLabel, whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/imoveis/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do imóvel — Costa da Bahia" },
      {
        name: "description",
        content:
          "Fotos, características, localização e contato direto com o consultor responsável pelo imóvel.",
      },
      { property: "og:title", content: "Detalhes do imóvel — Costa da Bahia" },
      {
        property: "og:description",
        content: "Veja fotos, características e fale com o consultor responsável.",
      },
    ],
  }),
  component: Detalhe,
});

function Detalhe() {
  const { id } = Route.useParams();
  const { data: imovel, isLoading } = useQuery(imovelQuery(id));
  const { data: consultor } = useQuery({
    ...consultorQuery(imovel?.consultor_id ?? null),
    enabled: Boolean(imovel?.consultor_id),
  });
  const imagens = useImagens(imovel?.imagens);
  const [ativa, setAtiva] = useState(0);

  useEffect(() => {
    if (!imovel?.id) return;
    void supabase.rpc("increment_property_views", { _id: imovel.id });
  }, [imovel?.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="h-[60vh] animate-pulse rounded-lg bg-secondary" />
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center md:px-8">
        <h1 className="font-display text-3xl">Imóvel não encontrado</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Este imóvel pode ter sido vendido ou retirado do site.
        </p>
        <Button asChild className="mt-8">
          <Link to="/imoveis">Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  const capa = imagens[ativa] ?? imagens[0] ?? "/images/imovel-1.jpg";
  const mensagem = `Olá! Tenho interesse no imóvel "${imovel.titulo}" em ${imovel.cidade}. Podemos conversar?`;

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-10 md:px-8">
        <Link
          to="/imoveis"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" /> Voltar ao catálogo
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-6 md:px-8">
        <div className="overflow-hidden rounded-lg bg-muted shadow-lift">
          <img
            src={capa}
            alt={imovel.titulo}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
        {imagens.length > 1 && (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {imagens.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setAtiva(i)}
                aria-label={`Foto ${i + 1}`}
                data-ativa={i === ativa}
                className="h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 border-transparent data-[ativa=true]:border-primary"
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:px-8 lg:grid-cols-[1.6fr_1fr] lg:py-20">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-secondary px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-secondary-foreground">
              {tipoLabel(imovel.tipo)}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-primary">
              {STATUS_LABEL[imovel.status] ?? imovel.status}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="size-3.5" /> {imovel.visualizacoes} visualizações
            </span>
          </div>

          <h1 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-tight">
            {imovel.titulo}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            {imovel.bairro ? `${imovel.bairro}, ` : ""}
            {imovel.cidade} — Bahia
          </p>

          <div className="rule-sand my-8" />

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Dado icone={<BedDouble className="size-5" />} valor={String(imovel.quartos)} rotulo="Quartos" />
            <Dado icone={<Bath className="size-5" />} valor={String(imovel.banheiros)} rotulo="Banheiros" />
            <Dado icone={<Ruler className="size-5" />} valor={formatArea(imovel.area)} rotulo="Área" />
            <Dado icone={<MapPin className="size-5" />} valor={imovel.cidade} rotulo="Região" />
          </div>

          <div className="rule-sand my-8" />

          <h2 className="font-display text-2xl">Sobre o imóvel</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
            {imovel.descricao}
          </p>

          {imovel.caracteristicas.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-2xl">Características</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {imovel.caracteristicas.map((c) => (
                  <li key={c} className="flex items-center gap-2.5 text-sm">
                    <Check className="size-4 shrink-0 text-primary" /> {c}
                  </li>
                ))}
              </ul>
            </>
          )}

          {imovel.video_url && (
            <>
              <h2 className="mt-12 font-display text-2xl">Vídeo do imóvel</h2>
              <video
                src={imovel.video_url}
                controls
                className="mt-5 aspect-video w-full rounded-lg bg-ink object-cover"
              />
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="rounded-lg border border-border bg-card p-7 shadow-soft">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Valor</p>
            <p className="mt-2 font-display text-4xl text-primary">{formatBRL(Number(imovel.preco))}</p>

            {consultor && (
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary font-display text-lg text-primary">
                  {consultor.foto_url ? (
                    <img src={consultor.foto_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    consultor.nome.slice(0, 1)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{consultor.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Consultor{consultor.cidade ? ` · ${consultor.cidade}` : ""}
                  </p>
                </div>
              </div>
            )}

            <Button asChild variant="wood" size="lg" className="mt-6 w-full">
              <a
                href={whatsappLink(mensagem, consultor?.whatsapp || undefined)}
                target="_blank"
                rel="noreferrer noopener"
              >
                <MessageCircle className="size-4" /> Conversar no WhatsApp
              </a>
            </Button>

            <div className="mt-8 border-t border-border pt-6">
              <p className="font-display text-lg">Ou envie uma mensagem</p>
              <div className="mt-4">
                <LeadForm
                  compact
                  propertyId={imovel.id}
                  consultorId={imovel.consultor_id}
                  mensagemInicial={mensagem}
                />
              </div>
            </div>
          </Reveal>
        </aside>
      </section>
    </>
  );
}

function Dado({
  icone,
  valor,
  rotulo,
}: {
  icone: React.ReactNode;
  valor: string;
  rotulo: string;
}) {
  return (
    <div>
      <span className="text-madeira">{icone}</span>
      <p className="mt-2 font-display text-xl leading-tight">{valor}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{rotulo}</p>
    </div>
  );
}
