
import { ConsultationHistory } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

interface HistoryCardProps {
  consultation: ConsultationHistory;
}

export default function HistoryCard({ consultation }: HistoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };
  
  return (
    <Card className="overflow-hidden border border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{consultation.specialty}</h3>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(consultation.date)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{consultation.doctorName}</span>
          </div>
          
          <div>
            <p className="text-sm font-medium">Diagnóstico:</p>
            <p className="text-sm">{consultation.diagnosis}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
