import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/imoveis", label: "Imóveis" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !overHero || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid ? "border-b border-border bg-background/92 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 md:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="Costa da Bahia Imobiliária"
            width={512}
            height={512}
            className={cn("h-10 w-10 shrink-0", !solid && "brightness-0 invert")}
          />
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate font-display text-lg leading-none",
                solid ? "text-foreground" : "text-primary-foreground",
              )}
            >
              Costa da Bahia
            </span>
            <span
              className={cn(
                "eyebrow mt-1 block text-[0.6rem]",
                solid ? "text-muted-foreground" : "text-primary-foreground/75",
              )}
            >
              Imóveis do litoral
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  solid
                    ? "text-foreground/75 hover:text-primary"
                    : "text-primary-foreground/85 hover:text-primary-foreground",
                )}
                activeProps={{
                  className: cn("font-semibold", solid ? "text-primary" : "text-primary-foreground"),
                }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button
            asChild
            size="sm"
            variant={solid ? "default" : "heroGhost"}
            className="hidden sm:inline-flex"
          >
            <Link to="/painel">Área do Consultor</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-md lg:hidden",
              solid ? "text-foreground" : "text-primary-foreground",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-6 pt-2 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block border-b border-border/60 py-3 font-display text-xl text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-5 w-full" size="lg">
            <Link to="/painel">Área do Consultor</Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
