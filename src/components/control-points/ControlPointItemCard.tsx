
import type { ControlPoint } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ControlPointItemCardProps {
  point: ControlPoint;
}

export default function ControlPointItemCard({ point }: ControlPointItemCardProps) {
  const cardClasses = cn(
    "rounded-lg p-3 sm:p-4 shadow-md", 
    point.isCurrent
      ? "border-2 sm:border-4 border-primary bg-primary/10" // Borde más delgado en móvil
      : "border border-dashed border-primary"
  );

  return (
    <Card className={cardClasses} id={`control-point-card-${point.id}`}>
      <CardContent className={cn("flex flex-col gap-1.5 sm:gap-2 p-0", point.isCurrent && "sm:gap-3")}>
        <div className="flex justify-between items-center">
          <span className={cn("text-base sm:text-lg md:text-xl text-foreground", point.isCurrent ? "font-bold sm:text-xl md:text-2xl" : "font-semibold")}>{point.name}</span>
          <span className={cn("text-base sm:text-lg md:text-xl text-foreground", point.isCurrent ? "font-semibold" : "font-semibold")}>{point.scheduledTime}</span>
        </div>
        {point.meta && (
          <div className="flex justify-between items-center text-sm sm:text-base md:text-lg">
            <div> 
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
