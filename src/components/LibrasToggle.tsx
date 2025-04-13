import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function LibrasToggle() {
  const [isLibrasEnabled, setIsLibrasEnabled] = useState(false);

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
