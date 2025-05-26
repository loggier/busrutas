
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
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { EMPTY_UNIT_DETAILS } from '@/lib/constants';


// Define ProcessedApiData and RawApiData interfaces similar to page.tsx if needed for fetchData
// For simplicity, assuming fetchData will receive a structure that can be destructured or is already ProcessedApiData-like
interface RawApiDataForClient {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails | [];
  unitBehind: UnitDetails | [];
}

interface RouteDashboardClientProps {
  initialRouteInfo: RouteInfo;
  initialControlPoints: ControlPoint[];
  initialUnitAhead: UnitDetails;
  initialUnitBehind: UnitDetails;
  currentUnitId: string;
}

const AUTO_REFRESH_INTERVAL = 10000; // 10 segundos

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

  const processRawDataForClient = (rawData: RawApiDataForClient, unitId: string): { routeInfo: RouteInfo, controlPoints: ControlPoint[], unitAhead: UnitDetails, unitBehind: UnitDetails } => {
    if (!rawData.routeInfo) {
      throw new Error('routeInfo es requerido en la respuesta de la API.');
    }
    
    let processedUnitAhead: UnitDetails;
    let processedUnitBehind: UnitDetails;

    if (Array.isArray(rawData.unitAhead) && rawData.unitAhead.length === 0) {
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-client-${unitId}`, label: 'Adelante' };
       if (Array.isArray(rawData.controlPoints) && rawData.controlPoints.length === 0) {
        processedUnitAhead.unitIdentifier = rawData.routeInfo.unitId || 'N/A';
        processedUnitAhead.isPrimary = true;
      }
    } else if (typeof rawData.unitAhead === 'object' && rawData.unitAhead !== null && !Array.isArray(rawData.unitAhead)) {
      processedUnitAhead = rawData.unitAhead as UnitDetails;
    } else {
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-client-fallback-${unitId}`, label: 'Adelante' };
    }

    if (Array.isArray(rawData.unitBehind) && rawData.unitBehind.length === 0) {
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-client-${unitId}`, label: 'Atrás' };
    } else if (typeof rawData.unitBehind === 'object' && rawData.unitBehind !== null && !Array.isArray(rawData.unitBehind)) {
      processedUnitBehind = rawData.unitBehind as UnitDetails;
    } else {
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-client-fallback-${unitId}`, label: 'Atrás' };
    }

    const processedControlPoints = Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [];

    return {
      routeInfo: rawData.routeInfo,
      controlPoints: processedControlPoints,
      unitAhead: processedUnitAhead,
      unitBehind: processedUnitBehind,
    };
  };


  const fetchData = useCallback(async (unitId: string, isBackgroundRefresh: boolean = false) => {
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(`https://control.puntoexacto.ec/api/get_despacho/${unitId}`);
      if (!response.ok) {
        let errorBody = '';
        try { errorBody = await response.text(); } catch(e) { /* no-op */ }
        throw new Error(`Error al ${isBackgroundRefresh ? 'actualizar en segundo plano' : 'refrescar'}: ${response.status} ${response.statusText}. ${errorBody}`);
      }
      const rawData: RawApiDataForClient = await response.json();
      const processedData = processRawDataForClient(rawData, unitId);

      setRouteInfo(processedData.routeInfo);
      setControlPoints(processedData.controlPoints);
      setUnitAhead(processedData.unitAhead);
      setUnitBehind(processedData.unitBehind);

      if (!isBackgroundRefresh && processedData.controlPoints.length > 0) {
        toast({
          title: 'Datos Actualizados',
          description: 'La información del despacho ha sido refrescada.',
          variant: 'default',
        });
      } else if (!isBackgroundRefresh && processedData.controlPoints.length === 0) {
         toast({
          title: 'Información',
          description: 'La unidad no tiene despacho asignado actualmente.',
          variant: 'default', // Or a more neutral variant
        });
      }
    } catch (error) {
      console.error(`Error en fetchData (${isBackgroundRefresh ? 'background' : 'manual'}):`, error);
      const errorMessage = error instanceof Error ? error.message : `Error desconocido al ${isBackgroundRefresh ? 'actualizar en segundo plano' : 'refrescar'}.`;
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
    const intervalId = setInterval(() => {
      fetchData(currentUnitId, true);
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [currentUnitId, fetchData]);

  if (controlPoints.length === 0 && routeInfo) {
    return (
      <div className="h-screen bg-background p-4 md:p-8 flex flex-col">
        <div className="mb-6">
          <RouteHeaderCard routeInfo={routeInfo} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <Card className="shadow-xl w-full max-w-lg">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-primary mb-4" />
              <p className="text-xl font-semibold text-foreground">
                La unidad no tiene despacho asignado.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Intente refrescar los datos o contacte al administrador si cree que esto es un error.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 w-full max-w-sm mx-auto">
          <DigitalClock currentTime={currentTime} />
          <Button
            onClick={handleManualRefresh}
            className="w-full bg-button-custom-dark-gray hover:bg-button-custom-dark-gray/90 text-primary-foreground mt-4"
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
    );
  }

  return (
    <div className="h-screen bg-background p-4 md:p-8 flex flex-col overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden">
        <div className="md:col-span-8 flex flex-col gap-6 overflow-hidden">
          <RouteHeaderCard routeInfo={routeInfo} />
          <ControlPointsSection controlPoints={controlPoints} />
        </div>
        <div className="md:col-span-4 flex flex-col gap-6 overflow-y-auto">
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
