import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { validateCPF } from '@/lib/validators';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithSocial: (provider: 'google' | 'facebook' | 'apple') => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    password: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um usuário salvo no localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    // Verifica a sessão do Supabase
    checkSession();
    setLoading(false);

    // Inscreve-se para mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        localStorage.setItem('token', session.access_token);
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    password: string;
  }) => {
    try {
      // Valida o CPF
      if (!validateCPF(data.cpf.replace(/\D/g, ''))) {
        throw new Error('CPF inválido');
      }

      // Registra o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            cpf: data.cpf.replace(/\D/g, ''),
            phone: data.phone,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // O trigger criado na migration irá criar automaticamente o registro na tabela patients
      // Aguarda um momento para garantir que o trigger foi executado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Busca os dados do paciente recém criado
      const { data: userData, error: userError } = await supabase
        .from('patients')
        .select('*')
        .eq('auth_id', authData.user.id)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('Erro ao criar perfil do usuário');

      // Se tudo deu certo e temos uma sessão, atualiza o estado
      if (authData.session) {
        setToken(authData.session.access_token);
        setUser(userData);
        localStorage.setItem('token', authData.session.access_token);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      let email = identifier;
      
      // Se for CPF, busca o email associado
      if (validateCPF(identifier.replace(/\D/g, ''))) {
        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .select('email')
          .eq('cpf', identifier.replace(/\D/g, ''))
          .single();
          
        if (patientError) throw new Error('CPF não encontrado');
        if (!patient?.email) throw new Error('Email não encontrado para este CPF');
        
        email = patient.email;
      } 
      // Se for nome de usuário, busca o email associado
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();
          
        if (profileError) throw new Error('Nome de usuário não encontrado');
        if (!profile?.email) throw new Error('Email não encontrado para este usuário');
        
        email = profile.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message === 'Invalid login credentials' 
        ? 'Credenciais inválidas'
        : error.message || 'Erro ao fazer login');
    }
  };

  const loginWithSocial = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Erro no login social:', error);
      throw new Error(error.message || 'Erro ao fazer login com rede social');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      throw new Error(error.message || 'Erro ao fazer logout');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    loginWithSocial,
    logout,
    register,
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