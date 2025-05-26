import type { ControlPoint } from '@/types';
import ControlPointItemCard from './ControlPointItemCard';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';

interface ControlPointsSectionProps {
  controlPoints: ControlPoint[];
}

export default function ControlPointsSection({ controlPoints }: ControlPointsSectionProps) {
  useEffect(() => {
    const currentPoint = controlPoints.find(p => p.isCurrent);
    if (currentPoint) {
      const targetId = `control-point-card-${currentPoint.id}`;
      // Pequeño retraso para asegurar que el DOM esté completamente listo,
      // especialmente después de actualizaciones de datos.
      setTimeout(() => {
        const elementToScrollTo = document.getElementById(targetId);
        if (elementToScrollTo) {
          elementToScrollTo.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100); // 100ms de retraso, ajustar si es necesario
    }
  }, [controlPoints]); // Se ejecuta cuando controlPoints cambia

  return (
    <Card className="shadow-xl flex-1 flex flex-col overflow-hidden">
      <CardContent className="p-6 flex-1 flex flex-col gap-6 overflow-hidden">
        <ScrollArea className="flex-1 pr-3"> {/* Added pr-3 to prevent scrollbar overlap */}
          <div className="flex flex-col gap-6">
            {controlPoints.map((point) => (
              <ControlPointItemCard key={point.id} point={point} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
