export const SHOWROOM = {
  name: "Ardhi Motor",
  tagline: "Mobil Bekas Berkualitas, Siap Pakai",
  address:
    "Jl. Jasa Warga No.1 Sugutamu, Bakti Jaya, Sukma Jaya, Depok",
  phone: "081283000297",
  phone2: "(021) 94505407",
  whatsapp: "6281283000297", 
  // Koordinat Sukmajaya, Depok (perkiraan area Jasa Warga)
  mapLat: -6.3812,
  mapLng: 106.834,
  mapEmbed:
    "https://www.google.com/maps?q=Jl.+Jasa+Warga+No.1+Sugutamu+Bakti+Jaya+Sukma+Jaya+Depok&output=embed",
  benefits: [
    "Kredit (garansi 1 tahun)",
    "Cash (garansi 4 hari)",
    "Jaminan Laka & Banjir",
    "Include Auto Detailing & Coating",
    "Sudah siap pakai",
    "Pajak Hidup",
  ],
  leasing: [
    "Clipan Finance",
    "SMS Finance",
    "Hana Finance",
    "CSUL Finance",
    "Balimor Finance",
    "MUF Finance",
    "CIMB Niaga Finance",
  ],
};

export function waLink(message: string) {
  return `https://wa.me/${SHOWROOM.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatKm(n: number) {
  return new Intl.NumberFormat("id-ID").format(n) + " km";
}
