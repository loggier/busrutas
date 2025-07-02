
import type { ControlPoint } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ControlPointItemCardProps {
  point: ControlPoint;
}

export default function ControlPointItemCard({ point }: ControlPointItemCardProps) {
  const cardClasses = cn(
    "rounded-lg p-2 sm:p-3 shadow-md", 
    point.isCurrent
      ? "border-2 border-primary bg-primary/10" 
      : "border border-dashed border-primary"
  );

  const displayScheduledTime = point.scheduledTime && typeof point.scheduledTime === 'string' && point.scheduledTime.length >= 5
    ? point.scheduledTime.substring(0, 5)
    : point.scheduledTime;

  return (
    <Card className={cardClasses} id={`control-point-card-${point.id}`}>
      <CardContent className={cn("flex flex-col gap-1 sm:gap-1.5 p-0", point.isCurrent && "sm:gap-2")}>
        <div className="flex justify-between items-center">
          <span className={cn("text-sm sm:text-base md:text-lg text-foreground", point.isCurrent ? "font-bold sm:text-lg md:text-xl" : "font-semibold")}>{point.name}</span>
          <span className={cn("text-sm sm:text-base md:text-lg text-foreground", point.isCurrent ? "font-semibold" : "font-semibold")}>{displayScheduledTime}</span>
        </div>
        {point.meta && (
          <div className="flex justify-between items-center text-xs sm:text-sm md:text-base">
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
