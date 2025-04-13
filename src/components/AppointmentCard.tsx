
import { Appointment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
}

export default function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Concluído';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel(appointment.id);
      toast({
        title: "Consulta cancelada",
        description: "Sua consulta foi cancelada com sucesso.",
      });
    }
  };
  
  return (
    <Card className="overflow-hidden border border-border">
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{appointment.specialty}</h3>
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(appointment.date)}</span>
            </div>
            <div>
              <span>{appointment.doctorName}</span>
            </div>
          </div>
          
          {appointment.status === 'scheduled' && onCancel && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleCancel}
            >
              Cancelar Consulta
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
