
import type { UnitDetails } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UnitInfoCardProps {
  unitDetails: UnitDetails;
}

export default function UnitInfoCard({ unitDetails }: UnitInfoCardProps) {
  const cardClasses = cn(
    "rounded-lg shadow-md flex-1 flex flex-col items-center p-1.5 sm:p-2", // Reducido de p-2 sm:p-3
    unitDetails.isPrimary
      ? "border-primary border-2 sm:border-2" // Ajustado el borde
      : "border border-gray-400"
  );

  const displayLastKnownTime = unitDetails.lastKnownTime && typeof unitDetails.lastKnownTime === 'string' && unitDetails.lastKnownTime.length >= 5
    ? unitDetails.lastKnownTime.substring(0, 5)
    : unitDetails.lastKnownTime;

  const displayMetaTime = unitDetails.metaTime && typeof unitDetails.metaTime === 'string' && unitDetails.metaTime.length >= 5
    ? unitDetails.metaTime.substring(0, 5)
    : unitDetails.metaTime;

  return (
    <Card className={cardClasses}>
      <CardHeader className="p-0 mb-0.5 sm:mb-1 items-center"> {/* Reducido mb-1 */}
        <CardTitle className={cn("text-sm sm:text-base font-medium", unitDetails.isPrimary ? "text-primary" : "text-muted-foreground")}>
          {unitDetails.label}: {unitDetails.unitIdentifier}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center text-center">
        <div className="text-sm sm:text-base text-foreground">
          Total AT: <span className="text-primary font-bold">{unitDetails.totalAT}</span> Total AD: <span className="font-bold text-foreground">{unitDetails.totalAD}</span>
        </div>
        <div className="mt-0.5 sm:mt-1 font-semibold text-base sm:text-lg md:text-lg text-foreground"> {/* Reducido mt-1 y md:text-lg */}
          {unitDetails.lastKnownLocation} - {displayLastKnownTime}
        </div>
        {unitDetails.meta && (
          <div className="text-sm sm:text-base md:text-base mt-0.5 sm:mt-1"> {/* Reducido mt-1, md:text-base */}
            {unitDetails.meta} <span className="font-bold text-foreground">{displayMetaTime}</span> {unitDetails.status && <>l: <span className="text-primary font-bold">{unitDetails.status}</span></>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
