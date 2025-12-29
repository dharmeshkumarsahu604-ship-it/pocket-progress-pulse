import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: string, institute?: string, phoneNumber?: string, avatarFile?: File) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Auto-refresh session when user returns to the app
  useEffect(() => {
    const refreshSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error || !currentSession) {
          console.log('Session refresh needed');
          // Try to refresh the session
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (!refreshError && refreshedSession) {
            setSession(refreshedSession);
            setUser(refreshedSession.user);
            console.log('Session refreshed successfully');
          } else if (refreshError) {
            console.error('Session refresh failed:', refreshError);
            // If refresh fails, sign out the user
            await signOut();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        // Refresh session when user returns to the tab
        refreshSession();
      }
    };

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up periodic refresh (every 30 minutes)
    const refreshInterval = setInterval(() => {
      if (user && document.visibilityState === 'visible') {
        refreshSession();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, [user]);

  const signUp = async (email: string, password: string, fullName: string, role: string, institute?: string, phoneNumber?: string, avatarFile?: File) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    // First, create the user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
          institute: institute,
          phone_number: phoneNumber,
        },
      },
    });

    // If signup successful, send confirmation email via Resend
    if (!error && data.user) {
      try {
        // Send welcome/confirmation email via our edge function
        const emailResponse = await supabase.functions.invoke('send-confirmation-email', {
          body: {
            email,
            name: fullName,
            type: 'signup',
            confirmationUrl: `${window.location.origin}/auth?confirmed=true`,
          },
        });
        
        if (emailResponse.error) {
          console.error('Failed to send confirmation email:', emailResponse.error);
        } else {
          console.log('Confirmation email sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    // If signup successful and avatar file provided, upload it
    if (!error && avatarFile && data.user) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${data.user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          upsert: true,
        });

      if (!uploadError) {
        // Get public URL and update profile
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        // Update profile with avatar URL
        await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', data.user.id);
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
