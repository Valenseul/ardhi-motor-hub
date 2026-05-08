import { Link } from "@tanstack/react-router";
import { Calendar, Fuel, Gauge, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatIDR, formatKm, SHOWROOM, waLink } from "@/lib/showroom";

export type CarCardData = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage_km: number;
  transmission: string;
  fuel: string;
  status: string;
  primaryImage?: string | null;
};

export function CarCard({ car }: { car: CarCardData }) {
  const title = `${car.brand} ${car.model} ${car.year}`;
  const msg = `Halo ${SHOWROOM.name}, saya tertarik dengan ${title} (harga ${formatIDR(car.price)}). Apakah masih tersedia?`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <Link to="/mobil/$carId" params={{ carId: car.id }} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {car.primaryImage ? (
          <img
            src={car.primaryImage}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground text-sm">No image</div>
        )}
        {car.status !== "tersedia" && (
          <Badge className="absolute left-3 top-3 capitalize" variant={car.status === "terjual" ? "destructive" : "secondary"}>
            {car.status}
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold leading-tight">
          <Link to="/mobil/$carId" params={{ carId: car.id }} className="hover:text-primary">{title}</Link>
        </h3>
        <p className="mt-1 text-lg font-bold text-primary">{formatIDR(car.price)}</p>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{car.year}</li>
          <li className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" />{formatKm(car.mileage_km)}</li>
          <li className="flex items-center gap-1.5 capitalize"><Settings2 className="h-3.5 w-3.5" />{car.transmission}</li>
          <li className="flex items-center gap-1.5 capitalize"><Fuel className="h-3.5 w-3.5" />{car.fuel}</li>
        </ul>
        <div className="mt-4 flex gap-2">
          <Link to="/mobil/$carId" params={{ carId: car.id }} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">Detail</Button>
          </Link>
          <a href={waLink(msg)} target="_blank" rel="noreferrer" className="flex-1">
            <Button size="sm" className="w-full bg-[var(--whatsapp)] text-[var(--whatsapp-foreground)] hover:opacity-90">
              WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
}
