import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash fragment from the URL (Supabase sends tokens in hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const errorDescription = hashParams.get('error_description');

        // Check for error in URL
        if (errorDescription) {
          setError(decodeURIComponent(errorDescription));
          return;
        }

        // If we have tokens in the hash, set the session
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setError('Failed to verify your email. Please try again.');
            return;
          }

          // Success - show toast and redirect
          toast({
            title: "Email confirmed!",
            description: "Your account has been verified successfully.",
          });
          
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);
          
          navigate('/', { replace: true });
          return;
        }

        // Check URL search params for code-based flow
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            setError('Failed to verify your email. The link may have expired.');
            return;
          }

          toast({
            title: "Email confirmed!",
            description: "Your account has been verified successfully.",
          });
          
          navigate('/', { replace: true });
          return;
        }

        // No tokens or code found - check if already authenticated
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          navigate('/', { replace: true });
        } else {
          setError('Invalid confirmation link. Please request a new one.');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-xl font-semibold">Verification Failed</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
