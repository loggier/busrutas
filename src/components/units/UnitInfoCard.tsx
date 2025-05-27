
import type { UnitDetails } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UnitInfoCardProps {
  unitDetails: UnitDetails;
}

export default function UnitInfoCard({ unitDetails }: UnitInfoCardProps) {
  const cardClasses = cn(
    "rounded-lg shadow-md flex-1 flex flex-col items-center p-2 sm:p-3", 
    unitDetails.isPrimary
      ? "border-2 border-primary bg-primary/10"
      : "border border-gray-400"
  );

  return (
    <Card className={cardClasses}>
      <CardHeader className="p-0 mb-1 items-center">
        <CardTitle className={cn("text-xs sm:text-sm font-medium", unitDetails.isPrimary ? "text-primary" : "text-muted-foreground")}>
          {unitDetails.label}: {unitDetails.unitIdentifier}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center text-center">
        <div className="text-xs sm:text-sm text-foreground">
          Total AT: <span className="text-primary font-bold">{unitDetails.totalAT}</span> Total AD: <span className="font-bold text-foreground">{unitDetails.totalAD}</span>
        </div>
        <div className="mt-1 font-semibold text-sm sm:text-base md:text-lg text-foreground">
          {unitDetails.lastKnownLocation} - {unitDetails.lastKnownTime}
        </div>
        {unitDetails.meta && (
          <div className="text-xs sm:text-sm md:text-base mt-1">
            {unitDetails.meta} <span className="font-bold text-foreground">{unitDetails.metaTime}</span> {unitDetails.status && <>l: <span className="text-primary font-bold">{unitDetails.status}</span></>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
