import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Camera, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import LanguageSelector from "@/components/LanguageSelector";
import LibrasToggle from "@/components/LibrasToggle";
import { validateCPF, validatePassword } from "@/lib/validators";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';

interface LoginError {
  field: 'identifier' | 'password' | 'general';
  message: string;
}

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidIdentifier, setIsValidIdentifier] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [identifierType, setIdentifierType] = useState<'cpf' | 'email' | 'username'>('cpf');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loginWithSocial, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) setError(null);
  }, [identifier, password]);

  const validateIdentifier = (value: string) => {
    const trimmedValue = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(trimmedValue);
    const cleanedCPF = trimmedValue.replace(/\D/g, '');
    const isValidCPF = validateCPF(cleanedCPF);
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    const isValidUsername = usernameRegex.test(trimmedValue);

    if (isEmail) {
      setIdentifierType('email');
    } else if (isValidCPF) {
      setIdentifierType('cpf');
    } else if (isValidUsername) {
      setIdentifierType('username');
    }

    const isValid = isEmail || isValidCPF || isValidUsername;
    setIsValidIdentifier(isValid);
    return isValid;
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);
    validateIdentifier(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValid(validatePassword(value));
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithSocial(provider);
      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando para o painel...",
        variant: "default",
      });
    } catch (error: any) {
      setError({
        field: 'general',
        message: error.message || "Erro ao fazer login com " + provider,
      });
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao fazer login com " + provider,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidIdentifier || !passwordValid) {
      setError({
        field: !isValidIdentifier ? 'identifier' : 'password',
        message: !isValidIdentifier 
          ? "Por favor, digite um CPF, email ou nome de usuário válido" 
          : "Senha deve ter pelo menos 8 caracteres, um número e uma letra"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(identifier, password);
      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando para o painel...",
        variant: "default",
      });
      await new Promise(resolve => setTimeout(resolve, 300));
      navigate("/dashboard", { 
        state: { animation: 'fade' },
        replace: true
      });
    } catch (error: any) {
      setLoginAttempts(prev => prev + 1);
      if (error.message === 'Invalid login credentials' && loginAttempts >= 2) {
        setError({
          field: 'general',
          message: "Muitas tentativas inválidas. Por favor, aguarde 5 minutos."
        });
      } else {
        setError({
          field: 'general',
          message: error.message || "Ocorreu um erro ao fazer login"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/recuperar-senha", { state: { identifier } });
  };

  const handleRegister = () => {
    navigate("/register", { state: { animation: 'fade' } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary to-white animate-fade-in">
      <Toaster position="top-right" />
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSelector />
      </div>

      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
            className="animate-fade-in"
          >
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
              Saúde Conectada
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Entre com CPF, email ou nome de usuário para acessar o sistema
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm md:text-base">
                {identifierType === 'cpf' ? "CPF" : identifierType === 'email' ? "Email" : "Nome de usuário"}
              </Label>
              <Input
                id="identifier"
                type={identifierType === 'email' ? "email" : "text"}
                placeholder={
                  identifierType === 'cpf' 
                    ? "000.000.000-00" 
                    : identifierType === 'email'
                    ? "seu@email.com"
                    : "seu_usuario"
                }
                value={identifier}
                onChange={handleIdentifierChange}
                className={`h-12 text-base ${
                  error?.field === 'identifier' || (!isValidIdentifier && identifier) 
                    ? "border-red-500 focus-visible:ring-red-500" 
                    : ""
                }`}
                aria-label={`Campo ${identifierType === 'cpf' ? "CPF" : identifierType === 'email' ? "Email" : "Nome de usuário"}`}
                aria-describedby={error?.field === 'identifier' ? "identifier-error" : undefined}
                aria-invalid={!isValidIdentifier && identifier !== ""}
              />
              {(error?.field === 'identifier' || (!isValidIdentifier && identifier)) && (
                <p 
                  className="text-red-500 text-sm md:text-base" 
                  id="identifier-error"
                  role="alert"
                >
                  {error?.field === 'identifier' 
                    ? error.message 
                    : `${identifierType === 'cpf' ? "CPF" : identifierType === 'email' ? "Email" : "Nome de usuário"} inválido`}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm md:text-base">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`h-12 text-base ${
                    error?.field === 'password' || (!passwordValid && password) 
                      ? "border-red-500 focus-visible:ring-red-500" 
                      : ""
                  }`}
                  aria-label="Campo Senha"
                  aria-describedby={error?.field === 'password' ? "password-error" : undefined}
                  aria-invalid={!passwordValid && password !== ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {(error?.field === 'password' || (!passwordValid && password)) && (
                <p 
                  className="text-red-500 text-sm md:text-base" 
                  id="password-error"
                  role="alert"
                >
                  {error?.field === 'password' 
                    ? error.message 
                    : "Senha deve ter pelo menos 8 caracteres, um número e uma letra"}
                </p>
              )}
            </div>

            {error?.field === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-md bg-red-50 border border-red-200"
              >
                <p className="text-red-600 text-sm" role="alert">
                  {error.message}
                </p>
              </motion.div>
            )}

            <motion.div whileTap={{ scale: 1.05 }}>
              <Button 
                type="submit" 
                className="w-full h-12 text-base md:text-lg font-bold rounded-lg hover:scale-105 transition-transform"
                disabled={!isValidIdentifier || !passwordValid || isLoading}
                aria-label={isLoading ? "Entrando..." : "Entrar no sistema"}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </motion.div>

            <div className="flex justify-between items-center">
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                onClick={handleForgotPassword}
                className="text-primary px-0 text-sm md:text-base"
                aria-label="Recuperar senha"
              >
                Esqueci minha senha
              </Button>

              <LibrasToggle />
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-border flex-grow" />
              <div className="px-4 text-sm md:text-base text-muted-foreground">ou</div>
              <div className="border-t border-border flex-grow" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                aria-label="Entrar com Google"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.68-2.3 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                aria-label="Entrar com Facebook"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.99 4.39 10.99 10.13 11.85v-8.38H7.06v-3.47h3.07V9.47c0-3.03 1.8-4.7 4.56-4.7 1.32 0 2.7.24 2.7.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.27h3.34l-.53 3.47h-2.81v8.38C19.61 22.99 24 17.99 24 12c0-6.63-5.37-12-12-12z" fill="#1877F2"/>
                </svg>
                <span>Facebook</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading}
                aria-label="Entrar com Apple"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.14 0c-1.31.98-2.31 2.34-2.08 3.92.24 1.58 1.55 2.82 2.86 3.24-.44-1.58-1.31-3.24-2.62-4.16zm-2.86 6.08c-2.62 0-4.16 1.58-5.24 3.16-1.08 1.58-1.55 3.92-1.31 6.08.24 2.16 1.55 4.74 3.92 5.24.24 0 .48 0 .72-.24 1.55-.48 2.86-1.31 4.16-2.62.72-.72 1.31-1.55 2.16-2.62-.48.24-.96.48-1.55.72-1.31.48-2.86 1.31-3.92 1.31-1.55 0-2.86-.96-3.92-2.16-1.08-1.31-1.55-3.24-1.55-5.24 0-2.16.48-4.16 1.55-5.24 1.08-1.31 2.86-2.16 4.74-2.16 1.55 0 3.24.48 4.74 1.31 1.31.72 2.62 1.55 3.92 2.16-.24-.96-.72-1.91-1.31-2.62-.72-.72-1.55-1.31-2.62-1.55-.96-.24-1.91-.24-2.86-.24z" fill="#000000"/>
                </svg>
                <span>Apple</span>
              </Button>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 h-12 text-sm md:text-base"
              onClick={handleRegister}
              aria-label="Cadastrar novo usuário com RG"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              <span>Cadastrar com RG</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
