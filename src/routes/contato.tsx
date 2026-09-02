import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { LeadForm } from "@/components/site/LeadForm";
import { whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Costa da Bahia Imóveis" },
      {
        name: "description",
        content:
          "Fale com um consultor do litoral baiano por WhatsApp, telefone ou e-mail e receba opções sob medida.",
      },
      { property: "og:title", content: "Contato — Costa da Bahia Imóveis" },
      {
        property: "og:description",
        content: "Atendimento boutique para compra e venda de imóveis no litoral da Bahia.",
      },
    ],
  }),
  component: Contato,
});

function Contato() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal className="max-w-2xl">
        <p className="eyebrow text-primary">Contato</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-tight">
          Vamos encontrar o seu lugar no litoral
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Conte a região, o perfil do imóvel e o momento da compra. Um consultor da região responde
          em até um dia útil — normalmente muito antes.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <Reveal className="space-y-6">
          <InfoCard icone={<MessageCircle className="size-5 text-primary" />} titulo="WhatsApp">
            <p className="text-sm text-muted-foreground">+55 73 99999-0000</p>
            <Button asChild variant="wood" size="sm" className="mt-4">
              <a
                href={whatsappLink("Olá! Gostaria de falar com um consultor da Costa da Bahia.")}
                target="_blank"
                rel="noreferrer noopener"
              >
                Abrir conversa
              </a>
            </Button>
          </InfoCard>
          <InfoCard icone={<Phone className="size-5 text-primary" />} titulo="Telefone">
            <p className="text-sm text-muted-foreground">+55 73 3668-0000</p>
          </InfoCard>
          <InfoCard icone={<Mail className="size-5 text-primary" />} titulo="E-mail">
            <p className="text-sm text-muted-foreground">contato@costadabahia.com.br</p>
          </InfoCard>
          <InfoCard icone={<MapPin className="size-5 text-primary" />} titulo="Escritório">
            <p className="text-sm text-muted-foreground">
              Quadrado, s/n — Trancoso, Porto Seguro — BA
            </p>
          </InfoCard>
          <InfoCard icone={<Clock className="size-5 text-primary" />} titulo="Atendimento">
            <p className="text-sm text-muted-foreground">
              Segunda a sábado, 9h às 18h — visitas agendadas também aos domingos.
            </p>
          </InfoCard>
        </Reveal>

        <Reveal delay={120} className="rounded-lg border border-border bg-card p-7 shadow-soft">
          <LeadForm titulo="Envie sua mensagem" />
        </Reveal>
      </div>
    </section>
  );
}

function InfoCard({
  icone,
  titulo,
  children,
}: {
  icone: React.ReactNode;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-3">
        {icone}
        <h2 className="font-display text-lg">{titulo}</h2>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
