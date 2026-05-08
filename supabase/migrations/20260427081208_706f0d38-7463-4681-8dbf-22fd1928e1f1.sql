-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.car_status AS ENUM ('tersedia', 'terjual', 'reserved', 'dihapus');
CREATE TYPE public.car_condition AS ENUM ('sangat_baik', 'baik', 'cukup');
CREATE TYPE public.transmission_type AS ENUM ('manual', 'automatic', 'cvt');
CREATE TYPE public.fuel_type AS ENUM ('bensin', 'diesel', 'hybrid', 'listrik');

-- ============ user_roles ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ cars ============
CREATE TABLE public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  mileage_km INTEGER NOT NULL DEFAULT 0,
  price BIGINT NOT NULL,
  condition car_condition NOT NULL DEFAULT 'baik',
  transmission transmission_type NOT NULL DEFAULT 'manual',
  fuel fuel_type NOT NULL DEFAULT 'bensin',
  engine_cc INTEGER,
  plate_number TEXT,
  description TEXT,
  service_history TEXT,
  status car_status NOT NULL DEFAULT 'tersedia',
  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_cars_status ON public.cars(status);
CREATE INDEX idx_cars_brand ON public.cars(brand);
CREATE INDEX idx_cars_price ON public.cars(price);

CREATE POLICY "Public view non-deleted cars" ON public.cars
  FOR SELECT TO anon, authenticated
  USING (status <> 'dihapus');

CREATE POLICY "Admins manage cars" ON public.cars
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ car_images ============
CREATE TABLE public.car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_car_images_car ON public.car_images(car_id);

CREATE POLICY "Public view car images" ON public.car_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage car images" ON public.car_images
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ testimonials ============
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  car_label TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  avatar_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view published testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE POLICY "Admins manage testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ Storage bucket ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-photos', 'car-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read car photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'car-photos');

CREATE POLICY "Admins upload car photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'car-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update car photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'car-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete car photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'car-photos' AND public.has_role(auth.uid(), 'admin'));