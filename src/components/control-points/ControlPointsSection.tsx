
import type { ControlPoint } from '@/types';
import ControlPointItemCard from './ControlPointItemCard';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';
import { Info } from 'lucide-react';

interface ControlPointsSectionProps {
  controlPoints: ControlPoint[];
}

export default function ControlPointsSection({ controlPoints }: ControlPointsSectionProps) {
  useEffect(() => {
    if (controlPoints.length > 0) {
      const currentPoint = controlPoints.find(p => p.isCurrent);
      if (currentPoint) {
        const targetId = `control-point-card-${currentPoint.id}`;
        setTimeout(() => {
          const elementToScrollTo = document.getElementById(targetId);
          if (elementToScrollTo) {
            elementToScrollTo.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }, 100);
      }
    }
  }, [controlPoints]);

  return (
    <Card className="shadow-xl flex-1 flex flex-col overflow-hidden">
      {controlPoints.length === 0 ? (
        <CardContent className="p-6 flex-1 flex flex-col items-center justify-center text-center">
          <Info className="h-12 w-12 text-primary mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-foreground">
            La unidad no tiene despacho asignado.
          </p>
          <p className="text-sm text-muted-foreground mt-1 sm:mt-2">
            No hay puntos de control para mostrar. Intente refrescar más tarde.
          </p>
        </CardContent>
      ) : (
        <CardContent className="p-6 flex-1 flex flex-col gap-6 overflow-hidden">
          <ScrollArea className="flex-1 pr-3">
            <div className="flex flex-col gap-6">
              {controlPoints.map((point) => (
                <ControlPointItemCard key={point.id} point={point} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
