import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CarCard } from "@/components/site/CarCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCarsWithPrimaryImage } from "@/lib/queries";

type Search = { q?: string; price?: string; type?: string; transmission?: string };

export const Route = createFileRoute("/katalog")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    price: typeof s.price === "string" ? s.price : undefined,
    type: typeof s.type === "string" ? s.type : undefined,
    transmission: typeof s.transmission === "string" ? s.transmission : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Katalog Mobil — Ardhi Motor" },
      { name: "description", content: "Daftar lengkap mobil bekas berkualitas yang sedang dijual di showroom Ardhi Motor Depok." },
    ],
  }),
  component: KatalogPage,
});

function KatalogPage() {
  const navigate = useNavigate();
  const sp = Route.useSearch();
  const [q, setQ] = useState(sp.q ?? "");
  useEffect(() => setQ(sp.q ?? ""), [sp.q]);

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["cars-all"],
    queryFn: fetchCarsWithPrimaryImage,
  });

  const filtered = useMemo(() => {
    let list = cars.filter((c) => c.status !== "dihapus");
    const term = (sp.q ?? "").toLowerCase().trim();
    if (term) {
      list = list.filter((c) =>
        `${c.brand} ${c.model} ${c.year} ${c.color}`.toLowerCase().includes(term),
      );
    }
    if (sp.price && sp.price !== "all") {
      const [min, max] = sp.price.split("-").map(Number);
      list = list.filter((c) => c.price >= min * 1_000_000 && c.price <= max * 1_000_000);
    }
    if (sp.transmission && sp.transmission !== "all") {
      list = list.filter((c) => c.transmission === sp.transmission);
    }
    return list;
  }, [cars, sp]);

  function update(patch: Partial<Search>) {
    navigate({ to: "/katalog", search: (prev) => ({ ...prev, ...patch }) });
  }

  const hasFilter = sp.q || sp.price || sp.transmission || sp.type;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Katalog Mobil</h1>
            <p className="mt-1 text-muted-foreground">{filtered.length} mobil ditemukan</p>
          </div>
        </div>

        {/* Filters */}
        <form
          onSubmit={(e) => { e.preventDefault(); update({ q: q || undefined }); }}
          className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] md:grid-cols-[1fr_180px_180px_auto]"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari merk, model, tahun..." className="h-11 pl-9" />
          </div>
          <Select value={sp.price ?? "all"} onValueChange={(v) => update({ price: v === "all" ? undefined : v })}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Harga" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Harga</SelectItem>
              <SelectItem value="0-100">&lt; 100 jt</SelectItem>
              <SelectItem value="100-200">100 – 200 jt</SelectItem>
              <SelectItem value="200-300">200 – 300 jt</SelectItem>
              <SelectItem value="300-9999">&gt; 300 jt</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sp.transmission ?? "all"} onValueChange={(v) => update({ transmission: v === "all" ? undefined : v })}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Transmisi" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Transmisi</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="cvt">CVT</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button type="submit" className="h-11 flex-1">Cari</Button>
            {hasFilter && (
              <Button type="button" variant="outline" className="h-11" onClick={() => { setQ(""); navigate({ to: "/katalog", search: {} as never }); }}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        {/* Grid */}
        {isLoading ? (
          <div className="mt-10 text-center text-muted-foreground">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-center text-muted-foreground">Tidak ada mobil yang cocok dengan filter.</div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => <CarCard key={c.id} car={c} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
