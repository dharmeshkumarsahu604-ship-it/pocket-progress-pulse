-- Add write policies for rocks table - only lecturers and professionals can modify

CREATE POLICY "Lecturers and professionals can insert rocks"
ON public.rocks
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'lecturer')
    OR public.has_role(auth.uid(), 'professional')
  )
);

CREATE POLICY "Lecturers and professionals can update rocks"
ON public.rocks
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

CREATE POLICY "Lecturers and professionals can delete rocks"
ON public.rocks
FOR DELETE
USING (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'lecturer')
    OR public.has_role(auth.uid(), 'professional')
  )
);

-- Add write policies for minerals table - only lecturers and professionals can modify

CREATE POLICY "Lecturers and professionals can insert minerals"
ON public.minerals
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'lecturer')
    OR public.has_role(auth.uid(), 'professional')
  )
);

CREATE POLICY "Lecturers and professionals can update minerals"
ON public.minerals
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

CREATE POLICY "Lecturers and professionals can delete minerals"
ON public.minerals
FOR DELETE
USING (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'lecturer')
    OR public.has_role(auth.uid(), 'professional')
  )
);