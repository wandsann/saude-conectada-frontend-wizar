import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { validateCPF } from '@/lib/validators';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithSocial: (provider: 'google' | 'facebook' | 'apple') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw new Error('Erro ao verificar sessão: ' + error.message);

        if (session) {
          setToken(session.access_token);
          localStorage.setItem('token', session.access_token);

          const identifier = session.user?.email?.split('@')[0];
          const { data: userData, error: userError } = await supabase
            .from('patients')
            .select('*')
            .or(`cpf.eq.${identifier},email.eq.${session.user?.email}`)
            .single();

          if (userError) throw new Error('Erro ao buscar dados do usuário: ' + userError.message);

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }

        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session) {
            setToken(session.access_token);
            localStorage.setItem('token', session.access_token);

            const identifier = session.user?.email?.split('@')[0];
            const { data: userData, error: userError } = await supabase
              .from('patients')
              .select('*')
              .or(`cpf.eq.${identifier},email.eq.${session.user?.email}`)
              .single();

            if (userError) {
              console.error('Erro ao buscar dados do usuário:', userError.message);
              setUser(null);
              setToken(null);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              return;
            }

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        });
      } catch (error: any) {
        console.error(error.message);
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      let email = identifier;

      const isCPF = validateCPF(identifier.replace(/\D/g, ''));
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(identifier);
      const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
      const isUsername = usernameRegex.test(identifier);

      if (isCPF) {
        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .select('email')
          .eq('cpf', identifier.replace(/\D/g, ''))
          .single();

        if (patientError) throw new Error('CPF não encontrado');
        if (!patient?.email) throw new Error('Email não encontrado para este CPF');
        email = patient.email;
      } else if (!isEmail && isUsername) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();

        if (profileError) throw new Error('Nome de usuário não encontrado');
        if (!profile?.email) throw new Error('Email não encontrado para este usuário');
        email = profile.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message === 'Invalid login credentials' 
        ? 'Credenciais inválidas'
        : error.message || 'Erro ao fazer login');

      const { data: userData, error: userError } = await supabase
        .from('patients')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) throw new Error(userError.message || 'Erro ao buscar dados do usuário');

      setToken(data.session?.access_token || null);
      setUser(userData);
      localStorage.setItem('token', data.session?.access_token || '');
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login');
    }
  };

  const loginWithSocial = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });

      if (error) throw new Error(error.message || 'Erro ao fazer login com ' + provider);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login com ' + provider);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    loginWithSocial,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
