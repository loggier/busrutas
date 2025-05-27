
import type { UnitDetails } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UnitInfoCardProps {
  unitDetails: UnitDetails;
}

export default function UnitInfoCard({ unitDetails }: UnitInfoCardProps) {
  const cardClasses = cn(
    "rounded-lg shadow-md flex-1 flex flex-col items-center p-3 sm:p-4", 
    unitDetails.isPrimary
      ? "border-2 sm:border-4 border-primary bg-primary/10" // Borde más delgado en móvil
      : "border border-gray-400"
  );

  return (
    <Card className={cardClasses}>
      <CardHeader className="p-0 mb-1 sm:mb-2 items-center">
        <CardTitle className={cn("text-sm sm:text-base font-medium", unitDetails.isPrimary ? "text-primary" : "text-muted-foreground")}>
          {unitDetails.label}: {unitDetails.unitIdentifier}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center text-center">
        <div className="text-sm sm:text-base text-foreground">
          Total AT: <span className="text-primary font-bold">{unitDetails.totalAT}</span> Total AD: <span className="font-bold text-foreground">{unitDetails.totalAD}</span>
        </div>
        <div className="mt-1 sm:mt-2 font-semibold text-base sm:text-lg md:text-xl text-foreground">
          {unitDetails.lastKnownLocation} - {unitDetails.lastKnownTime}
        </div>
        {unitDetails.meta && (
          <div className="text-sm sm:text-base md:text-lg mt-1 sm:mt-2">
            {unitDetails.meta} <span className="font-bold text-foreground">{unitDetails.metaTime}</span> {unitDetails.status && <>l: <span className="text-primary font-bold">{unitDetails.status}</span></>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
