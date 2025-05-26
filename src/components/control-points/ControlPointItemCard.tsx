import type { ControlPoint } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ControlPointItemCardProps {
  point: ControlPoint;
}

export default function ControlPointItemCard({ point }: ControlPointItemCardProps) {
  const cardClasses = cn(
    "rounded-xl p-4 md:p-5 shadow-md", // Ajustado padding
    point.isCurrent
      ? "border-4 border-primary bg-primary/10"
      : "border-2 border-dashed border-primary"
  );

  return (
    <Card className={cardClasses}>
      <CardContent className={cn("flex flex-col gap-2 p-0", point.isCurrent && "gap-3")}>
        <div className="flex justify-between items-center">
          <span className={cn("text-lg sm:text-xl md:text-2xl text-foreground", point.isCurrent ? "font-bold md:text-3xl" : "font-semibold")}>{point.name}</span>
          <span className={cn("text-lg sm:text-xl md:text-2xl text-foreground", point.isCurrent ? "font-semibold" : "font-semibold")}>{point.scheduledTime}</span>
        </div>
        {/* Mostrar detalles si 'meta' está presente, independientemente de 'isCurrent' */}
        {point.meta && (
          <div className="flex justify-between items-center text-base sm:text-lg md:text-xl">
            <div> {/* Contenedor para agrupar meta y metaTime si ambos existen */}
              <span>{point.meta}</span>
              {point.metaTime && <span className="font-bold ml-1">{point.metaTime}</span>}
            </div>
            {point.status && <span className="text-primary font-bold">{point.status}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
