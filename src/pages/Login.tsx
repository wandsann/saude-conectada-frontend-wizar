import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Camera, Loader2, Mail, Github } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MaskedInput from "@/components/MaskedInput";
import LanguageSelector from "@/components/LanguageSelector";
import LibrasToggle from "@/components/LibrasToggle";
import { validateCPF, validatePassword } from "@/lib/validators";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

interface LoginError {
  field: 'identifier' | 'password' | 'general';
  message: string;
}

// Adicione os ícones do Facebook e Apple
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z"/>
    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43z"/>
  </svg>
);

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
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
  }, [formData.identifier, formData.password]);
  
  const validateIdentifier = (value: string) => {
    // Remove espaços em branco
    const trimmedValue = value.trim();
    
    // Verifica se é um email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(trimmedValue);
    
    // Verifica se é um CPF válido
    const cleanedCPF = trimmedValue.replace(/\D/g, '');
    const isValidCPF = validateCPF(cleanedCPF);
    
    // Verifica se é um nome de usuário válido (mínimo 3 caracteres, apenas letras, números e underscores)
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    const isValidUsername = usernameRegex.test(trimmedValue);
    
    // Atualiza o tipo de identificador
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'identifier') {
      validateIdentifier(value);
    } else if (name === 'password') {
      setPasswordValid(validatePassword(value));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidIdentifier || !passwordValid) {
      setError({
        field: !isValidIdentifier ? 'identifier' : 'password',
        message: !isValidIdentifier 
          ? "Por favor, digite um CPF, email ou nome de usuário válido" 
          : "Senha deve ter pelo menos 8 caracteres, um número e uma letra"
      });
      setLoading(false);
      return;
    }

    setError(null);
    
    try {
      await login(formData.identifier, formData.password);
      
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso"
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
      setLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await loginWithSocial(provider);
    } catch (error: any) {
      toast.error(error.message || `Erro ao fazer login com ${provider}`);
    }
  };
  
  const handleForgotPassword = () => {
    navigate("/recuperar-senha", { state: { identifier: formData.identifier } });
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
              Faça login para acessar sua conta
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm md:text-base">
                {identifierType === 'cpf' ? "CPF" : identifierType === 'email' ? "Email" : "Nome de usuário"}
              </Label>
              <Input
                id="identifier"
                name="identifier"
                type={identifierType === 'email' ? "email" : "text"}
                placeholder={
                  identifierType === 'cpf' 
                    ? "000.000.000-00" 
                    : identifierType === 'email'
                    ? "seu@email.com"
                    : "seu_usuario"
                }
                value={formData.identifier}
                onChange={handleChange}
                className={`h-12 text-base ${
                  error?.field === 'identifier' || (!isValidIdentifier && formData.identifier) 
                    ? "border-red-500 focus-visible:ring-red-500" 
                    : ""
                }`}
                aria-label={`Campo ${identifierType === 'cpf' ? "CPF" : identifierType === 'email' ? "Email" : "Nome de usuário"}`}
                aria-describedby={error?.field === 'identifier' ? "identifier-error" : undefined}
                aria-invalid={!isValidIdentifier && formData.identifier !== ""}
              />
              {(error?.field === 'identifier' || (!isValidIdentifier && formData.identifier)) && (
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
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-12 text-base ${
                    error?.field === 'password' || (!passwordValid && formData.password) 
                      ? "border-red-500 focus-visible:ring-red-500" 
                      : ""
                  }`}
                  aria-label="Campo Senha"
                  aria-describedby={error?.field === 'password' ? "password-error" : undefined}
                  aria-invalid={!passwordValid && formData.password !== ""}
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
              {(error?.field === 'password' || (!passwordValid && formData.password)) && (
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
              >
                <Mail className="h-4 w-4" />
                <span>Google</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin('facebook')}
              >
                <FacebookIcon />
                <span>Facebook</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin('apple')}
              >
                <AppleIcon />
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
