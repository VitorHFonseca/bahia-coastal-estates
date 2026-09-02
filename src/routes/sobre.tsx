import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, HeartHandshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, CounterStat } from "@/components/site/Reveal";
import { REGIOES } from "@/lib/regioes";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Costa da Bahia — imobiliária boutique do litoral" },
      {
        name: "description",
        content:
          "Desde 2011 em Trancoso: uma equipe pequena, especializada no litoral baiano, que visita cada imóvel antes de anunciar.",
      },
      { property: "og:title", content: "Sobre a Costa da Bahia" },
      {
        property: "og:description",
        content: "Imobiliária boutique do litoral baiano, com curadoria e acompanhamento completo.",
      },
    ],
  }),
  component: Sobre,
});

const PILARES = [
  {
    icone: Compass,
    titulo: "Curadoria de verdade",
    texto:
      "Anunciamos poucos imóveis por vez. Cada um é visitado, fotografado e checado antes de entrar no site.",
  },
  {
    icone: ShieldCheck,
    titulo: "Documentação em ordem",
    texto:
      "Analisamos matrícula, georreferenciamento e regularidade municipal antes de qualquer proposta.",
  },
  {
    icone: HeartHandshake,
    titulo: "Acompanhamento até a chave",
    texto:
      "Ficamos ao lado do comprador do primeiro passeio à escritura — inclusive na obra e na mobília.",
  },
];

function Sobre() {
  return (
    <>
      <section className="relative flex min-h-[60svh] items-end overflow-hidden">
        <img
          src="/images/sobre.jpg"
          alt="Interior rústico-chique de casa no litoral da Bahia"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="overlay-hero absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8">
          <p className="eyebrow text-primary-foreground/70">Quem somos</p>
          <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.02] text-primary-foreground">
            Uma imobiliária feita por quem mora aqui
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="font-display text-2xl leading-snug">
            Começamos em 2011, numa sala de dois metros no Quadrado de Trancoso, vendendo casas para
            amigos que se apaixonavam pela vila.
          </p>
          <div className="rule-sand my-8" />
          <p className="text-base leading-relaxed text-muted-foreground">
            Quinze anos depois, mantivemos o método: pouca gente, muito conhecimento local. Nossos
            consultores moram nas regiões onde atuam — sabem qual rua alaga na chuva, qual praia
            perde areia no inverno e em qual trecho o metro quadrado ainda faz sentido.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Trabalhamos com casas de família, terrenos, pousadas em operação e algumas fazendas
            litorâneas. Também representamos proprietários na venda, com fotografia, vídeo e uma
            rede de compradores que acompanha nossos lançamentos privados.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <CounterStat valor={300} prefixo="+" legenda="imóveis vendidos" />
            <CounterStat valor={15} legenda="anos no litoral baiano" />
            <CounterStat valor={10} legenda="cidades atendidas" />
          </div>
        </Reveal>
      </section>

      <section className="bg-secondary/60 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-primary">Como trabalhamos</p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight">
              Três compromissos que não negociamos
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PILARES.map((pilar, i) => (
              <Reveal
                key={pilar.titulo}
                delay={i * 100}
                className="rounded-lg border border-border bg-card p-8 shadow-soft"
              >
                <pilar.icone className="size-7 text-primary" />
                <h3 className="mt-5 font-display text-xl">{pilar.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pilar.texto}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="eyebrow text-primary">Onde estamos</p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight">
              Escritórios e consultores nas principais vilas
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Trancoso, Itacaré, Morro de São Paulo e Praia do Forte concentram nossa operação, com
              atendimento também em Caraíva, Maraú, Boipeba e Imbassaí.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/contato">Agendar uma conversa</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {REGIOES.map((regiao) => (
              <div key={regiao.nome} className="hover-zoom overflow-hidden rounded-lg shadow-soft">
                <img
                  src={regiao.imagem}
                  alt={regiao.nome}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
