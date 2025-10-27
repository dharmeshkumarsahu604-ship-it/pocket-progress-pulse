-- Fix search_path for all public functions to prevent security vulnerabilities
-- This addresses the "Function Search Path Mutable" security warning

-- Fix handle_new_user function (with CASCADE to handle trigger dependency)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, institute)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'institute'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student')
  );
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix update_updated_at_column function (may have trigger dependencies)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix search_rocks function
CREATE OR REPLACE FUNCTION public.search_rocks(
  search_query text DEFAULT NULL,
  rock_type text DEFAULT NULL,
  min_hardness numeric DEFAULT NULL,
  max_hardness numeric DEFAULT NULL
)
RETURNS SETOF rocks
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT *
  FROM public.rocks
  WHERE 
    (search_query IS NULL OR name ILIKE '%' || search_query || '%' OR description ILIKE '%' || search_query || '%')
    AND (rock_type IS NULL OR type = rock_type)
    AND (min_hardness IS NULL OR hardness >= min_hardness)
    AND (max_hardness IS NULL OR hardness <= max_hardness)
  ORDER BY name
$$;

-- Fix search_minerals function
CREATE OR REPLACE FUNCTION public.search_minerals(
  search_query text DEFAULT NULL,
  min_hardness numeric DEFAULT NULL,
  max_hardness numeric DEFAULT NULL
)
RETURNS SETOF minerals
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT *
  FROM public.minerals
  WHERE 
    (search_query IS NULL OR name ILIKE '%' || search_query || '%' OR description ILIKE '%' || search_query || '%')
    AND (min_hardness IS NULL OR hardness >= min_hardness)
    AND (max_hardness IS NULL OR hardness <= max_hardness)
  ORDER BY name
$$;

-- Fix has_role function (already has search_path set correctly)
-- No changes needed, already properly configured

-- Fix get_user_role function (already has search_path set correctly)  
-- No changes needed, already properly configured

-- Fix get_user_stats function
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid uuid)
RETURNS TABLE (
  total_scans bigint,
  total_field_notes bigint,
  total_voice_notes bigint,
  total_bookmarks bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.scan_history WHERE user_id = user_uuid),
    (SELECT COUNT(*) FROM public.field_notes WHERE user_id = user_uuid),
    (SELECT COUNT(*) FROM public.voice_notes WHERE user_id = user_uuid),
    (SELECT COUNT(*) FROM public.collections WHERE user_id = user_uuid)
$$;