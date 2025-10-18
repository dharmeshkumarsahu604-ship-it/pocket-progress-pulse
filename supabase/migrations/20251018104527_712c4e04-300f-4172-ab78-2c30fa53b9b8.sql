-- Add RLS policies for pois table
CREATE POLICY "Users can view all pois"
  ON public.pois
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own pois"
  ON public.pois
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own pois"
  ON public.pois
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own pois"
  ON public.pois
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);