import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        
        // Check for error in URL first (both hash and search params)
        const hashParams = new URLSearchParams(url.hash.substring(1));
        const searchParams = url.searchParams;
        
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
        const errorCode = hashParams.get('error') || searchParams.get('error');
        
        if (errorDescription || errorCode) {
          setError(decodeURIComponent(errorDescription || errorCode || 'Unknown error'));
          setIsProcessing(false);
          return;
        }

        // Method 1: Check for access_token and refresh_token in hash (implicit flow)
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (accessToken && refreshToken) {
          console.log('Processing hash tokens, type:', type);
          
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            setError('Failed to verify your email. Please try again.');
            setIsProcessing(false);
            return;
          }

          if (data.session) {
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname);
            
            toast({
              title: "Email confirmed!",
              description: "Your account has been verified. Welcome to Geo-Smart!",
            });
            
            navigate('/', { replace: true });
            return;
          }
        }

        // Method 2: Check for code in search params (PKCE flow)
        const code = searchParams.get('code');
        
        if (code) {
          console.log('Processing PKCE code');
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            setError('Failed to verify your email. The link may have expired.');
            setIsProcessing(false);
            return;
          }

          if (data.session) {
            toast({
              title: "Email confirmed!",
              description: "Your account has been verified. Welcome to Geo-Smart!",
            });
            
            navigate('/', { replace: true });
            return;
          }
        }

        // Method 3: Check for token_hash (email confirmation token)
        const tokenHash = searchParams.get('token_hash') || hashParams.get('token_hash');
        const tokenType = searchParams.get('type') || hashParams.get('type');
        
        if (tokenHash && tokenType) {
          console.log('Processing token hash, type:', tokenType);
          
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: tokenType as 'signup' | 'email' | 'recovery' | 'invite',
          });

          if (verifyError) {
            console.error('Token verification error:', verifyError);
            setError('Failed to verify your email. The link may have expired.');
            setIsProcessing(false);
            return;
          }

          if (data.session) {
            toast({
              title: "Email confirmed!",
              description: "Your account has been verified. Welcome to Geo-Smart!",
            });
            
            navigate('/', { replace: true });
            return;
          }
        }

        // Check if user is already authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          console.log('User already has a session');
          navigate('/', { replace: true });
          return;
        }

        // No valid tokens found
        console.log('No tokens found in URL');
        setError('Invalid or expired confirmation link. Please request a new one or try signing in.');
        setIsProcessing(false);
        
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred. Please try again.');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-xl font-semibold">Verification Issue</h1>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={() => navigate('/auth')} variant="default">
              Go to Sign In
            </Button>
            <Button 
              onClick={() => navigate('/auth?tab=signup')} 
              variant="outline"
            >
              Create New Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
