import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { validateCPF, validatePassword } from "@/lib/validators";

export default function Register() {
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Valida CPF e senha
    if (!validateCPF(cpf.replace(/\D/g, ""))) {
      setError("CPF inválido");
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setError("Senha deve ter pelo menos 8 caracteres, um número e uma letra");
      setLoading(false);
      return;
    }

    // Registra o usuário no Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      toast({
        title: "Erro ao cadastrar",
        description: authError.message,
        variant: "destructive",
      });
      return;
    }

    // Insere o usuário nas tabelas patients e profiles
    const { error: patientError } = await supabase
      .from("patients")
      .insert({ cpf: cpf.replace(/\D/g, ""), email });

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ username, email });

    setLoading(false);

    if (patientError || profileError) {
      setError(patientError?.message || profileError?.message || "Erro ao salvar dados");
      toast({
        title: "Erro ao salvar dados",
        description: patientError?.message || profileError?.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cadastro realizado",
      description: "Você foi cadastrado com sucesso! Faça login para continuar.",
    });
    setTimeout(() => navigate("/"), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
