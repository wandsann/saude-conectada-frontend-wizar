import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hand } from 'lucide-react';

export default function LibrasToggle() {
  const [showLibras, setShowLibras] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowLibras(!showLibras)}
        className="text-primary px-0 flex items-center gap-2"
        aria-label="Ativar/desativar intérprete de Libras"
      >
        <Hand className="h-4 w-4" />
        <span>Libras</span>
      </Button>

      {showLibras && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md">
          <p>Conteúdo em Libras (ex.: vídeo ou animação)</p>
        </div>
      )}
    </>
  );
}
