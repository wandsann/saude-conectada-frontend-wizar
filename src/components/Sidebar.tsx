import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, Calendar, User, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="w-64 h-screen bg-primary text-white p-4 flex flex-col">
      <div className="text-2xl font-bold mb-8">Saúde Conectada</div>
      <nav className="flex-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-primary-foreground hover:text-primary mb-2"
          onClick={() => navigate("/dashboard")}
        >
          <Users className="mr-2 h-5 w-5" />
          Pacientes
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-primary-foreground hover:text-primary mb-2"
          onClick={() => navigate("/appointments")}
        >
          <Calendar className="mr-2 h-5 w-5" />
          Consultas
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-primary-foreground hover:text-primary mb-2"
          onClick={() => navigate("/profile")}
        >
          <User className="mr-2 h-5 w-5" />
          Perfil
        </Button>
      </nav>
      <Button
        variant="ghost"
        className="w-full justify-start text-white hover:bg-primary-foreground hover:text-primary"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-5 w-5" />
        Sair
      </Button>
    </div>
  );
}
