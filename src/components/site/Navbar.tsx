import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOWROOM, waLink } from "@/lib/showroom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.jpeg"
            alt="Ardhi Motor"
            className="h-12 w-12 object-contain mix-blend-multiply dark:mix-blend-screen"
            style={{ mixBlendMode: "multiply" }}
          />
          <span className="font-display text-lg font-bold tracking-tight">
            {SHOWROOM.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground/80 transition hover:text-primary" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>
            Beranda
          </Link>
          <Link to="/katalog" className="text-sm font-medium text-foreground/80 transition hover:text-primary" activeProps={{ className: "text-primary" }}>
            Katalog
          </Link>
          <Link to="/tentang" className="text-sm font-medium text-foreground/80 transition hover:text-primary" activeProps={{ className: "text-primary" }}>
            Tentang
          </Link>
          <Link to="/kontak" className="text-sm font-medium text-foreground/80 transition hover:text-primary" activeProps={{ className: "text-primary" }}>
            Kontak
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <a href={waLink(`Halo ${SHOWROOM.name}, saya ingin bertanya.`)} target="_blank" rel="noreferrer">
            <Button size="sm" className="hidden bg-[var(--whatsapp)] text-[var(--whatsapp-foreground)] hover:opacity-90 sm:inline-flex">
              <Phone className="mr-2 h-4 w-4" /> Hubungi Kami
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}