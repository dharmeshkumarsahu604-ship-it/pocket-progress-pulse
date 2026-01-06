import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const getSessionFromURL = async () => {
      try {
        // Let Supabase automatically handle the URL tokens
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          // Error or no session - redirect to signin
          navigate('/auth', { replace: true });
          return;
        }

        // Success - redirect to dashboard
        navigate('/', { replace: true });
      } catch {
        // Any error - redirect to signin
        navigate('/auth', { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    getSessionFromURL();
  }, [navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          </div>
          <p className="text-muted-foreground animate-pulse">Verifying...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
