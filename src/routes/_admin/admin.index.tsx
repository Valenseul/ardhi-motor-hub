import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Car, CheckCircle2, Clock, TrendingUp, DollarSign } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR } from "@/lib/showroom";

export const Route = createFileRoute("/_admin/admin/")({
  component: Overview,
});

async function fetchStats() {
  const { data: cars } = await supabase.from("cars").select("id,status,price,sold_at,created_at").neq("status", "dihapus");
  const list = cars ?? [];
  const tersedia = list.filter((c) => c.status === "tersedia").length;
  const terjual = list.filter((c) => c.status === "terjual").length;
  const reserved = list.filter((c) => c.status === "reserved").length;

  const today = new Date(); today.setHours(0,0,0,0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const revenueToday = list.filter((c) => c.status === "terjual" && c.sold_at && new Date(c.sold_at) >= today).reduce((a, b) => a + Number(b.price), 0);
  const revenueMonth = list.filter((c) => c.status === "terjual" && c.sold_at && new Date(c.sold_at) >= monthStart).reduce((a, b) => a + Number(b.price), 0);

  // Build last-30-days sales chart
  const days: { date: string; label: string; total: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().slice(0,10), label: `${d.getDate()}/${d.getMonth()+1}`, total: 0 });
  }
  list.forEach((c) => {
    if (c.status === "terjual" && c.sold_at) {
      const k = c.sold_at.slice(0, 10);
      const day = days.find((d) => d.date === k);
      if (day) day.total += Number(c.price);
    }
  });

  return { tersedia, terjual, reserved, revenueToday, revenueMonth, chart: days, total: list.length };
}

async function fetchRecent() {
  const { data } = await supabase.from("cars").select("id,brand,model,year,price,status,created_at").order("created_at", { ascending: false }).limit(6);
  return data ?? [];
}

function Overview() {
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: fetchStats });
  const { data: recent = [] } = useQuery({ queryKey: ["admin-recent"], queryFn: fetchRecent });

  const cards = [
    { icon: Car, label: "Total Mobil", value: data?.total ?? 0, color: "bg-primary text-primary-foreground" },
    { icon: CheckCircle2, label: "Tersedia", value: data?.tersedia ?? 0, color: "bg-success text-success-foreground" },
    { icon: Clock, label: "Reserved", value: data?.reserved ?? 0, color: "bg-warning text-warning-foreground" },
    { icon: TrendingUp, label: "Terjual", value: data?.terjual ?? 0, color: "bg-accent text-accent-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold md:text-3xl">Overview</h1>
        <p className="text-sm text-muted-foreground">Ringkasan aktivitas showroom</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <span className={`grid h-9 w-9 place-items-center rounded-md ${c.color}`}><c.icon className="h-4 w-4" /></span>
            </div>
            <div className="mt-3 font-display text-3xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /> Revenue Hari Ini</div>
          <div className="mt-2 font-display text-2xl font-bold text-primary">{formatIDR(data?.revenueToday ?? 0)}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /> Revenue Bulan Ini</div>
          <div className="mt-2 font-display text-2xl font-bold text-primary">{formatIDR(data?.revenueMonth ?? 0)}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-lg font-bold">Grafik Penjualan (30 Hari Terakhir)</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.chart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1_000_000).toFixed(0)}jt`} />
              <Tooltip formatter={(v: number) => formatIDR(v)} />
              <Line type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-lg font-bold">Aktivitas Terbaru</h2>
        <ul className="mt-4 divide-y divide-border">
          {recent.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3 text-sm">
              <span>{c.brand} {c.model} {c.year}</span>
              <span className="text-muted-foreground">{formatIDR(Number(c.price))}</span>
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs capitalize">{c.status}</span>
            </li>
          ))}
          {recent.length === 0 && <li className="py-3 text-sm text-muted-foreground">Belum ada aktivitas.</li>}
        </ul>
      </div>
    </div>
  );
}
