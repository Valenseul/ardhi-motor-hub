import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCar, fetchCarImages } from "@/lib/queries";

type FormState = {
  brand: string; model: string; year: number; color: string;
  mileage_km: number; price: number;
  condition: "sangat_baik" | "baik" | "cukup";
  transmission: "manual" | "automatic" | "cvt";
  fuel: "bensin" | "diesel" | "hybrid" | "listrik";
  engine_cc: number | null; plate_number: string;
  description: string; service_history: string;
  status: "tersedia" | "reserved" | "terjual" | "dihapus";
};

const empty: FormState = {
  brand: "", model: "", year: new Date().getFullYear(), color: "",
  mileage_km: 0, price: 0, condition: "baik", transmission: "manual", fuel: "bensin",
  engine_cc: null, plate_number: "", description: "", service_history: "", status: "tersedia",
};

export function CarForm({ carId }: { carId?: string }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(empty);
  const isEdit = !!carId;

  const { data: existing } = useQuery({
    queryKey: ["car-edit", carId],
    queryFn: () => fetchCar(carId!),
    enabled: isEdit,
  });
  const { data: images = [] } = useQuery({
    queryKey: ["car-images", carId],
    queryFn: () => fetchCarImages(carId!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        brand: existing.brand ?? "", 
        model: existing.model ?? "", 
        year: existing.year, 
        color: existing.color ?? "",
        mileage_km: existing.mileage_km ?? 0, 
        price: Number(existing.price),
        condition: (existing.condition as FormState["condition"]) ?? "baik",
        transmission: (existing.transmission as FormState["transmission"]) ?? "manual",
        fuel: (existing.fuel ?? "bensin") as FormState["fuel"],
        engine_cc: existing.engine_cc ?? null, 
        plate_number: existing.plate_number ?? "",
        description: existing.description ?? "", 
        service_history: existing.service_history ?? "",
        status: (existing.status as FormState["status"]) ?? "tersedia",
      });
    }
  }, [existing]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        sold_at: form.status === "terjual" ? new Date().toISOString() : null,
      };
      if (isEdit) {
        const { error } = await supabase.from("cars").update(payload).eq("id", carId!);
        if (error) throw error;
        return carId!;
      } else {
        const { data, error } = await supabase.from("cars").insert(payload).select("id").single();
        if (error) throw error;
        return data.id as string;
      }
    },
    onSuccess: (id) => {
      toast.success(isEdit ? "Perubahan disimpan" : "Mobil ditambahkan");
      qc.invalidateQueries({ queryKey: ["admin-cars"] });
      qc.invalidateQueries({ queryKey: ["cars-home"] });
      qc.invalidateQueries({ queryKey: ["cars-all"] });
      if (!isEdit) nav({ to: "/admin/mobil/$carId", params: { carId: id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleUpload(files: FileList | null) {
    if (!files || !carId) return;
    const arr = Array.from(files);
    for (const file of arr) {
      const path = `${carId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("car-images").upload(path, file);
      if (upErr) { toast.error(upErr.message); continue; }
      const { data: pub } = supabase.storage.from("car-images").getPublicUrl(path);
      const { error: insErr } = await supabase.from("car_images").insert({
        car_id: carId,
        url: pub.publicUrl,
        storage_path: path,
        is_primary: images.length === 0,
        sort_order: images.length,
      });
      if (insErr) toast.error(insErr.message);
    }
    qc.invalidateQueries({ queryKey: ["car-images", carId] });
    toast.success("Foto diupload");
  }

  async function deleteImage(id: string, path: string | null) {
    if (path) await supabase.storage.from("car-images").remove([path]);
    await supabase.from("car_images").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["car-images", carId] });
  }

  async function setPrimary(id: string) {
    if (!carId) return;
    await supabase.from("car_images").update({ is_primary: false }).eq("car_id", carId);
    await supabase.from("car_images").update({ is_primary: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["car-images", carId] });
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-lg font-bold">Informasi Mobil</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div><Label>Merk</Label><Input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
          <div><Label>Model</Label><Input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
          <div><Label>Tahun</Label><Input required type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /></div>
          <div><Label>Warna</Label><Input required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
          <div><Label>Kilometer</Label><Input required type="number" value={form.mileage_km} onChange={(e) => setForm({ ...form, mileage_km: Number(e.target.value) })} /></div>
          <div><Label>Harga (Rp)</Label><Input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
          <div><Label>Mesin (cc)</Label><Input type="number" value={form.engine_cc ?? ""} onChange={(e) => setForm({ ...form, engine_cc: e.target.value ? Number(e.target.value) : null })} /></div>
          <div><Label>Plat Nomor</Label><Input value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} /></div>
          <div>
            <Label>Transmisi</Label>
            <Select value={form.transmission} onValueChange={(v) => setForm({ ...form, transmission: v as FormState["transmission"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="cvt">CVT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Bahan Bakar</Label>
            <Select value={form.fuel} onValueChange={(v) => setForm({ ...form, fuel: v as FormState["fuel"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bensin">Bensin</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="listrik">Listrik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Kondisi</Label>
            <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v as FormState["condition"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sangat_baik">Sangat Baik</SelectItem>
                <SelectItem value="baik">Baik</SelectItem>
                <SelectItem value="cukup">Cukup</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as FormState["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tersedia">Tersedia</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="terjual">Terjual</SelectItem>
                <SelectItem value="dihapus">Dihapus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4"><Label>Deskripsi</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="mt-4"><Label>Riwayat Servis / Kondisi</Label><Textarea rows={3} value={form.service_history} onChange={(e) => setForm({ ...form, service_history: e.target.value })} /></div>
      </div>

      {isEdit && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-lg font-bold">Foto Mobil</h2>
          <p className="text-sm text-muted-foreground">Upload satu atau beberapa foto. Klik bintang untuk jadikan foto utama.</p>
          <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-6 text-sm hover:bg-secondary">
            <Upload className="h-4 w-4" /> Pilih foto (multi-select)
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
          </label>
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-lg border border-border">
                  <img src={img.url} alt="" className="aspect-square w-full object-cover" />
                  {img.is_primary && <span className="absolute left-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">Utama</span>}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                    {!img.is_primary && <Button type="button" size="icon" variant="secondary" onClick={() => setPrimary(img.id)}><Star className="h-4 w-4" /></Button>}
                    <Button type="button" size="icon" variant="destructive" onClick={() => deleteImage(img.id, img.storage_path)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => nav({ to: "/admin/mobil" })}>Batal</Button>
        <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEdit ? "Simpan Perubahan" : "Tambah Mobil"}</Button>
      </div>
    </form>
  );
}