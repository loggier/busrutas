
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
import { EMPTY_UNIT_DETAILS } from '@/lib/constants';


interface RawApiDataForClient {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails | [];
  unitBehind: UnitDetails | [];
}

interface ProcessedClientData {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails;
  unitBehind: UnitDetails;
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
  const [unitAheadDetails, setUnitAheadDetails] = useState<UnitDetails>(initialUnitAhead);
  const [unitBehindDetails, setUnitBehindDetails] = useState<UnitDetails>(initialUnitBehind);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const currentTime = useCurrentTime();

  const processRawDataForClient = useCallback((rawData: RawApiDataForClient, unitId: string): ProcessedClientData => {
    const resolvedRouteInfo = rawData.routeInfo || { 
        routeName: 'Error: Ruta Desconocida', 
        currentDate: new Date().toISOString().split('T')[0], 
        unitId: `Fallback Unidad ${unitId}`,
        totalAD: 0,
        totalAT: 0
      };
    
    let processedUnitAhead: UnitDetails;
    if (Array.isArray(rawData.unitAhead) && rawData.unitAhead.length === 0) {
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-client-api-${unitId}`, label: 'Adelante' };
    } else if (typeof rawData.unitAhead === 'object' && rawData.unitAhead !== null && !Array.isArray(rawData.unitAhead)) {
      processedUnitAhead = rawData.unitAhead as UnitDetails;
      if (!processedUnitAhead.label) processedUnitAhead.label = 'Adelante';
    } else {
      console.warn(`Client: API response for unitAhead (unidad ${unitId}) is not a valid object or empty array, using default. Received:`, rawData.unitAhead);
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-client-fallback-${unitId}`, label: 'Adelante' };
    }

    let processedUnitBehind: UnitDetails;
    if (Array.isArray(rawData.unitBehind) && rawData.unitBehind.length === 0) {
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-client-api-${unitId}`, label: 'Atrás' };
    } else if (typeof rawData.unitBehind === 'object' && rawData.unitBehind !== null && !Array.isArray(rawData.unitBehind)) {
      processedUnitBehind = rawData.unitBehind as UnitDetails;
      if (!processedUnitBehind.label) processedUnitBehind.label = 'Atrás';
    } else {
      console.warn(`Client: API response for unitBehind (unidad ${unitId}) is not a valid object or empty array, using default. Received:`, rawData.unitBehind);
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-client-fallback-${unitId}`, label: 'Atrás' };
    }

    const processedControlPoints = Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [];

    return {
      routeInfo: resolvedRouteInfo,
      controlPoints: processedControlPoints,
      unitAhead: processedUnitAhead,
      unitBehind: processedUnitBehind,
    };
  }, []);

  const updateClientData = (data: ProcessedClientData) => {
    setRouteInfo(data.routeInfo);
    setControlPoints(data.controlPoints);
    setUnitAheadDetails(data.unitAhead);
    setUnitBehindDetails(data.unitBehind);
  };

  const fetchData = useCallback(async (unitIdToFetch: string, isBackgroundRefresh: boolean = false) => {
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(`https://control.puntoexacto.ec/api/get_despacho/${unitIdToFetch}`);
      if (!response.ok) {
        let errorBody = '';
        try { errorBody = await response.text(); } catch(e) { /* no-op */ }
        throw new Error(`Error al ${isBackgroundRefresh ? 'actualizar en segundo plano' : 'refrescar'}: ${response.status} ${response.statusText}. ${errorBody}`);
      }
      const rawData: RawApiDataForClient = await response.json();
      const processedData = processRawDataForClient(rawData, unitIdToFetch);
      updateClientData(processedData);

      if (!isBackgroundRefresh) { 
        if (processedData.controlPoints.length > 0) {
          toast({
            title: 'Datos Actualizados',
            description: 'La información del despacho ha sido refrescada.',
            variant: 'default',
          });
        } else { 
           toast({
            title: 'Información',
            description: 'La unidad no tiene despacho asignado actualmente.',
            variant: 'default',
          });
        }
      }
    } catch (error) {
      console.error(`Error en fetchData (${isBackgroundRefresh ? 'background' : 'manual'}):`, error);
      if (!isBackgroundRefresh) { 
        const errorMessage = error instanceof Error ? error.message : `Error desconocido al refrescar.`;
        toast({
          title: `Error al Refrescar`,
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoading(false);
      }
    }
  }, [toast, processRawDataForClient]); 

  const handleManualRefresh = useCallback(() => {
    fetchData(currentUnitId, false);
  }, [currentUnitId, fetchData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData(currentUnitId, true); 
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [currentUnitId, fetchData]);

  // Update state if initial props change (e.g., after initial load in page.tsx)
  useEffect(() => {
    setRouteInfo(initialRouteInfo);
    setControlPoints(initialControlPoints);
    setUnitAheadDetails(initialUnitAhead);
    setUnitBehindDetails(initialUnitBehind);
  }, [initialRouteInfo, initialControlPoints, initialUnitAhead, initialUnitBehind]);


  return (
    <div className="h-screen bg-background p-1 sm:p-2 md:p-3 flex flex-col overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 md:gap-4 flex-1 overflow-hidden">
        <div className="md:col-span-8 flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-hidden">
          <RouteHeaderCard routeInfo={routeInfo} />
          <ControlPointsSection controlPoints={controlPoints} />
        </div>

        <div className="md:col-span-4 flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-y-auto">
          <DigitalClock currentTime={currentTime} />
          <UnitInfoCard unitDetails={unitAheadDetails} />
          <UnitInfoCard unitDetails={unitBehindDetails} />
           <Button
             onClick={handleManualRefresh}
             className="w-full bg-button-custom-dark-gray hover:bg-button-custom-dark-gray/90 text-primary-foreground mt-auto py-1.5 sm:py-2"
             disabled={isLoading}
           >
             {isLoading ? (
               <>
                 <RefreshCw size={14} className="mr-2 animate-spin" />
                 Refrescando...
               </>
             ) : (
               <>
                 <RefreshCw size={14} className="mr-2" />
                 Refrescar Datos
               </>
             )}
           </Button>
        </div>
      </div>
    </div>
  );
}
