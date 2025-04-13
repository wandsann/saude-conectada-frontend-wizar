
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ClipboardList,
  Clock,
  Edit,
  MessageCircle,
  Settings,
  Video
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import UserHeader from "@/components/UserHeader";
import AppointmentCard from "@/components/AppointmentCard";
import HistoryCard from "@/components/HistoryCard";
import PointsProgress from "@/components/PointsProgress";
import { mockUser, mockAppointments, mockConsultationHistory } from "@/lib/mock-data";
import { Appointment } from "@/lib/types";

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleConsultationStart = () => {
    navigate("/symptoms");
  };
  
  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'canceled' } : app
    ));
  };
  
  const handleEditProfile = () => {
    toast({
      title: "Editar perfil",
      description: "Funcionalidade em desenvolvimento."
    });
  };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary text-white p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start">
            <UserHeader user={mockUser} showPoints={false} />
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleEditProfile}
              >
                <Edit className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => toast({
                  title: "Notificações",
                  description: "Você tem 2 novas notificações."
                })}
              >
                <div className="relative">
                  <MessageCircle className="h-5 w-5" />
                  <Badge 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500"
                    variant="default"
                  >
                    2
                  </Badge>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <PointsProgress current={mockUser.points} max={50} showCard={false} />
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full h-12 text-base bg-red-500 hover:bg-red-600 font-medium"
              onClick={handleConsultationStart}
            >
              <Video className="h-5 w-5 mr-2" />
              Consultar Agora
            </Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <Tabs defaultValue="appointments">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Agendamentos</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>Histórico</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Próximas Consultas</h2>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate("/schedule")}
              >
                <Clock className="h-4 w-4" />
                <span>Agendar</span>
              </Button>
            </div>
            
            {appointments.filter(app => app.status !== 'canceled').length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {appointments
                  .filter(app => app.status !== 'canceled')
                  .map(appointment => (
                    <AppointmentCard 
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={handleCancelAppointment}
                    />
                  ))
                }
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Nenhum agendamento</h3>
                  <p className="text-muted-foreground mb-4">
                    Você não possui consultas agendadas no momento.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/schedule")}
                  >
                    Agendar Consulta
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {appointments.filter(app => app.status === 'canceled').length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Consultas Canceladas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {appointments
                    .filter(app => app.status === 'canceled')
                    .map(appointment => (
                      <AppointmentCard 
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))
                  }
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <h2 className="text-xl font-bold">Histórico de Consultas</h2>
            
            {mockConsultationHistory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockConsultationHistory.map(consultation => (
                  <HistoryCard 
                    key={consultation.id}
                    consultation={consultation}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Nenhuma consulta</h3>
                  <p className="text-muted-foreground">
                    Você ainda não realizou nenhuma consulta.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
