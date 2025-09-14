
'use client';

import type { RouteInfo, ControlPoint } from '@/types';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import RouteHeaderCard from '@/components/route/RouteHeaderCard';
import ControlPointsSection from '@/components/control-points/ControlPointsSection';
import DigitalClock from '@/components/common/DigitalClock';
import { Button } from '@/components/ui/button';

interface RawApiDataForClient {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: any | [];
  unitBehind: any | [];
}

interface ProcessedClientData {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
}

interface RouteDashboardClientProps {
  initialRouteInfo: RouteInfo;
  initialControlPoints: ControlPoint[];
  currentUnitId: string;
}

const AUTO_REFRESH_INTERVAL = 10000; // 10 segundos

export default function RouteDashboardClient({
  initialRouteInfo,
  initialControlPoints,
  currentUnitId,
}: RouteDashboardClientProps) {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(initialRouteInfo);
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>(initialControlPoints);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const currentTime = useCurrentTime();

  const handleLogoutAndRedirect = useCallback((message: string) => {
    localStorage.removeItem('currentUnitId');
    toast({
      title: 'Error de Sesión',
      description: message,
      variant: 'destructive',
    });
    router.push('/login');
  }, [router, toast]);

  const processRawDataForClient = useCallback((rawData: RawApiDataForClient): ProcessedClientData | null => {
    if (!rawData.routeInfo || !rawData.routeInfo.unitId) {
        return null;
    }
  
    const resolvedRouteInfo = rawData.routeInfo;
    const processedControlPoints = Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [];

    return {
      routeInfo: resolvedRouteInfo,
      controlPoints: processedControlPoints,
    };
  }, []);

  const updateClientData = (data: ProcessedClientData) => {
    setRouteInfo(data.routeInfo);
    setControlPoints(data.controlPoints);
  };

  const fetchData = useCallback(async (unitIdToFetch: string, isBackgroundRefresh: boolean = false) => {
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(`https://controlrutas.gpsplataforma.net/api/get_despacho/${unitIdToFetch}`);
      if (!response.ok) {
        throw new Error(`Error de API (${response.status})`);
      }
      const rawData: RawApiDataForClient = await response.json();
      const processedData = processRawDataForClient(rawData);

      if(processedData) {
        updateClientData(processedData);
        if (!isBackgroundRefresh) { 
          toast({
            title: 'Datos Actualizados',
            description: 'La información del despacho ha sido refrescada.',
            variant: 'default',
          });
        }
      } else {
        throw new Error("Los datos recibidos no son válidos.");
      }
    } catch (error) {
      console.error(`Error en fetchData (${isBackgroundRefresh ? 'background' : 'manual'}):`, error);
      const errorMessage = error instanceof Error ? error.message : `Error desconocido.`;
      handleLogoutAndRedirect(`La sesión ha expirado o los datos son inválidos. ${errorMessage}`);
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoading(false);
      }
    }
  }, [toast, processRawDataForClient, handleLogoutAndRedirect]); 

  const handleManualRefresh = useCallback(() => {
    fetchData(currentUnitId, false);
  }, [currentUnitId, fetchData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData(currentUnitId, true); 
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [currentUnitId, fetchData]);

  useEffect(() => {
    setRouteInfo(initialRouteInfo);
    setControlPoints(initialControlPoints);
  }, [initialRouteInfo, initialControlPoints]);


  return (
    <div className="h-screen bg-background p-1 sm:p-2 md:p-3 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="mb-2 sm:mb-3 md:mb-4">
        <RouteHeaderCard routeInfo={routeInfo} />
      </div>

      {/* Columns Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 md:gap-4 flex-1 overflow-hidden">
        
        {/* Left Column */}
        <div className="md:col-span-4 flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-y-auto">
          <DigitalClock currentTime={currentTime} />
           <Button
             onClick={handleManualRefresh}
             className="w-full bg-button-custom-dark-gray hover:bg-button-custom-dark-gray/90 text-primary-foreground mt-auto py-3 sm:py-4 text-3xl"
             disabled={isLoading}
           >
             {isLoading ? 'Actualizando...' : 'Actualizar'}
           </Button>
        </div>

        {/* Right Column */}
        <div className="md:col-span-8 flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-hidden">
          <ControlPointsSection controlPoints={controlPoints} />
        </div>

      </div>
    </div>
  );
}
