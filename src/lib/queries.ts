import { supabase } from "@/integrations/supabase/client";

export type CarRow = {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  mileage_km: number;
  price: number;
  condition: string;
  transmission: string;
  fuel: string;
  engine_cc: number | null;
  plate_number: string | null;
  description: string | null;
  service_history: string | null;
  status: string;
  sold_at: string | null;
  created_at: string;
};

export type CarImage = {
  id: string;
  car_id: string;
  url: string;
  storage_path: string | null;
  sort_order: number;
  is_primary: boolean;
};

export async function fetchCarsWithPrimaryImage(): Promise<(CarRow & { primaryImage: string | null })[]> {
  const { data: cars, error } = await supabase.from("cars").select("*").neq("status", "dihapus").order("created_at", { ascending: false });
  if (error) throw error;
  if (!cars || cars.length === 0) return [];
  const ids = cars.map((c) => c.id);
  const { data: imgs } = await supabase.from("car_images").select("car_id, url, is_primary, sort_order").in("car_id", ids).order("is_primary", { ascending: false }).order("sort_order", { ascending: true });
  const map = new Map<string, string>();
  imgs?.forEach((i) => { if (!map.has(i.car_id)) map.set(i.car_id, i.url); });
  return cars.map((c) => ({ ...c, primaryImage: map.get(c.id) ?? null }));
}

export async function fetchCar(id: string) {
  const { data, error } = await supabase.from("cars").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchCarImages(carId: string) {
  const { data, error } = await supabase.from("car_images").select("id, car_id, url, storage_path, sort_order, is_primary").eq("car_id", carId).order("is_primary", { ascending: false }).order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchTestimonials() {
  const { data, error } = await supabase.from("testimonials").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(6);
  if (error) throw error;
  return data ?? [];
}