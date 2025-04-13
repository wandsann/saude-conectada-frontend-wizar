
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { mockSymptoms, mockVitalSigns } from "@/lib/mock-data";
import { Symptom, VitalSign } from "@/lib/types";

export default function SymptomForm() {
  const [symptoms, setSymptoms] = useState<Symptom[]>(mockSymptoms);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>(mockVitalSigns);
  const [showVitalSigns, setShowVitalSigns] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if at least one symptom is selected
    const isValid = selectedSymptoms.length > 0;
    
    // Enable/disable the confirm button
    const confirmButton = document.getElementById("confirm-button") as HTMLButtonElement;
    if (confirmButton) {
      confirmButton.disabled = !isValid;
    }
  }, [selectedSymptoms]);
  
  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptomId)) {
        return prev.filter((id) => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };
  
  const handleVitalSignChange = (id: string, value: string) => {
    setVitalSigns((prev) => 
      prev.map((sign) => 
        sign.id === id ? { ...sign, value: value === "" ? null : Number(value) } : sign
      )
    );
  };
  
  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um sintoma.",
        variant: "destructive",
      });
      return;
    }
    
    // For demo purposes, we'll just navigate to the waiting screen
    toast({
      title: "Sintomas registrados",
      description: "Você será direcionado para a telemedicina.",
    });
    
    navigate("/telemedicine-waiting");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-primary p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
        <h1 className="text-xl font-bold text-white">Formulário de Sintomas</h1>
      </header>
      
      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selecione seus sintomas</CardTitle>
              <CardDescription>
                Escolha todos os sintomas que estiver sentindo
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`symptom-${symptom.id}`}
                      checked={selectedSymptoms.includes(symptom.id)}
                      onCheckedChange={() => handleSymptomToggle(symptom.id)}
                    />
                    <Label
                      htmlFor={`symptom-${symptom.id}`}
                      className="cursor-pointer"
                    >
                      {symptom.name}
                    </Label>
                  </div>
                ))}
              </div>
              
              {selectedSymptoms.length === 0 && (
                <p className="text-red-500 text-sm">Selecione pelo menos um sintoma</p>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="description">Descreva seus sintomas (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva com mais detalhes o que está sentindo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                  rows={4}
                />
                <div className="text-right text-sm text-muted-foreground">
                  {description.length}/300
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Sinais Vitais</CardTitle>
                <CardDescription>
                  Meça seus sinais vitais, se disponível
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowVitalSigns(!showVitalSigns)}
              >
                <Heart className="h-4 w-4" />
                <span>{showVitalSigns ? "Ocultar" : "Mostrar"}</span>
              </Button>
            </CardHeader>
            
            {showVitalSigns && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vitalSigns.map((sign) => (
                    <div key={sign.id} className="space-y-2">
                      <Label htmlFor={`vital-${sign.id}`}>
                        {sign.name} ({sign.unit})
                      </Label>
                      <Input
                        id={`vital-${sign.id}`}
                        type="number"
                        placeholder={`${sign.min}-${sign.max}`}
                        min={sign.min}
                        max={sign.max}
                        value={sign.value === null ? "" : sign.value}
                        onChange={(e) => handleVitalSignChange(sign.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleChatToggle}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ajuda</span>
            </Button>
            
            <Button 
              type="submit" 
              id="confirm-button" 
              disabled={selectedSymptoms.length === 0}
            >
              Confirmar
            </Button>
          </div>
        </form>
        
        {isChatOpen && (
          <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-lg border border-border overflow-hidden animate-scale-in">
            <div className="bg-primary p-3 text-white flex justify-between items-center">
              <h3 className="font-medium">Assistente Virtual</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-white hover:bg-primary-foreground/20"
                onClick={handleChatToggle}
              >
                ×
              </Button>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto space-y-3">
              <div className="bg-secondary rounded-lg p-3 text-sm">
                Olá! Estou aqui para ajudar com o preenchimento do formulário de sintomas. Como posso ajudar?
              </div>
              <div className="bg-muted rounded-lg p-3 text-sm ml-auto max-w-[80%]">
                O que devo fazer se eu tiver febre alta?
              </div>
              <div className="bg-secondary rounded-lg p-3 text-sm">
                Se você está com febre alta (acima de 38°C), é importante selecionar a opção "Febre" nos sintomas e, se possível, informar a temperatura atual no campo de sinais vitais. Isso ajudará o profissional a avaliar melhor sua condição.
              </div>
            </div>
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  className="text-sm"
                />
                <Button size="sm">Enviar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
