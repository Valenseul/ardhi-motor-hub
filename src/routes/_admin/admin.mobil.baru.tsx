import { createFileRoute } from "@tanstack/react-router";
import { CarForm } from "@/components/admin/CarForm";

export const Route = createFileRoute("/_admin/admin/mobil/baru")({
  component: () => (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Tambah Mobil Baru</h1>
      <p className="text-sm text-muted-foreground">Isi data mobil dulu, lalu upload foto setelah tersimpan.</p>
      <CarForm />
    </div>
  ),
});
