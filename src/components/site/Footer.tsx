import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { REGIOES } from "@/lib/regioes";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-ocean-deep text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt=""
                width={512}
                height={512}
                loading="lazy"
                className="h-10 w-10 brightness-0 invert"
              />
              <span className="font-display text-xl">Costa da Bahia</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
              Imobiliária boutique dedicada ao litoral baiano. Casas, terrenos, pousadas e fazendas
              entre Praia do Forte e o extremo sul.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-primary-foreground/25 transition-colors hover:bg-primary-foreground/10"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-primary-foreground/25 transition-colors hover:bg-primary-foreground/10"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="eyebrow text-primary-foreground/60">Navegação</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-primary">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/imoveis" className="hover:text-primary">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-primary">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-primary">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/painel" className="hover:text-primary">
                  Área do Consultor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-primary-foreground/60">Regiões</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {REGIOES.map((r) => (
                <li key={r.nome}>
                  <Link
                    to="/imoveis"
                    search={{ cidade: r.nome }}
                    className="hover:text-primary"
                  >
                    {r.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-primary-foreground/60">Contato</h3>
            <ul className="mt-5 space-y-4 text-sm text-primary-foreground/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Quadrado, s/n — Trancoso, Porto Seguro — BA</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href="tel:+5573999990000">+55 73 99999-0000</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href="mailto:contato@costadabahia.com.br">contato@costadabahia.com.br</a>
              </li>
            </ul>
            <div className="mt-6 overflow-hidden rounded-md border border-primary-foreground/15">
              <iframe
                title="Mapa da sede em Trancoso"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-39.12%2C-16.60%2C-39.06%2C-16.55&layer=mapnik"
                className="h-36 w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Costa da Bahia Imóveis. CRECI-BA 12.345-J.</p>
          <p>Feito no litoral, para quem quer viver nele.</p>
        </div>
      </div>
    </footer>
  );
}
