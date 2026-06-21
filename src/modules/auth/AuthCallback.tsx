// src/modules/auth/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse the URL hash to get OAuth parameters
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
          // OAuth callback with access token - let Supabase handle the session
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            throw error;
          }

          if (data.user) {
            // Successfully authenticated, redirect to app
            navigate('/app/dashboard', { replace: true });
          } else {
            // No user found, redirect to login
            navigate('/signin', { replace: true });
          }
        } else {
          // No access token in URL, redirect to login
          navigate('/signin', { replace: true });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao processar autenticação');
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-500 text-sm">Redirecionando para a página de login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] p-4">
      <LoadingSpinner size="xl" />
    </div>
  );
};
