
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-secondary/30 p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <p className="text-xl text-gray-600 mb-4">Página não encontrada</p>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button 
          className="flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao início</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
