
import type { ControlPoint } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ControlPointItemCardProps {
  point: ControlPoint;
}

export default function ControlPointItemCard({ point }: ControlPointItemCardProps) {
  const { status, isCurrent } = point;
  const statusValue = status ? parseInt(status, 10) : NaN;

  const cardClasses = cn(
    "rounded-lg transition-all duration-300", // Base styles
    isCurrent
      ? "p-2 sm:p-3 border-2 shadow-xl" // Current item: Taller, with border and shadow
      : "p-1 sm:p-1.5 border border-dashed border-primary shadow-md", // Non-current items
    // Conditional background/border color for the current item
    isCurrent && (isNaN(statusValue) || statusValue >= 1) && "border-primary bg-primary/10",
    isCurrent && !isNaN(statusValue) && statusValue <= 0 && "border-green-600 bg-green-500/10"
  );

  const displayScheduledTime = point.scheduledTime && typeof point.scheduledTime === 'string' && point.scheduledTime.length >= 5
    ? point.scheduledTime.substring(0, 5)
    : point.scheduledTime;
  
  const displayMetaTime = point.metaTime && typeof point.metaTime === 'string' && point.metaTime.length >= 5
    ? point.metaTime.substring(0, 5)
    : point.metaTime;

  // Logic for status text color based on its numeric value
  let statusColorClass = 'text-foreground'; // Default color
  if (!isNaN(statusValue)) {
    if (statusValue > 0) {
      statusColorClass = 'text-destructive'; // Red for late
    } else { // Handles <= 0
      statusColorClass = 'text-green-600'; // Green for early or on-time
    }
  }


  return (
    <Card className={cardClasses} id={`control-point-card-${point.id}`}>
      <CardContent className={cn("flex flex-col p-0", isCurrent ? "gap-1 sm:gap-2" : "gap-0.5 sm:gap-1")}>
        <div className="flex justify-between items-center">
          <span className={cn("text-foreground", isCurrent ? "font-bold text-xl sm:text-2xl" : "font-semibold text-base sm:text-lg")}>{point.name}</span>
          <span className={cn("text-foreground font-semibold", isCurrent ? "text-xl sm:text-2xl" : "text-base sm:text-lg")}>{displayScheduledTime}</span>
        </div>
        {point.meta && (
          <div className={cn("flex justify-between items-center font-bold", isCurrent ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
            <div>
              <span>{point.meta}</span>
              {point.metaTime && <span className="ml-2">{displayMetaTime}</span>}
            </div>
            {point.status && <span className={cn(statusColorClass)}>{point.status}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
