import type { UnitDetails } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UnitInfoCardProps {
  unitDetails: UnitDetails;
}

export default function UnitInfoCard({ unitDetails }: UnitInfoCardProps) {
  const cardClasses = cn(
    "rounded-xl shadow-md flex-1 flex flex-col items-center p-4 md:p-6", // Ajustado padding
    unitDetails.isPrimary
      ? "border-4 border-primary bg-primary/10"
      : "border-2 border-gray-400"
  );

  return (
    <Card className={cardClasses}>
      <CardHeader className="p-0 mb-2 items-center">
        <CardTitle className={cn("text-base sm:text-lg font-medium", unitDetails.isPrimary ? "text-primary" : "text-muted-foreground")}>
          {unitDetails.label}: {unitDetails.unitIdentifier}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center text-center">
        <div className="text-base sm:text-lg text-foreground">
          Total AT: <span className="text-primary font-bold">{unitDetails.totalAT}</span> Total AD: <span className="font-bold text-foreground">{unitDetails.totalAD}</span>
        </div>
        <div className="mt-3 md:mt-4 font-semibold text-xl sm:text-2xl text-foreground">
          {unitDetails.lastKnownLocation} - {unitDetails.lastKnownTime}
        </div>
        {unitDetails.meta && (
          <div className="text-lg sm:text-xl mt-2">
            {unitDetails.meta} <span className="font-bold text-foreground">{unitDetails.metaTime}</span> {unitDetails.status && <>l: <span className="text-primary font-bold">{unitDetails.status}</span></>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
