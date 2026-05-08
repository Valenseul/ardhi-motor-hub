import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Calendar, Fuel, Gauge, Settings2, Palette, Cog, ShieldCheck, BadgeCheck } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchCar, fetchCarImages } from "@/lib/queries";
import { formatIDR, formatKm, SHOWROOM, waLink } from "@/lib/showroom";

export const Route = createFileRoute("/mobil/$carId")({
  component: CarDetail,
  notFoundComponent: () => (
    <div className="min-h-screen"><Navbar /><div className="container mx-auto px-4 py-20 text-center"><p>Mobil tidak ditemukan.</p><Link to="/katalog" className="text-primary underline">Kembali ke katalog</Link></div></div>
  ),
});

function CarDetail() {
  const { carId } = Route.useParams();
  const { data: car, isLoading } = useQuery({ queryKey: ["car", carId], queryFn: () => fetchCar(carId) });
  const { data: images = [] } = useQuery({ queryKey: ["car-images", carId], queryFn: () => fetchCarImages(carId) });
  const [active, setActive] = useState(0);

  if (isLoading) return <div className="min-h-screen"><Navbar /><div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Memuat...</div></div>;
  if (!car) return <div className="min-h-screen"><Navbar /><div className="container mx-auto px-4 py-20 text-center"><p>Mobil tidak ditemukan.</p><Link to="/katalog" className="text-primary underline">Kembali ke katalog</Link></div></div>;

  const title = `${car.brand} ${car.model} ${car.year}`;
  const msg = `Halo ${SHOWROOM.name}, saya tertarik dengan ${title} (harga ${formatIDR(car.price)}). Bisa info lebih lanjut?`;

  const specs = [
    { icon: Calendar, label: "Tahun", v: car.year },
    { icon: Gauge, label: "Kilometer", v: formatKm(car.mileage_km) },
    { icon: Settings2, label: "Transmisi", v: car.transmission, cap: true },
    { icon: Fuel, label: "Bahan Bakar", v: car.fuel, cap: true },
    { icon: Palette, label: "Warna", v: car.color },
    { icon: Cog, label: "Mesin", v: car.engine_cc ? `${car.engine_cc} cc` : "-" },
    { icon: BadgeCheck, label: "Kondisi", v: car.condition.replace("_", " "), cap: true },
    { icon: ShieldCheck, label: "Status", v: car.status, cap: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Link to="/katalog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="mr-1 h-4 w-4" /> Kembali ke katalog</Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted shadow-[var(--shadow-card)]">
              {images.length > 0 ? (
                <img src={images[active].url} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground">No image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => setActive(i)} className={`aspect-square overflow-hidden rounded-md border-2 ${i === active ? "border-primary" : "border-transparent"}`}>
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <Badge variant={car.status === "tersedia" ? "default" : "secondary"} className="capitalize">{car.status}</Badge>
              <h1 className="mt-3 font-display text-2xl font-bold md:text-3xl">{title}</h1>
              <div className="mt-2 text-3xl font-bold text-primary">{formatIDR(car.price)}</div>
              <a href={waLink(msg)} target="_blank" rel="noreferrer" className="mt-5 block">
                <Button size="lg" className="w-full bg-[var(--whatsapp)] text-[var(--whatsapp-foreground)] hover:opacity-90">
                  Hubungi Penjual via WhatsApp
                </Button>
              </a>
              <div className="mt-3 text-xs text-muted-foreground">
                Telp: {SHOWROOM.phone} • {SHOWROOM.phone2}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-display font-semibold">Benefit Pembelian</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {SHOWROOM.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-success" />{b}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Specs */}
        <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-xl font-bold">Spesifikasi</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary"><s.icon className="h-4 w-4" /></span>
                <div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className={`text-sm font-semibold ${s.cap ? "capitalize" : ""}`}>{String(s.v)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Description */}
        {car.description && (
          <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-xl font-bold">Deskripsi</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/80">{car.description}</p>
          </section>
        )}

        {/* Service history */}
        {car.service_history && (
          <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-xl font-bold">Riwayat Servis & Kondisi</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/80">{car.service_history}</p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
