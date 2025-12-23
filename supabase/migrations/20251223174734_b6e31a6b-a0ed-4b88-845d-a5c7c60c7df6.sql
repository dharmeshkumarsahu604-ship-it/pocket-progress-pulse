-- Add UPDATE policy for scan_history - users can update their own scans
CREATE POLICY "Users can update their own scan history"
ON public.scan_history
FOR UPDATE
USING (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND auth.uid() = user_id
)
WITH CHECK (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND auth.uid() = user_id
);