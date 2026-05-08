import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroImg from "@/assets/hero-showroom.jpg";

const PRICE_OPTIONS = [
  { v: "all", label: "Semua Harga" },
  { v: "0-100", label: "< 100 jt" },
  { v: "100-200", label: "100 – 200 jt" },
  { v: "200-300", label: "200 – 300 jt" },
  { v: "300-9999", label: "> 300 jt" },
];

const TYPE_OPTIONS = [
  { v: "all", label: "Semua Tipe" },
  { v: "MPV", label: "MPV" },
  { v: "SUV", label: "SUV" },
  { v: "Sedan", label: "Sedan" },
  { v: "Hatchback", label: "Hatchback" },
];

export function Hero() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [price, setPrice] = useState("all");
  const [type, setType] = useState("all");

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={heroImg}
        alt="Showroom Ardhi Motor"
        width={1920}
        height={1080}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-overlay)" }} />
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl text-primary-foreground">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            🏆 Showroom Mobil Bekas Terpercaya di Depok
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
            Temukan Mobil Bekas <span className="text-accent">Berkualitas</span> Impianmu
          </h1>
          <p className="mt-4 text-base text-primary-foreground/85 md:text-lg">
            Lebih dari ratusan unit siap pakai, sudah lulus inspeksi, garansi resmi, dan pajak hidup.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({
              to: "/katalog",
              search: { q: q || undefined, price: price !== "all" ? price : undefined, type: type !== "all" ? type : undefined } as never,
            });
          }}
          className="mt-10 grid gap-3 rounded-2xl border border-white/20 bg-background/95 p-3 shadow-[var(--shadow-elegant)] backdrop-blur md:grid-cols-[1fr_180px_180px_auto]"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari merk, model, atau tahun (mis. Toyota Avanza 2020)"
              className="h-12 pl-9 text-base"
            />
          </div>
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRICE_OPTIONS.map((o) => <SelectItem key={o.v} value={o.v}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((o) => <SelectItem key={o.v} value={o.v}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button type="submit" size="lg" className="h-12 px-6">
            <Search className="mr-2 h-4 w-4" /> Cari Mobil
          </Button>
        </form>
      </div>
    </section>
  );
}
