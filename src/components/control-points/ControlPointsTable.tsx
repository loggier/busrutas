
import type { ControlPoint } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Info, Flag } from 'lucide-react';

interface ControlPointsTableProps {
  controlPoints: ControlPoint[];
}

export default function ControlPointsTable({ controlPoints }: ControlPointsTableProps) {
  if (controlPoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full p-4">
        <Info className="h-12 w-12 text-primary mb-3" />
        <p className="text-2xl sm:text-3xl font-semibold text-foreground">
          La unidad no tiene despacho asignado.
        </p>
        <p className="text-lg text-muted-foreground mt-1 sm:mt-2">
          No hay puntos de control para mostrar.
        </p>
      </div>
    );
  }

  const getStatusInfo = (point: ControlPoint) => {
    const statusValue = point.status ? parseInt(point.status.replace(/[a-zA-Z: ]/g, ''), 10) : NaN;
    const isLate = point.status?.includes('l:');
    const isEarly = point.status?.includes('e:');

    let text = point.status || '-';
    let colorClass = 'text-foreground';

    if (!isNaN(statusValue)) {
      if (isLate) {
        text = `+${statusValue} min`;
        colorClass = 'text-red-500'; // Late color
      } else if (isEarly) {
        text = `-${statusValue} min`;
        colorClass = 'text-green-500'; // Early color
      } else if (statusValue === 0) {
        text = `0 min`;
        colorClass = 'text-green-500'; // On-time color
      }
    }
    
    // Use `marcade` if available, otherwise fall back to `metaTime` for backward compatibility.
    const arrivalTime = point.marcade || point.metaTime;
    const displayMarcade = arrivalTime && arrivalTime.length >= 5 ? arrivalTime.substring(0, 5) : '-';

    return { statusText: text, statusColor: colorClass, displayMarcade };
  };

  return (
    <Table className="text-lg">
      <TableHeader>
        <TableRow className="hover:bg-primary/90">
          <TableHead className="w-[10px]"></TableHead>
          <TableHead>Punto de Control</TableHead>
          <TableHead className="text-center">Hora Programada</TableHead>
          <TableHead className="text-center">Hora Marcada</TableHead>
          <TableHead className="text-center">Adelanto/Atraso</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {controlPoints.map((point) => {
          const { statusText, statusColor, displayMarcade } = getStatusInfo(point);
          return (
            <TableRow key={point.id} className={cn('text-xl', point.isCurrent ? 'bg-primary/20 font-bold' : 'hover:bg-muted/50')}>
              <TableCell className="p-1.5">
                {point.isCurrent && <Flag className="text-destructive" size={24} />}
              </TableCell>
              <TableCell className="font-medium">{point.name}</TableCell>
              <TableCell className="text-center">{point.scheduledTime ? point.scheduledTime.substring(0, 5) : '-'}</TableCell>
              <TableCell className="text-center">{displayMarcade}</TableCell>
              <TableCell className={cn("text-center font-semibold", statusColor)}>{statusText}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
