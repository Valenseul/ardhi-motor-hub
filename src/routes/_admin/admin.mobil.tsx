import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCarsWithPrimaryImage } from "@/lib/queries";
import { formatIDR, formatKm } from "@/lib/showroom";

export const Route = createFileRoute("/_admin/admin/mobil")({
  component: ManageCars,
});

function ManageCars() {
  const matchRoute = useMatchRoute();
  const isChild = matchRoute({ to: "/admin/mobil/baru" }) ||
                  matchRoute({ to: "/admin/mobil/$carId", fuzzy: true });

  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const { data: cars = [], isLoading } = useQuery({ queryKey: ["admin-cars"], queryFn: fetchCarsWithPrimaryImage });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cars").update({ status: "dihapus" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Mobil dihapus");
      qc.invalidateQueries({ queryKey: ["admin-cars"] });
      qc.invalidateQueries({ queryKey: ["cars-all"] });
      qc.invalidateQueries({ queryKey: ["cars-home"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = cars.filter((c) => {
    if (status !== "all" && c.status !== status) return false;
    if (q && !`${c.brand} ${c.model} ${c.year}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  if (isChild) return <Outlet />;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Manajemen Mobil</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} dari {cars.length} mobil</p>
        </div>
        <Link to="/admin/mobil/baru"><Button><Plus className="mr-2 h-4 w-4" /> Tambah Mobil</Button></Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari mobil..." className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="tersedia">Tersedia</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="terjual">Terjual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr className="text-left">
              <th className="p-3">Foto</th>
              <th className="p-3">Mobil</th>
              <th className="p-3">Tahun</th>
              <th className="p-3">KM</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Memuat...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Tidak ada mobil.</td></tr>
            ) : filtered.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3">
                  <div className="h-12 w-16 overflow-hidden rounded-md bg-muted">
                    {c.primaryImage ? <img src={c.primaryImage} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                </td>
                <td className="p-3 font-medium">{c.brand} {c.model}</td>
                <td className="p-3">{c.year}</td>
                <td className="p-3">{formatKm(c.mileage_km)}</td>
                <td className="p-3 font-semibold text-primary">{formatIDR(Number(c.price))}</td>
                <td className="p-3"><Badge variant={c.status === "tersedia" ? "default" : "secondary"} className="capitalize">{c.status}</Badge></td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link to="/admin/mobil/$carId" params={{ carId: c.id }}>
                      <Button size="icon" variant="outline"><Pencil className="h-4 w-4" /></Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="outline" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus mobil ini?</AlertDialogTitle>
                          <AlertDialogDescription>Mobil akan disembunyikan dari katalog publik.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => del.mutate(c.id)}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}