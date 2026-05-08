import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Sparkles, Wrench, BadgeCheck, Users, Star, MapPin } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { CarCard } from "@/components/site/CarCard";
import { Button } from "@/components/ui/button";
import { fetchCarsWithPrimaryImage, fetchTestimonials } from "@/lib/queries";
import { SHOWROOM } from "@/lib/showroom";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SHOWROOM.name} — Showroom Mobil Bekas Berkualitas di Depok` },
      { name: "description", content: "Jual beli mobil bekas berkualitas di Depok. Garansi 1 tahun, pajak hidup, siap pakai. Hubungi Ardhi Motor untuk penawaran terbaik." },
      { property: "og:title", content: `${SHOWROOM.name} — Mobil Bekas Berkualitas` },
      { property: "og:description", content: "Showroom mobil bekas terpercaya di Depok. Garansi, pajak hidup, siap pakai." },
    ],
  }),
  component: HomePage,
});

const FEATURES = [
  { icon: ShieldCheck, title: "Garansi Resmi", desc: "Garansi 1 tahun untuk kredit, 4 hari untuk cash." },
  { icon: Sparkles, title: "Detailing & Coating", desc: "Setiap mobil sudah di-detailing & coating profesional." },
  { icon: Wrench, title: "Siap Pakai", desc: "Sudah service rutin, pajak hidup, langsung jalan." },
  { icon: BadgeCheck, title: "Inspeksi Lengkap", desc: "Lulus pengecekan mesin, kaki-kaki, kelistrikan." },
];

function HomePage() {
  const { data: cars = [] } = useQuery({
    queryKey: ["cars-home"],
    queryFn: fetchCarsWithPrimaryImage,
  });
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  const featured = cars.filter((c) => c.status === "tersedia").slice(0, 6);
  const totalSold = cars.filter((c) => c.status === "terjual").length + 250; // social proof baseline
  const totalAvailable = cars.filter((c) => c.status === "tersedia").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />

        {/* Stats / trust bar */}
        <section className="border-b border-border bg-card">
          <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
            {[
              { icon: Users, label: "Pelanggan Puas", value: `${totalSold}+` },
              { icon: BadgeCheck, label: "Mobil Tersedia", value: totalAvailable },
              { icon: Star, label: "Rating Pelanggan", value: "4.9 / 5" },
              { icon: MapPin, label: "Lokasi", value: "Depok" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-display text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured catalog */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Katalog Mobil Pilihan</h2>
              <p className="mt-2 text-muted-foreground">Mobil bekas berkualitas yang sedang dijual</p>
            </div>
            <Link to="/katalog" className="hidden md:block">
              <Button variant="outline">Lihat Semua <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="mt-10 text-center text-muted-foreground">Belum ada mobil tersedia.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((c) => <CarCard key={c.id} car={c} />)}
            </div>
          )}
        </section>

        {/* Why us */}
        <section className="bg-secondary/40 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold md:text-4xl">Kenapa Pilih {SHOWROOM.name}?</h2>
              <p className="mt-2 text-muted-foreground">Komitmen kami untuk pengalaman beli mobil bekas yang aman dan transparan.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                  <span className="grid h-12 w-12 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                    <f.icon className="h-6 w-6 text-primary-foreground" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Apa Kata Pelanggan</h2>
            <p className="mt-2 text-muted-foreground">Cerita asli dari pembeli {SHOWROOM.name}.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground/80">"{t.content}"</blockquote>
                <figcaption className="mt-4">
                  <div className="font-semibold">{t.customer_name}</div>
                  {t.car_label && <div className="text-xs text-muted-foreground">{t.car_label}</div>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Location */}
        <section className="bg-secondary/40 py-16">
          <div className="container mx-auto grid gap-8 px-4 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Kunjungi Showroom Kami</h2>
              <p className="mt-3 text-muted-foreground">{SHOWROOM.address}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div><span className="font-semibold">Telepon:</span> {SHOWROOM.phone}</div>
                <div><span className="font-semibold">Kantor:</span> {SHOWROOM.phone2}</div>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
                {SHOWROOM.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-success" />{b}</li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-xl border border-border shadow-[var(--shadow-card)]">
              <iframe
                title="Lokasi Ardhi Motor"
                src={SHOWROOM.mapEmbed}
                className="h-[360px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
