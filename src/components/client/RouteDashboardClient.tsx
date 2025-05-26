
'use client';

import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import RouteHeaderCard from '@/components/route/RouteHeaderCard';
import ControlPointsSection from '@/components/control-points/ControlPointsSection';
import UnitInfoCard from '@/components/units/UnitInfoCard';
import DigitalClock from '@/components/common/DigitalClock';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RouteDashboardClientProps {
  initialRouteInfo: RouteInfo;
  initialControlPoints: ControlPoint[];
  initialUnitAhead: UnitDetails;
  initialUnitBehind: UnitDetails;
  currentUnitId: string; // ID de la unidad para refrescar
  historicalData?: string; // Hecho opcional
}

const AUTO_REFRESH_INTERVAL = 30000; // 30 segundos

export default function RouteDashboardClient({
  initialRouteInfo,
  initialControlPoints,
  initialUnitAhead,
  initialUnitBehind,
  currentUnitId,
}: RouteDashboardClientProps) {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(initialRouteInfo);
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>(initialControlPoints);
  const [unitAhead, setUnitAhead] = useState<UnitDetails>(initialUnitAhead);
  const [unitBehind, setUnitBehind] = useState<UnitDetails>(initialUnitBehind);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const currentTime = useCurrentTime();

  const fetchData = useCallback(async (unitId: string, isBackgroundRefresh: boolean = false) => {
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(`https://control.puntoexacto.ec/api/get_despacho/${unitId}`);
      if (!response.ok) {
        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch(e) { /* no-op */ }
        throw new Error(`Error al ${isBackgroundRefresh ? 'actualizar en segundo plano' : 'refrescar'}: ${response.status} ${response.statusText}. ${errorBody}`);
      }
      const data = await response.json();

      if (!data.routeInfo || !data.controlPoints || !data.unitAhead || !data.unitBehind) {
        throw new Error('La respuesta de la API no tiene la estructura esperada.');
      }

      setRouteInfo(data.routeInfo);
      setControlPoints(data.controlPoints);
      setUnitAhead(data.unitAhead);
      setUnitBehind(data.unitBehind);

      if (!isBackgroundRefresh) {
        toast({
          title: 'Datos Actualizados',
          description: 'La información del despacho ha sido refrescada.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error(`Error en fetchData (${isBackgroundRefresh ? 'background' : 'manual'}):`, error);
      const errorMessage = error instanceof Error ? error.message : `Error desconocido al ${isBackgroundRefresh ? 'actualizar en segundo plano' : 'refrescar'}.`;
      // Mostrar toast de error siempre, incluso para actualizaciones en segundo plano, para alertar de problemas.
      toast({
        title: `Error al ${isBackgroundRefresh ? 'Actualizar Automáticamente' : 'Refrescar'}`,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoading(false);
      }
    }
  }, [toast]);

  const handleManualRefresh = useCallback(() => {
    fetchData(currentUnitId, false);
  }, [currentUnitId, fetchData]);

  useEffect(() => {
    // Realiza la primera actualización en segundo plano poco después de la carga inicial,
    // si no quieres esperar los 30s completos. Puedes comentar esto si no es necesario.
    // setTimeout(() => fetchData(currentUnitId, true), 5000); 

    const intervalId = setInterval(() => {
      fetchData(currentUnitId, true);
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [currentUnitId, fetchData]);


  return (
    <div className="h-screen bg-background p-4 md:p-8 flex flex-col overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Left Column: Control Points */}
        <div className="md:col-span-8 flex flex-col gap-6 overflow-hidden">
          <RouteHeaderCard routeInfo={routeInfo} />
          <ControlPointsSection controlPoints={controlPoints} />
        </div>

        {/* Right Column: Units Ahead and Behind, Clock, Refresh Button */}
        <div className="md:col-span-4 flex flex-col gap-6 overflow-y-auto"> {/* Permitir scroll solo en esta columna si es necesario */}
          <DigitalClock currentTime={currentTime} />
          <UnitInfoCard unitDetails={unitAhead} />
          <UnitInfoCard unitDetails={unitBehind} />
           <Button
             onClick={handleManualRefresh}
             className="w-full bg-button-custom-dark-gray hover:bg-button-custom-dark-gray/90 text-primary-foreground mt-auto"
             disabled={isLoading}
           >
             {isLoading ? (
               <>
                 <RefreshCw size={18} className="mr-2 animate-spin" />
                 Refrescando...
               </>
             ) : (
               <>
                 <RefreshCw size={18} className="mr-2" />
                 Refrescar Datos
               </>
             )}
           </Button>
        </div>
      </div>
    </div>
  );
}
