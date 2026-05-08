import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Car } from "lucide-react";
import { SHOWROOM } from "@/lib/showroom";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white">
              <img
                src="/logo.jpeg"
                alt="Ardhi Motor"
                className="h-10 w-10 object-contain mix-blend-multiply"
              />
            </span>
            <span className="font-display text-lg font-bold">{SHOWROOM.name}</span>
          </div>
          <p className="mt-3 text-sm text-primary-foreground/80">
            {SHOWROOM.tagline}. Showroom mobil bekas terpercaya di Depok.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Navigasi</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/" className="hover:text-accent">Beranda</Link></li>
            <li><Link to="/katalog" className="hover:text-accent">Katalog Mobil</Link></li>
            <li><Link to="/tentang" className="hover:text-accent">Tentang Kami</Link></li>
            <li><Link to="/kontak" className="hover:text-accent">Kontak</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Leasing Partner</h4>
          <ul className="mt-3 grid grid-cols-2 gap-1 text-sm text-primary-foreground/80">
            {SHOWROOM.leasing.map((l) => <li key={l}>• {l}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Hubungi</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{SHOWROOM.address}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" />{SHOWROOM.phone}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" />{SHOWROOM.phone2}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} {SHOWROOM.name}. All rights reserved.
      </div>
    </footer>
  );
}
