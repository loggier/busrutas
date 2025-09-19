
'use client';

import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import ControlPointsSection from '@/components/control-points/ControlPointsSection';
import DigitalClock from '@/components/common/DigitalClock';
import UnitInfoCard from '@/components/units/UnitInfoCard';
import { Button } from '@/components/ui/button';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

interface RawApiDataForClient {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails | [] | null;
  unitBehind: UnitDetails | [] | null;
}

interface ProcessedClientData {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails | null;
  unitBehind: UnitDetails | null;
}

interface RouteDashboardClientProps {
  initialRouteInfo: RouteInfo;
  initialControlPoints: ControlPoint[];
  initialUnitAhead: UnitDetails | null;
  initialUnitBehind: UnitDetails | null;
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
  const [unitAhead, setUnitAhead] = useState<UnitDetails | null>(initialUnitAhead);
  const [unitBehind, setUnitBehind] = useState<UnitDetails | null>(initialUnitBehind);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const currentTime = useCurrentTime();

  let displayDate = routeInfo.currentDate;
  if (routeInfo.currentDate && /^\d{4}-\d{2}-\d{2}$/.test(routeInfo.currentDate)) {
    try {
      const dateObject = parseISO(routeInfo.currentDate + 'T00:00:00'); // Add time to avoid timezone issues
      if (isValid(dateObject)) {
        displayDate = format(dateObject, "dd/MM/yyyy", { locale: es });
      } else {
        console.warn("RouteDashboardClient: Parsed date is invalid:", routeInfo.currentDate);
      }
    } catch (error) {
      console.warn("RouteDashboardClient: Could not parse routeInfo.currentDate:", routeInfo.currentDate, error);
    }
  } else if (routeInfo.currentDate) {
     console.warn("RouteDashboardClient: routeInfo.currentDate is not in YYYY-MM-DD format:", routeInfo.currentDate);
  }

  const displayTime = routeInfo.currentTime && /^\d{2}:\d{2}:\d{2}$/.test(routeInfo.currentTime)
    ? routeInfo.currentTime.substring(0, 5)
    : null;


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
    
    const unitAhead = rawData.unitAhead && !Array.isArray(rawData.unitAhead) ? rawData.unitAhead : null;
    const unitBehind = rawData.unitBehind && !Array.isArray(rawData.unitBehind) ? rawData.unitBehind : null;

    return {
      routeInfo: resolvedRouteInfo,
      controlPoints: processedControlPoints,
      unitAhead,
      unitBehind
    };
  }, []);

  const updateClientData = (data: ProcessedClientData) => {
    setRouteInfo(data.routeInfo);
    setControlPoints(data.controlPoints);
    setUnitAhead(data.unitAhead);
    setUnitBehind(data.unitBehind);
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
    setUnitAhead(initialUnitAhead);
    setUnitBehind(initialUnitBehind);
  }, [initialRouteInfo, initialControlPoints, initialUnitAhead, initialUnitBehind]);


  return (
    <div className="h-screen bg-background p-1 sm:p-2 md:p-3 flex flex-col overflow-hidden">
      {/* Columns Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 md:gap-4 flex-1 overflow-hidden">

        {/* Left Column */}
        <div className="md:col-span-4 flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-y-auto">
          
          <DigitalClock currentTime={currentTime} />

          <div className="p-3 sm:p-4 bg-card shadow-xl rounded-lg border border-primary/20">
            <div className="text-left">
              <h1 className="text-lg font-bold text-foreground tracking-wide">{routeInfo.routeName}</h1>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">{displayDate}</span>
                {displayTime && <span className="font-semibold ml-2">{displayTime}</span>}
              </p>
              <p className="text-base font-medium mt-1 text-primary">{routeInfo.unitId}</p>
              {(typeof routeInfo.totalAT === 'number' || typeof routeInfo.totalAD === 'number') && (
                <div className="flex gap-4 text-xs mt-1">
                  {typeof routeInfo.totalAT === 'number' && routeInfo.totalAT > 0 && (
                    <p>
                      Retraso: <span className="font-semibold text-destructive">{routeInfo.totalAT} min</span>
                    </p>
                  )}
                  {typeof routeInfo.totalAD === 'number' && routeInfo.totalAD > 0 && (
                    <p>
                      Adelanto: <span className="font-semibold text-green-500">{routeInfo.totalAD} min</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <UnitInfoCard title="Unidad de Adelante" unit={unitAhead} />
          <UnitInfoCard title="Unidad de Atrás" unit={unitBehind} />

           <Button
             onClick={handleManualRefresh}
             className="w-full bg-button-custom-dark-gray hover:bg-button-custom-dark-gray/90 text-primary-foreground mt-auto py-3 sm:py-4 text-base"
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
