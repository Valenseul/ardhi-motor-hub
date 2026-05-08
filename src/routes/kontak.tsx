import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SHOWROOM, waLink } from "@/lib/showroom";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/kontak")({
  head: () => ({ meta: [
    { title: "Kontak — Ardhi Motor" },
    { name: "description", content: "Hubungi showroom Ardhi Motor di Depok via WhatsApp, telepon, atau kunjungi langsung." },
  ]}),
  component: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="font-display text-4xl font-bold">Hubungi Kami</h1>
        <p className="mt-2 text-muted-foreground">Kami siap membantu menemukan mobil terbaik untuk Anda.</p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-primary" /><div><div className="font-semibold">Alamat</div><div className="text-sm text-muted-foreground">{SHOWROOM.address}</div></div></div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3"><Phone className="mt-1 h-5 w-5 text-primary" /><div><div className="font-semibold">Telepon</div><div className="text-sm text-muted-foreground">{SHOWROOM.phone}<br />{SHOWROOM.phone2}</div></div></div>
            </div>
            <a href={waLink(`Halo ${SHOWROOM.name}, saya ingin bertanya.`)} target="_blank" rel="noreferrer">
              <Button size="lg" className="w-full bg-[var(--whatsapp)] text-[var(--whatsapp-foreground)] hover:opacity-90">
                <MessageCircle className="mr-2 h-5 w-5" /> Chat WhatsApp Sekarang
              </Button>
            </a>
          </div>
          <div className="overflow-hidden rounded-xl border border-border shadow-[var(--shadow-card)]">
            <iframe title="Lokasi Ardhi Motor" src={SHOWROOM.mapEmbed} className="h-[420px] w-full" loading="lazy" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  ),
});
