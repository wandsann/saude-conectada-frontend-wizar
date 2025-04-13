
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Wifi, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function TelemedicineWaiting() {
  const [timeRemaining, setTimeRemaining] = useState(165); // 2:45 in seconds
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'medium' | 'poor'>('good');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate countdown
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          // Navigate to video call after countdown finishes
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
      
      // Randomly change connection quality
      if (Math.random() < 0.1) {
        const qualities: Array<'good' | 'medium' | 'poor'> = ['good', 'medium', 'poor'];
        setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [navigate]);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleCancel = () => {
    setIsDialogOpen(true);
  };
  
  const confirmCancel = () => {
    setIsDialogOpen(false);
    toast({
      title: "Consulta cancelada",
      description: "Você cancelou a consulta de telemedicina.",
    });
    navigate("/dashboard");
  };
  
  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'good': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-green-500';
    }
  };
  
  const getConnectionText = () => {
    switch (connectionQuality) {
      case 'good': return 'Boa conexão';
      case 'medium': return 'Conexão média';
      case 'poor': return 'Conexão fraca';
      default: return 'Boa conexão';
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/10 to-secondary/30">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Aguardando Médico</h1>
            <p className="text-muted-foreground">Conectando com Dr. Silva (Generalista)</p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-16 w-16 text-primary"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">~{formatTime(timeRemaining)}</div>
              <p className="text-sm text-muted-foreground">Tempo estimado de espera</p>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full animate-progress-bar"
                style={{ width: `${(1 - timeRemaining / 180) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-center items-center gap-2">
              <Wifi className={`h-4 w-4 ${getConnectionColor()}`} />
              <span className="text-sm text-muted-foreground">{getConnectionText()}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar consulta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar a consulta? Você perderá seu lugar na fila.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Continuar esperando
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Sim, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
