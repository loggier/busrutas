
import type { UnitDetails } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Ban, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnitInfoCardProps {
  title: 'Unidad de Adelante' | 'Unidad de Atrás';
  unit: UnitDetails | null;
}

export default function UnitInfoCard({ title, unit }: UnitInfoCardProps) {
  const isAhead = title === 'Unidad de Adelante';

  if (!unit) {
    return (
      <Card className="shadow-lg bg-card rounded-lg opacity-70">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bus className="h-5 w-5 text-muted-foreground" />
            <span>{isAhead ? 'Adelante' : 'Atrás'}</span>
          </CardTitle>
          <Ban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-lg font-bold">No Asignada</div>
          <p className="text-xs text-muted-foreground pt-1">
            No hay información de unidad.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusParts = unit.status?.split(':') ?? [];
  const statusType = statusParts[0]?.trim();
  const statusValue = statusParts[1]?.trim();
  
  let friendlyStatus = unit.status ?? 'N/A';
  let statusColor = 'text-muted-foreground';
  
  if (statusType === 'l' && statusValue) {
    friendlyStatus = `A ${statusValue} min`;
    statusColor = 'text-green-500';
  } else if (statusType === 'e' && statusValue) {
    friendlyStatus = `Hace ${statusValue} min`;
    statusColor = 'text-destructive';
  }


  return (
    <Card className="shadow-lg bg-card rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bus className="h-5 w-5" />
            {isAhead ? (
              <ArrowUp className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDown className="h-5 w-5 text-destructive" />
            )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-lg font-bold">{unit.unit}</div>
        <div className="flex justify-between items-baseline">
            <p className="text-xs text-muted-foreground">
                Pasó a las {unit.time}
            </p>
            <p className={cn("text-sm font-semibold", statusColor)}>
                {friendlyStatus}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
