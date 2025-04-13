import { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function LibrasToggle() {
  const [isLibrasEnabled, setIsLibrasEnabled] = useState(false);

  useEffect(() => {
    if (isLibrasEnabled) {
      const script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.onload = () => {
        (window as any).VLibras?.Widget('https://vlibras.gov.br/app');
      };
      document.body.appendChild(script);
    } else {
      const widget = document.querySelector('.vw-plugin-wrapper');
      if (widget) {
        widget.remove();
      }
    }
  }, [isLibrasEnabled]);

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="libras-toggle"
        checked={isLibrasEnabled}
        onCheckedChange={setIsLibrasEnabled}
      />
      <Label htmlFor="libras-toggle">Ativar Libras</Label>
    </div>
  );
}
