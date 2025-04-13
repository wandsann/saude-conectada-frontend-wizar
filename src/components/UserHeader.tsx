
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PointsProgress from "@/components/PointsProgress";

interface UserHeaderProps {
  user: User;
  showPoints?: boolean;
  compact?: boolean;
}

export default function UserHeader({ user, showPoints = true, compact = false }: UserHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Format CPF to show only the last 3 digits
  const formatCPF = (cpf: string) => {
    if (!cpf) return '';
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return cpf;
    return `XXX.XXX.XXX-${cleanCpf.substring(9, 11)}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className={compact ? "h-12 w-12" : "h-16 w-16"}>
          <AvatarImage src={user.photoUrl} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className={`font-medium ${compact ? 'text-lg' : 'text-xl'}`}>{user.name}</h2>
          <p className="text-sm text-muted-foreground">{formatCPF(user.cpf)}</p>
        </div>
      </div>
      
      {showPoints && (
        <PointsProgress current={user.points} max={50} showCard={false} />
      )}
    </div>
  );
}
