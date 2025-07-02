
import type { ControlPoint } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ControlPointItemCardProps {
  point: ControlPoint;
}

export default function ControlPointItemCard({ point }: ControlPointItemCardProps) {
  const cardClasses = cn(
    "rounded-lg p-1.5 sm:p-2 shadow-md", // Reducido de p-2 sm:p-3
    point.isCurrent
      ? "border-2 border-primary bg-primary/10"
      : "border border-dashed border-primary"
  );

  const displayScheduledTime = point.scheduledTime && typeof point.scheduledTime === 'string' && point.scheduledTime.length >= 5
    ? point.scheduledTime.substring(0, 5)
    : point.scheduledTime;
  
  const displayMetaTime = point.metaTime && typeof point.metaTime === 'string' && point.metaTime.length >= 5
    ? point.metaTime.substring(0, 5)
    : point.metaTime;

  return (
    <Card className={cardClasses} id={`control-point-card-${point.id}`}>
      <CardContent className={cn("flex flex-col gap-0.5 sm:gap-1 p-0", point.isCurrent && "sm:gap-1.5")}> {/* Reducido de gap-1 sm:gap-1.5 y sm:gap-2 */}
        <div className="flex justify-between items-center">
          <span className={cn("text-sm sm:text-base md:text-base text-foreground", point.isCurrent ? "font-bold sm:text-base md:text-lg" : "font-semibold")}>{point.name}</span> {/* Ajustado md:text-lg y md:text-xl a base y lg */}
          <span className={cn("text-sm sm:text-base md:text-base text-foreground font-semibold")}>{displayScheduledTime}</span> {/* Ajustado y unificado */}
        </div>
        {point.meta && (
          <div className="flex justify-between items-center text-xs sm:text-sm md:text-sm"> {/* Ajustado md:text-base a sm */}
            <div>
              <span>{point.meta}</span>
              {point.metaTime && <span className="font-bold ml-1">{displayMetaTime}</span>}
            </div>
            {point.status && <span className="text-primary font-bold">{point.status}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
