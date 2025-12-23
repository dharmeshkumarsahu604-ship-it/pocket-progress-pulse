-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate with explicit authentication checks on all policies
CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid() = id
);

CREATE POLICY "Authenticated users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid() = id
);

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.role() = 'authenticated' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid() = id
)
WITH CHECK (
  auth.role() = 'authenticated' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid() = id
);