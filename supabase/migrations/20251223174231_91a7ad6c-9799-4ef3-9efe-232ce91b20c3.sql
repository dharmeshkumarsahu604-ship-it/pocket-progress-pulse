-- Add write policies for geological_sites - only lecturers and professionals can modify

CREATE POLICY "Lecturers and professionals can insert geological sites"
ON public.geological_sites
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'lecturer')
    OR public.has_role(auth.uid(), 'professional')
  )
);

CREATE POLICY "Lecturers and professionals can update geological sites"
ON public.geological_sites
FOR UPDATE
USING (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'lecturer')
    OR public.has_role(auth.uid(), 'professional')
  )
)
WITH CHECK (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'lecturer')
    OR public.has_role(auth.uid(), 'professional')
  )
);

CREATE POLICY "Lecturers and professionals can delete geological sites"
ON public.geological_sites
FOR DELETE
USING (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'lecturer')
    OR public.has_role(auth.uid(), 'professional')
  )
);