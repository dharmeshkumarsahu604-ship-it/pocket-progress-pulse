-- Schedule the daily facts cron job to run every hour
-- It will check for users whose preferred notification time matches the current hour
SELECT cron.schedule(
  'send-daily-geology-facts',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://gknkwiwfwzjfcijjrlac.supabase.co/functions/v1/send-daily-facts',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrbmt3aXdmd3pqZmNpampybGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjg0MzUsImV4cCI6MjA3NTc0NDQzNX0.rqKYFA6FH4TwTrO3FlHxS039aSp8-zXs2N_HToQVVqY"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);