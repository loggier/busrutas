import type { ControlPoint } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface ControlPointItemCardProps {
  point: ControlPoint;
}

export default function ControlPointItemCard({ point }: ControlPointItemCardProps) {
  const cardClasses = cn(
    "rounded-xl p-5 shadow-md",
    point.isCurrent
      ? "border-4 border-primary bg-primary/10" // Using bg-primary/10 for a subtle highlighted background
      : "border-2 border-dashed border-primary"
  );

  return (
    <Card className={cardClasses}>
      <CardContent className={cn("flex flex-col gap-2 p-0", point.isCurrent && "gap-3")}>
        <div className="flex justify-between items-center">
          <span className={cn("text-2xl text-foreground", point.isCurrent ? "font-bold text-3xl" : "font-semibold")}>{point.name}</span>
          <span className={cn("text-2xl text-foreground", point.isCurrent ? "font-semibold" : "font-semibold")}>{point.scheduledTime}</span>
        </div>
        {point.predictedTime && (
          <div className="flex justify-between items-center text-lg text-accent-foreground">
            <span className="flex items-center gap-1">
              <Clock size={16} className="text-accent" />
              ETA:
            </span>
            <span className="font-bold">{point.predictedTime}</span>
          </div>
        )}
        {point.delayReason && (
           <p className="text-sm text-destructive text-right">Retraso: {point.delayReason}</p>
        )}
        {point.isCurrent && point.meta && (
          <div className="flex justify-between items-center text-2xl">
            <span>{point.meta}</span>
            <span className="font-bold">{point.metaTime}</span>
            <span className="text-primary font-bold">{point.status}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
