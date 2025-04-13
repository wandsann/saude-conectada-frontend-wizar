
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HandMetal } from "lucide-react";

export default function LibrasToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Effect for pausing video during typing
  useEffect(() => {
    const handleKeyDown = () => {
      setIsTyping(true);
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };
    
    const handleKeyUp = () => {
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  
  // Effect for resuming video after typing
  useEffect(() => {
    if (!isTyping && videoRef.current && videoRef.current.paused && isOpen) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, [isTyping, isOpen]);
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-secondary text-primary"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir intérprete de Libras"
      >
        <HandMetal className="h-4 w-4" />
        <span>Libras</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="sm:max-w-[500px] animate-slide-up" 
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Intérprete de Libras</DialogTitle>
            <DialogDescription>
              Vídeo explicativo em Língua Brasileira de Sinais.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gray-100 aspect-video rounded-md overflow-hidden">
            {/* Lazy-loaded video element */}
            {isOpen && (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                controls
                autoPlay
                poster="/placeholder.svg"
                aria-label="Vídeo em Libras explicando o processo de login"
              >
                <source src="#" type="video/mp4" />
                <p className="p-4 text-center">
                  Seu navegador não suporta a reprodução de vídeos.
                </p>
              </video>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
