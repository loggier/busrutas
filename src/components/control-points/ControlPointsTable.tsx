
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
import { Info } from 'lucide-react';

interface ControlPointsTableProps {
  controlPoints: ControlPoint[];
}

export default function ControlPointsTable({ controlPoints }: ControlPointsTableProps) {
    if (controlPoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full p-4">
        <Info className="h-10 w-10 text-primary mb-3" />
        <p className="text-xl sm:text-2xl font-semibold text-foreground">
          La unidad no tiene despacho asignado.
        </p>
        <p className="text-base text-muted-foreground mt-1 sm:mt-2">
          No hay puntos de control para mostrar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary hover:bg-primary text-primary-foreground">
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>Relojes</TableHead>
          <TableHead className="text-center">T</TableHead>
          <TableHead className="text-center">Hora</TableHead>
          <TableHead className="text-center">Marcade</TableHead>
          <TableHead className="text-center">Flt+</TableHead>
          <TableHead className="text-center">Flt-</TableHead>
          <TableHead className="text-center">VM</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {controlPoints.map((point) => (
          <TableRow key={point.id} className={cn("border-b-primary/50", point.isCurrent ? 'bg-accent/30' : 'hover:bg-muted/50')}>
            <TableCell className="font-medium">{point.order ?? '-'}</TableCell>
            <TableCell>{point.name}</TableCell>
            <TableCell className="text-center">{point.t ?? '-'}</TableCell>
            <TableCell className="text-center">{point.scheduledTime ? point.scheduledTime.substring(0,5) : '-'}</TableCell>
            <TableCell className="text-center">{point.marcade ?? '--'}</TableCell>
            <TableCell className="text-center">{point.flt_mas ?? '--'}</TableCell>
            <TableCell className="text-center">{point.flt_menos ?? '--'}</TableCell>
            <TableCell className="text-center">{point.vm ?? '--'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
