-- Add DELETE policy for field_trip_progress table
-- Allows users to delete their own progress records (GDPR compliance)
CREATE POLICY "Users can delete their own progress"
ON field_trip_progress FOR DELETE
USING (auth.uid() = user_id);