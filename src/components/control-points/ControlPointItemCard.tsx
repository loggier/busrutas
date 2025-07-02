
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
    "rounded-lg p-1.5 sm:p-2 transition-all duration-300", // Base style for all cards
    isCurrent
      ? {
          // Current card styles
          "border-2 shadow-xl": true, // "3D" effect with a more prominent shadow and border
          "border-primary bg-primary/10": isNaN(statusValue) || statusValue >= 1, // Reddish for late or no status
          "border-green-600 bg-green-500/10": !isNaN(statusValue) && statusValue <= 0, // Greenish for on-time/early
        }
      : "border border-dashed border-primary shadow-md" // Non-current card style
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
      <CardContent className={cn("flex flex-col gap-0.5 sm:gap-1 p-0", point.isCurrent && "sm:gap-1.5")}>
        <div className="flex justify-between items-center">
          <span className={cn("text-sm sm:text-base md:text-base text-foreground", point.isCurrent ? "font-bold sm:text-base md:text-lg" : "font-semibold")}>{point.name}</span>
          <span className={cn("text-sm sm:text-base md:text-base text-foreground font-semibold")}>{displayScheduledTime}</span>
        </div>
        {point.meta && (
          <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
            <div>
              <span>{point.meta}</span>
              {point.metaTime && <span className="ml-1">{displayMetaTime}</span>}
            </div>
            {point.status && <span className={cn(statusColorClass)}>{point.status}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
