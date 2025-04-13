import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/LoadingScreen';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erro na autenticação:', error.message);
        navigate('/', { replace: true });
        return;
      }

      if (session) {
        // Busca dados do usuário
        const { data: userData, error: userError } = await supabase
          .from('patients')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (!userError && userData) {
          localStorage.setItem('token', session.access_token);
          localStorage.setItem('user', JSON.stringify(userData));
        }

        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <LoadingScreen />;
} 