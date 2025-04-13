import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithSocial: (provider: 'google' | 'facebook' | 'apple') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const userData = session?.user;
        const accessToken = session?.access_token;
        if (userData && accessToken) {
          setUser(userData);
          setToken(accessToken);
          setIsAuthenticated(true);
          localStorage.setItem('token', accessToken);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const validateIdentifier = (identifier: string): 'cpf' | 'email' | 'username' => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    const cpfRegex = /^\d{11}$/;

    if (emailRegex.test(identifier)) return 'email';
    if (usernameRegex.test(identifier)) return 'username';
    if (cpfRegex.test(identifier.replace(/\D/g, ''))) return 'cpf';
    throw new Error('Identificador inválido');
  };

  const login = async (identifier: string, password: string) => {
    const identifierType = validateIdentifier(identifier);
    let emailToUse = identifier;

    if (identifierType === 'cpf') {
      const { data, error } = await supabase
        .from('patients')
        .select('email')
        .eq('cpf', identifier.replace(/\D/g, ''))
        .single();

      if (error || !data) throw new Error('CPF não encontrado');
      emailToUse = data.email;
    } else if (identifierType === 'username') {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();

      if (error || !data) throw new Error('Nome de usuário não encontrado');
      emailToUse = data.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (error) throw new Error('Credenciais inválidas');
    if (!data.session) throw new Error('Sessão não criada');

    setUser(data.user);
    setToken(data.session.access_token);
    setIsAuthenticated(true);
    localStorage.setItem('token', data.session.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Atualiza o user_id na tabela profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ user_id: data.user?.id })
      .eq('email', emailToUse);

    if (updateError) console.error('Erro ao atualizar user_id:', updateError);
  };

  const loginWithSocial = async (provider: 'google' | 'facebook' | 'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });

    if (error) throw new Error('Erro ao fazer login social: ' + error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error('Erro ao fazer logout: ' + error.message);

    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, loginWithSocial, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
