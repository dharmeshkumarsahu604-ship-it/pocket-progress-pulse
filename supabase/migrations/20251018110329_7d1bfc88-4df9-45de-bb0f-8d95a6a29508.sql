-- Fix critical security issue: Restrict profiles table access
-- Users should only see their own profile

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view basic info of other profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new restrictive policy - users can only view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Fix remaining search_path issues for security
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

DROP FUNCTION IF EXISTS public.get_user_role(uuid);
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1;
$$;

DROP FUNCTION IF EXISTS public.get_user_stats(uuid);
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid uuid)
RETURNS TABLE(
  total_scans bigint,
  total_field_notes bigint,
  total_voice_notes bigint,
  total_bookmarks bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.scan_history WHERE user_id = user_uuid),
    (SELECT COUNT(*) FROM public.field_notes WHERE user_id = user_uuid),
    (SELECT COUNT(*) FROM public.voice_notes WHERE user_id = user_uuid),
    (SELECT COUNT(*) FROM public.collections WHERE user_id = user_uuid);
$$;