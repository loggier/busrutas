
'use client';

import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import ControlPointsTable from '@/components/control-points/ControlPointsTable';
import UnitInfoCard from '@/components/units/UnitInfoCard';
import { Card, CardContent } from '../ui/card';
import DigitalClock from '../common/DigitalClock';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';


interface RawApiDataForClient {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails | null;
  unitBehind: UnitDetails | null;
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

  const handleLogoutAndRedirect = useCallback((message: string) => {
    localStorage.removeItem('currentUnitId');
    toast({
      title: 'Error de Sesión',
      description: message,
      variant: 'destructive',
    });
    router.push('/login');
  }, [router, toast]);

  const processRawDataForClient = useCallback((rawData: any): ProcessedClientData | null => {
    if (!rawData || !rawData.routeInfo || !rawData.routeInfo.unitId) {
        return null;
    }

    const unitAheadData = (rawData.unitAhead && typeof rawData.unitAhead === 'object' && !Array.isArray(rawData.unitAhead) && Object.keys(rawData.unitAhead).length > 0) ? rawData.unitAhead : null;
    const unitBehindData = (rawData.unitBehind && typeof rawData.unitBehind === 'object' && !Array.isArray(rawData.unitBehind) && Object.keys(rawData.unitBehind).length > 0) ? rawData.unitBehind : null;

    return {
      routeInfo: rawData.routeInfo,
      controlPoints: Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [],
      unitAhead: unitAheadData,
      unitBehind: unitBehindData,
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
    <div className="dark h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <div className="p-4 flex-1 flex flex-col gap-4">
        <Card className="border-border bg-secondary">
          <CardContent className="p-2 flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-x-4 gap-y-2 text-xl flex-grow flex-nowrap">
              <div className="flex items-baseline gap-2">
                <span className="text-foreground">Ruta:</span>
                <span className="font-bold">{routeInfo.routeName}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-foreground">Fecha:</span>
                <span className="font-bold">{routeInfo.currentDate}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-foreground">Salida:</span>
                <span className="font-bold">{routeInfo.currentTime?.substring(0, 5)}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-foreground">Unidad:</span>
                <span className="font-bold">{routeInfo.unitId}</span>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <DigitalClock currentTime={currentTime} />
            </div>
          </CardContent>
        </Card>

        <main className="flex-1 overflow-y-auto">
          <ControlPointsTable controlPoints={controlPoints} />
        </main>
      </div>
    </div>
  );
}
