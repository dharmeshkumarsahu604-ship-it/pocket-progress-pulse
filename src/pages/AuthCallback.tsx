import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
