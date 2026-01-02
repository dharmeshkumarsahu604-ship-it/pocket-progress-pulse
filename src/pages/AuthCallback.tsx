import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          toast({
            title: "Email confirmation failed",
            description: "The confirmation link is invalid or has expired.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (data.session) {
          toast({
            title: "Email confirmed!",
            description: "Your account has been verified successfully.",
          });
          navigate('/');
        } else {
          navigate('/auth');
        }
      } catch (err) {
        toast({
          title: "Email confirmation failed",
          description: "The confirmation link is invalid or has expired.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate]);

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
