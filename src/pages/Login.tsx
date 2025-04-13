import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MaskedInput from "@/components/MaskedInput";
import LanguageSelector from "@/components/LanguageSelector";
import LibrasToggle from "@/components/LibrasToggle";
import { validateCPF, validatePassword } from "@/lib/validators";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cpfValid, setCpfValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCpfChange = (value: string, isValid: boolean) => {
    setCpf(value);
    setCpfValid(isValid);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValid(validatePassword(value));
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cpfValid || !passwordValid) {
      toast({
        title: "Erro de validação",
        description: "Por favor, verifique os campos e tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    // For demo purposes, we'll just navigate to the dashboard
    toast({
      title: "Login realizado",
      description: "Você será redirecionado para o painel.",
    });
    
    navigate("/dashboard");
  };
  
  const handleForgotPassword = () => {
    toast({
      title: "Recuperação de senha",
      description: "Instruções foram enviadas para seu e-mail.",
    });
  };
  
  const handleRegister = () => {
    navigate("/register");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary to-white animate-fade-in">
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
            <CardTitle className="text-2xl font-bold text-primary">Saúde Conectada</CardTitle>
            <CardDescription>
              Entre com seu CPF e senha para acessar o sistema
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <MaskedInput
                id="cpf"
                placeholder="000.000.000-00"
                mask="cpf"
                onValueChange={handleCpfChange}
                validator={validateCPF}
                errorMessage="CPF inválido"
                aria-label="Campo CPF"
                aria-describedby="cpf-error"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={handlePasswordChange}
                  className={!passwordValid && password ? "border-red-500" : ""}
                  aria-label="Campo Senha"
                  aria-describedby="password-error"
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
              {!passwordValid && password && (
                <p className="text-red-500 text-sm" id="password-error">
                  Senha deve ter pelo menos 8 caracteres, um número e uma letra
                </p>
              )}
            </div>
            
            <motion.div whileTap={{ scale: 1.05 }}>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold rounded-lg hover:scale-105 transition-transform"
                disabled={!cpfValid || !passwordValid}
                aria-label="Botão Entrar"
              >
                Entrar
              </Button>
            </motion.div>
            
            <div className="flex justify-between items-center">
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                onClick={handleForgotPassword}
                className="text-primary px-0"
                aria-label="Esqueci minha senha"
              >
                Esqueci minha senha
              </Button>
              
              <LibrasToggle />
            </div>
            
            <div className="relative flex items-center justify-center">
              <div className="border-t border-border flex-grow" />
              <div className="px-4 text-sm text-muted-foreground">ou</div>
              <div className="border-t border-border flex-grow" />
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 h-12"
              onClick={handleRegister}
              aria-label="Cadastrar com RG"
            >
              <Camera className="h-4 w-4" />
              <span>Cadastrar com RG</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
