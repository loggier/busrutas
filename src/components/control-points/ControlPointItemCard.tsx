
import type { ControlPoint } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';

interface ControlPointItemCardProps {
  point: ControlPoint;
}

export default function ControlPointItemCard({ point }: ControlPointItemCardProps) {
  const { status, isCurrent } = point;
  const statusValue = status ? parseInt(status, 10) : NaN;

  const cardClasses = cn(
    "rounded-lg transition-all duration-300 bg-zinc-800/60", // Base dark item
    isCurrent
      ? "p-2 sm:p-3 border-2 shadow-xl" // Current item: Taller, with border and shadow
      : "p-1 sm:p-1.5 border border-dashed border-zinc-600 shadow-md", // Non-current items
    // Conditional background/border color for the current item
    isCurrent && (isNaN(statusValue) || statusValue >= 1) && "border-primary bg-primary/20",
    isCurrent && !isNaN(statusValue) && statusValue <= 0 && "border-green-500 bg-green-500/20"
  );

  const displayScheduledTime = point.scheduledTime && typeof point.scheduledTime === 'string' && point.scheduledTime.length >= 5
    ? point.scheduledTime.substring(0, 5)
    : point.scheduledTime;
  
  const displayMetaTime = point.metaTime && typeof point.metaTime === 'string' && point.metaTime.length >= 5
    ? point.metaTime.substring(0, 5)
    : point.metaTime;

  // Logic for status text color based on its numeric value
  let statusColorClass = 'text-foreground'; // Default color (will be light now)
  if (!isNaN(statusValue)) {
    if (statusValue > 0) {
      statusColorClass = 'text-destructive'; // Red for late
    } else { // Handles <= 0
      statusColorClass = 'text-green-400'; // Brighter Green for early or on-time
    }
  }


  return (
    <Card className={cardClasses} id={`control-point-card-${point.id}`}>
      <CardContent className={cn("flex flex-col text-white p-0", isCurrent ? "gap-1 sm:gap-2" : "gap-0.5 sm:gap-1")}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isCurrent && <Flag className="text-destructive" size={20} />}
            <span className={cn("text-white", isCurrent ? "font-bold text-lg sm:text-xl" : "font-semibold text-base sm:text-lg")}>{point.name}</span>
          </div>
          <span className={cn("text-white font-semibold", isCurrent ? "text-lg sm:text-xl" : "text-base sm:text-lg")}>{displayScheduledTime}</span>
        </div>
        {point.meta && (
          <div className={cn("flex justify-between items-center font-bold", isCurrent ? "text-xl sm:text-2xl" : "text-lg sm:text-xl")}>
            <div className='text-zinc-300'>
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
