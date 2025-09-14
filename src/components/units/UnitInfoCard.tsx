
import type { UnitDetails } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Ban } from 'lucide-react';

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
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
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

  // The API sends status like "l: 5" or "e: 2", let's make it more friendly
  const statusParts = unit.status?.split(':') ?? [];
  const statusType = statusParts[0]?.trim();
  const statusValue = statusParts[1]?.trim();
  
  let friendlyStatus = unit.status ?? 'N/A';
  let statusColor = 'text-muted-foreground';
  
  if(statusType === 'l') {
    friendlyStatus = `A ${statusValue} min`;
    statusColor = 'text-green-500'; // Ahead is good
  } else if (statusType === 'e') {
    friendlyStatus = `Hace ${statusValue} min`;
    statusColor = 'text-destructive'; // Behind is not ideal
  }


  return (
    <Card className="shadow-lg bg-card rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {isAhead ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-destructive" />
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-lg font-bold">{unit.unit}</div>
        <div className="flex justify-between items-baseline">
            <p className="text-xs text-muted-foreground">
                Pasó a las {unit.time}
            </p>
            <p className={`text-sm font-semibold ${statusColor}`}>
                {friendlyStatus}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
