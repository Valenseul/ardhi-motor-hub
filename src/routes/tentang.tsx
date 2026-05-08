import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SHOWROOM } from "@/lib/showroom";
import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/tentang")({
  head: () => ({ meta: [
    { title: "Tentang Kami — Ardhi Motor" },
    { name: "description", content: "Profil singkat showroom Ardhi Motor Depok dan komitmen kami terhadap pelanggan." },
  ]}),
  component: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="font-display text-4xl font-bold">Tentang {SHOWROOM.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {SHOWROOM.name} adalah showroom mobil bekas terpercaya di Depok yang berkomitmen menyediakan kendaraan berkualitas, bergaransi, dan siap pakai untuk keluarga Indonesia.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Garansi", d: "Garansi 1 tahun untuk pembelian kredit, 4 hari untuk cash. Termasuk jaminan laka & banjir." },
            { icon: Sparkles, t: "Kualitas Terjamin", d: "Setiap unit melewati inspeksi menyeluruh dan sudah di-detailing serta coating." },
            { icon: BadgeCheck, t: "Transparan", d: "Riwayat servis lengkap, surat-surat dijamin asli, pajak hidup, siap pakai." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground"><f.icon className="h-6 w-6" /></span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold">Benefit Pembelian</h2>
            <ul className="mt-4 space-y-2 text-sm">{SHOWROOM.benefits.map((b) => (<li key={b} className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-success" />{b}</li>))}</ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold">Leasing Partner</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">{SHOWROOM.leasing.map((l) => (<li key={l}>• {l}</li>))}</ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  ),
});
