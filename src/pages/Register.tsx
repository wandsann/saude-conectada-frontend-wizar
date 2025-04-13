
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MaskedInput from "@/components/MaskedInput";
import LibrasToggle from "@/components/LibrasToggle";
import LanguageSelector from "@/components/LanguageSelector";

export default function Register() {
  const [cameraActive, setCameraActive] = useState(false);
  const [dataDetected, setDataDetected] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    birthDate: "",
    phone: "",
    email: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const activateCamera = () => {
    setCameraActive(true);
    
    // Simulate RG detection after 2 seconds
    setTimeout(() => {
      setDataDetected(true);
      setFormData({
        name: "Maria Silva",
        cpf: "123.456.789-00",
        birthDate: "1985-06-15",
        phone: "(11) 98765-4321",
        email: "maria.silva@exemplo.com",
      });
      
      toast({
        title: "RG detectado",
        description: "Dados extraídos com sucesso! Verifique as informações.",
      });
    }, 2000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Cadastro realizado",
      description: "Seu cadastro foi concluído com sucesso!",
    });
    
    navigate("/symptoms");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-primary p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
        <h1 className="text-xl font-bold text-white">Cadastro via RG</h1>
        <div className="ml-auto">
          <LanguageSelector />
        </div>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader>
            <CardTitle>Cadastro rápido</CardTitle>
            <CardDescription>
              Aponte a câmera para o seu RG para preencher automaticamente
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!cameraActive ? (
              <div className="space-y-4">
                <Button 
                  onClick={activateCamera} 
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  <Camera className="h-5 w-5" />
                  <span>Ativar câmera</span>
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>Ou preencha seus dados manualmente</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <MaskedInput
                      id="cpf"
                      mask="cpf"
                      value={formData.cpf}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, cpf: value }))}
                      errorMessage="CPF inválido"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de nascimento</Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <MaskedInput
                      id="phone"
                      mask="phone"
                      value={formData.phone}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                      errorMessage="Telefone inválido"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail (opcional)</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Concordo com os termos de uso e política de privacidade
                    </Label>
                  </div>
                  
                  <div className="pt-2 flex items-center justify-between">
                    <LibrasToggle />
                    <Button type="submit" disabled={!termsAccepted}>
                      Finalizar
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {!dataDetected ? (
                  <div className="bg-gray-100 border-4 border-primary rounded-lg overflow-hidden">
                    <div className="aspect-[4/3] flex flex-col items-center justify-center">
                      <Camera className="h-16 w-16 text-gray-400 mb-2 animate-pulse-light" />
                      <p className="text-muted-foreground">Aponte o RG para a câmera</p>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <MaskedInput
                        id="cpf"
                        mask="cpf"
                        value={formData.cpf}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, cpf: value }))}
                        errorMessage="CPF inválido"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de nascimento</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <MaskedInput
                        id="phone"
                        mask="phone"
                        value={formData.phone}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                        errorMessage="Telefone inválido"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail (opcional)</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Concordo com os termos de uso e política de privacidade
                      </Label>
                    </div>
                    
                    <div className="pt-2 flex items-center justify-between">
                      <LibrasToggle />
                      <Button type="submit" disabled={!termsAccepted}>
                        Finalizar
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
