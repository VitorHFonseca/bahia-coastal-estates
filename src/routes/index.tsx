import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Pause, Play, ArrowRight, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Reveal, CounterStat } from "@/components/site/Reveal";
import { PropertyCard } from "@/components/site/PropertyCard";
import { LeadForm } from "@/components/site/LeadForm";
import { REGIOES } from "@/lib/regioes";
import { destaquesQuery } from "@/lib/properties";

// Coloque aqui a URL de um vídeo .mp4 do litoral para ativar o hero em vídeo.
// Enquanto estiver vazio, o hero usa a imagem de capa com zoom lento.
const HERO_VIDEO_URL = "";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Costa da Bahia — Viva o litoral da Bahia" },
      {
        name: "description",
        content:
          "Imobiliária boutique do litoral baiano: casas frente-mar, terrenos, pousadas e fazendas em Trancoso, Itacaré, Morro de São Paulo e Praia do Forte.",
      },
      { property: "og:title", content: "Costa da Bahia — Viva o litoral da Bahia" },
      {
        property: "og:description",
        content:
          "Casas frente-mar, terrenos e pousadas entre Praia do Forte e o extremo sul da Bahia.",
      },
    ],
  }),
  component: Home,
});

const DEPOIMENTOS = [
  {
    nome: "Ana e Rodrigo Vasques",
    local: "Compraram em Trancoso",
    texto:
      "Procurávamos uma casa de família há três anos. A Costa da Bahia entendeu o que queríamos antes de nós e nos levou direto à casa certa, com toda a documentação resolvida.",
  },
  {
    nome: "Marina Aguiar",
    local: "Investidora — Morro de São Paulo",
    texto:
      "Comprei uma pousada em operação com o acompanhamento deles do começo ao fim. Atendimento de boutique mesmo: pessoal, rápido e muito honesto sobre os números.",
  },
  {
    nome: "Thiago Bomfim",
    local: "Vendeu em Itacaré",
    texto:
      "Vendi minha casa em 40 dias, com fotos e vídeo que finalmente mostraram o imóvel como ele é. Recomendo sem pensar duas vezes.",
  },
];

function Home() {
  const { data: destaques = [] } = useQuery(destaquesQuery);

  return (
    <>
      <Hero />
      <Sobre />
      <Destaques imoveis={destaques} />
      <Regioes />
      <Depoimentos />
      <VideoInstitucional />
      <Contato />
    </>
  );
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden">
      {HERO_VIDEO_URL ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO_URL}
          poster="/images/hero-litoral.jpg"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src="/images/hero-litoral.jpg"
          alt="Litoral da Bahia ao amanhecer, com praia, coqueiros e casa de palha"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full animate-[pulse_0ms] object-cover motion-safe:[animation:none]"
          style={{ transform: "scale(1.02)" }}
        />
      )}
      <div className="overlay-hero absolute inset-0" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 md:px-8 md:pb-28">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-primary-foreground/75">
            Trancoso · Itacaré · Morro de São Paulo · Praia do Forte
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] text-primary-foreground">
            Viva o litoral
            <br />
            da Bahia
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            Casas de pé na areia, terrenos com vista e pousadas em operação — selecionados um por um
            entre as vilas e praias mais bonitas do litoral baiano.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/imoveis">Ver imóveis</Link>
            </Button>
            <Button asChild variant="heroGhost" size="xl">
              <Link to="/contato">Fale com um consultor</Link>
            </Button>
          </div>
        </Reveal>
      </div>

      {HERO_VIDEO_URL && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo"}
          className="absolute bottom-8 right-5 grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/25 md:right-8"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
      )}
    </section>
  );
}

