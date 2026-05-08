-- Fix function search_path on touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Restrict EXECUTE on has_role: only postgres/service_role/authenticated checks via RLS
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO postgres, service_role;

-- Tighten public bucket listing: replace broad SELECT with per-object access (still public via signed URLs / direct URL)
DROP POLICY IF EXISTS "Public read car photos" ON storage.objects;

-- Public objects in 'car-photos' are accessed via direct public URL (CDN) which doesn't require RLS SELECT.
-- For app code that lists/queries objects, only admins can list.
CREATE POLICY "Admins list car photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'car-photos' AND public.has_role(auth.uid(), 'admin'));