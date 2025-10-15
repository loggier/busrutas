
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
import { differenceInMinutes, parse } from 'date-fns';


interface ControlPointsTableProps {
  controlPoints: ControlPoint[];
  currentTime: Date | null;
}

export default function ControlPointsTable({ controlPoints, currentTime }: ControlPointsTableProps) {
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
    
    let text = point.status || '-';
    let colorClass = 'text-foreground';
   
    if (!isNaN(statusValue)) {
        if (statusValue > 0) colorClass = 'text-red-400';
        else colorClass = 'text-green-400';
    }

    if(point.isCurrent) {
        colorClass = 'text-white';
        if (!isNaN(statusValue)) {
            if (statusValue > 0) colorClass = 'text-red-400';
            else colorClass = 'text-green-400';
        }
    }


    if (!isNaN(statusValue)) {
        if (point.status?.includes('l:')) {
            text = `+${statusValue} min`;
        } else if (point.status?.includes('e:')) {
            text = `-${statusValue} min`;
        } else {
             if (statusValue > 0) {
                text = `+${statusValue} min`;
            } else if (statusValue <= 0) {
                text = `${statusValue} min`;
            }
        }
    }
    
    const arrivalTime = point.marcade || point.metaTime;
    const displayMarcade = arrivalTime && arrivalTime.length >= 5 ? arrivalTime.substring(0, 5) : '-';

    return { statusText: text, statusColor: colorClass, displayMarcade };
  };

  const getArrivalTimeText = (point: ControlPoint): string => {
    if (!currentTime || !point.scheduledTime) {
      return '-';
    }
    
    try {
      let scheduledDateTime: Date;
      const today = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());

      const timeParts = point.scheduledTime.split(':');
      if (timeParts.length < 2) return '-';

      scheduledDateTime = new Date(today);
      scheduledDateTime.setHours(parseInt(timeParts[0], 10));
      scheduledDateTime.setMinutes(parseInt(timeParts[1], 10));
      scheduledDateTime.setSeconds(timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0);

      if (isNaN(scheduledDateTime.getTime())) {
          return '-';
      }

      const diff = differenceInMinutes(currentTime, scheduledDateTime);

      if (diff >= 0) {
        return `Hace ${diff} min`;
      }
      return `${Math.abs(diff)} min`;

    } catch (e) {
      console.error("Error parsing date: ", e);
      return '-';
    }
  };


  return (
    <Table className="text-3xl">
      <TableHeader>
        <TableRow className="bg-secondary hover:bg-secondary/90 border-b-2 border-border">
          <TableHead className="w-[10px] text-secondary-foreground"></TableHead>
          <TableHead className="text-secondary-foreground">Punto de Control</TableHead>
          <TableHead className="text-center text-secondary-foreground">Hora Programada</TableHead>
          <TableHead className="text-center text-secondary-foreground">Min. falta</TableHead>
          <TableHead className="text-center text-secondary-foreground">Hora Marcada</TableHead>
          <TableHead className="text-center text-secondary-foreground">Adelanto/Atraso</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {controlPoints.map((point) => {
          const { statusText, statusColor, displayMarcade } = getStatusInfo(point);
          const arrivalTimeText = getArrivalTimeText(point);
          const rowClasses = cn(
            'text-3xl border-border',
            point.isCurrent ? 'bg-primary font-bold text-white' : 'hover:bg-primary/80'
          );
          
          return (
            <TableRow key={point.id} className={rowClasses}>
              <TableCell className="p-1.5">
                {point.isCurrent && <Flag className="text-white" size={28} />}
              </TableCell>
              <TableCell className="font-medium">{point.name}</TableCell>
              <TableCell className="text-center">{point.scheduledTime ? point.scheduledTime.substring(0, 5) : '-'}</TableCell>
              <TableCell className="text-center">{displayMarcade !== '-' ? '-' : arrivalTimeText}</TableCell>
              <TableCell className="text-center">{displayMarcade}</TableCell>
              <TableCell className={cn("text-center font-semibold", point.isCurrent ? statusColor : statusColor)}>{statusText}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