function Sobre() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <Reveal>
          <p className="eyebrow text-primary">A imobiliária</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.25rem)] leading-tight">
            Quinze anos vendendo o litoral que a gente mesmo escolheu morar
          </h2>
          <div className="rule-sand my-8" />
          <p className="text-base leading-relaxed text-muted-foreground">
            A Costa da Bahia nasceu em Trancoso, em 2011, de uma conversa entre dois corretores que
            queriam fazer o oposto de um portal de imóveis: poucos imóveis, muito conhecimento de
            cada vila, cada praia e cada rua de areia.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Hoje somos uma equipe pequena e obsessiva, presente em dez cidades do litoral baiano.
            Visitamos cada imóvel antes de anunciar, checamos documentação, cuidamos da fotografia e
            acompanhamos a negociação até a escritura.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <CounterStat valor={300} prefixo="+" legenda="imóveis vendidos no litoral" />
            <CounterStat valor={15} legenda="anos de experiência na região" />
            <CounterStat valor={10} legenda="cidades e vilas atendidas" />
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="hover-zoom overflow-hidden rounded-lg shadow-lift">
            <img
              src="/images/sobre.jpg"
              alt="Sala integrada de casa rústica-chique com vista para piscina e mar"
              width={1200}
              height={1408}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="mt-6 flex items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-soft">
            <Quote className="size-6 shrink-0 text-primary" />
            <p className="font-display text-lg leading-snug">
              "Não vendemos metros quadrados. Vendemos a rotina de acordar com o som do mar."
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Destaques({ imoveis }: { imoveis: Parameters<typeof PropertyCard>[0]["imovel"][] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * (track.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <section className="bg-secondary/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6">
          <div className="min-w-0">
            <p className="eyebrow text-primary">Seleção da semana</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-tight">
              Imóveis em evidência
            </h2>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-background"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Próximo"
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-background"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {imoveis.length === 0 &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-96 w-[85%] shrink-0 animate-pulse rounded-lg bg-card sm:w-[46%] lg:w-[31%]"
              />
            ))}
          {imoveis.map((imovel) => (
            <div
              key={imovel.id}
              className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
            >
              <PropertyCard imovel={imovel} />
            </div>
          ))}
        </div>

        <Reveal className="mt-10">
          <Button asChild variant="outline" size="lg">
            <Link to="/imoveis">
              Ver catálogo completo <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function Regioes() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal className="max-w-2xl">
        <p className="eyebrow text-primary">Onde atuamos</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-tight">
          Regiões do litoral baiano
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          De Praia do Forte ao extremo sul: cada vila tem seu próprio ritmo, seu preço por metro e
          seu tipo de comprador. Escolha um destino e veja o que temos disponível.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {REGIOES.map((regiao, i) => (
          <Reveal key={regiao.nome} delay={i * 90}>
            <Link
              to="/imoveis"
              search={{ cidade: regiao.nome }}
              className="hover-zoom group relative block h-[26rem] overflow-hidden rounded-lg shadow-soft"
            >
              <img
                src={regiao.imagem}
                alt={`Paisagem de ${regiao.nome}, Bahia`}
                width={800}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/85 via-ocean-deep/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl text-primary-foreground">{regiao.nome}</h3>
                <p className="mt-2 text-sm leading-snug text-primary-foreground/80">
                  {regiao.descricao}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                  Ver imóveis <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Depoimentos() {
  const [index, setIndex] = useState(0);
  const depoimento = DEPOIMENTOS[index]!;

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % DEPOIMENTOS.length), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-ocean-deep py-24 text-primary-foreground md:py-32">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <p className="eyebrow text-primary-foreground/60">Quem já mudou de vida</p>
          <blockquote className="mt-10 font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-snug">
            "{depoimento.texto}"
          </blockquote>
          <p className="mt-8 text-sm font-semibold">{depoimento.nome}</p>
          <p className="text-xs uppercase tracking-widest text-primary-foreground/60">
            {depoimento.local}
          </p>
          <div className="mt-10 flex justify-center gap-2">
            {DEPOIMENTOS.map((d, i) => (
              <button
                key={d.nome}
                type="button"
                aria-label={`Depoimento de ${d.nome}`}
                onClick={() => setIndex(i)}
                className={
                  i === index
                    ? "h-1.5 w-10 rounded-full bg-primary transition-all"
                    : "h-1.5 w-5 rounded-full bg-primary-foreground/30 transition-all"
                }
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function VideoInstitucional() {
  const [tocando, setTocando] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-primary">Vídeo institucional</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-tight">
          Três minutos no nosso litoral
        </h2>
      </Reveal>

      <Reveal delay={120} className="mt-12">
        <div className="relative overflow-hidden rounded-lg shadow-lift">
          {tocando && HERO_VIDEO_URL ? (
            <video
              src={HERO_VIDEO_URL}
              poster="/images/hero-litoral.jpg"
              controls
              autoPlay
              className="aspect-video w-full bg-ink object-cover"
            />
          ) : (
            <>
              <img
                src="/images/hero-litoral.jpg"
                alt="Vista aérea do litoral baiano"
                width={1920}
                height={1088}
                loading="lazy"
                className="aspect-video w-full object-cover"
              />
              <div className="absolute inset-0 bg-ink/35" />
              <button
                type="button"
                onClick={() => {
                  if (!HERO_VIDEO_URL) {
                    toast.info(
                      "Adicione o link do vídeo institucional para ativar o player nesta seção.",
                    );
                    return;
                  }
                  setTocando(true);
                }}
                className="absolute inset-0 grid place-items-center"
                aria-label="Reproduzir vídeo institucional"
              >
                <span className="grid h-20 w-20 place-items-center rounded-full bg-primary-foreground/90 text-ocean-deep transition-transform duration-500 hover:scale-110">
                  <Play className="size-7" />
                </span>
              </button>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function Contato() {
  return (
    <section className="bg-secondary/60 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="eyebrow text-primary">Vamos conversar</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-tight">
            Conte o que você procura
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Um consultor da região responde pessoalmente, com opções dentro e fora do site — muitos
            dos nossos imóveis nunca chegam a ser anunciados.
          </p>
          <div className="rule-sand my-8" />
          <p className="text-sm text-muted-foreground">
            Ou fale direto no WhatsApp: <strong>+55 73 99999-0000</strong>
          </p>
        </Reveal>
        <Reveal delay={120} className="rounded-lg border border-border bg-card p-7 shadow-soft">
          <LeadForm titulo="Fale com um consultor" />
        </Reveal>
      </div>
    </section>
  );
}
