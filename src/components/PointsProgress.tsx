
import { Card } from "@/components/ui/card";

interface PointsProgressProps {
  current: number;
  max: number;
  showCard?: boolean;
}

export default function PointsProgress({ current, max, showCard = true }: PointsProgressProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  const progressBar = (
    <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
  
  const content = (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-muted-foreground">Pontos de Saúde</p>
        <p className="text-sm font-medium">
          {current}/{max}
        </p>
      </div>
      {progressBar}
    </div>
  );
  
  if (showCard) {
    return (
      <Card className="p-4">
        {content}
      </Card>
    );
  }
  
  return content;
}
