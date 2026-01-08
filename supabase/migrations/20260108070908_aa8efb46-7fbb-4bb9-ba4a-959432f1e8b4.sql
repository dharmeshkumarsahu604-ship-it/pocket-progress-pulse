-- Add phone_number column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text;

-- Drop existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function to handle new user signup with all fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Insert profile with all user metadata
  INSERT INTO public.profiles (id, full_name, institute, phone_number, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'institute',
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Determine role from metadata, default to 'student'
  user_role := COALESCE(
    (new.raw_user_meta_data ->> 'role')::app_role,
    'student'::app_role
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role);
  
  RETURN new;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();