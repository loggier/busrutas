
'use client';

import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import HeaderNav from '@/components/common/HeaderNav';
import ControlPointsTable from '@/components/control-points/ControlPointsTable';
import UnitInfoCard from '@/components/units/UnitInfoCard';
import DigitalClock from '../common/DigitalClock';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

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

    // Safely process unit data
    const unitAhead = (rawData.unitAhead && typeof rawData.unitAhead === 'object' && !Array.isArray(rawData.unitAhead) && Object.keys(rawData.unitAhead).length > 0) ? rawData.unitAhead : null;
    const unitBehind = (rawData.unitBehind && typeof rawData.unitBehind === 'object' && !Array.isArray(rawData.unitBehind) && Object.keys(rawData.unitBehind).length > 0) ? rawData.unitBehind : null;

    return {
      routeInfo: rawData.routeInfo,
      controlPoints: Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [],
      unitAhead,
      unitBehind,
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
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <HeaderNav currentTime={currentTime} />
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Columna Izquierda - Info */}
        <div className="md:col-span-1 flex flex-col gap-4">
           <Card className="shadow-lg bg-card text-card-foreground">
                <CardHeader className="p-3">
                    <CardTitle className="text-lg">Información de Despacho</CardTitle>
                </CardHeader>
                <CardContent className="p-3 text-sm space-y-1">
                    <p><strong>Ruta:</strong> {routeInfo.routeName}</p>
                    <p><strong>Fecha:</strong> {routeInfo.currentDate}</p>
                    <p><strong>Salida:</strong> {routeInfo.currentTime?.substring(0, 5)}</p>
                    <p><strong>Unidad:</strong> {routeInfo.unitId}</p>
                    {routeInfo.totalAT != null && <p><strong>Adelanto Total:</strong> {routeInfo.totalAT} min</p>}
                    {routeInfo.totalAD != null && <p><strong>Atraso Total:</strong> {routeInfo.totalAD} min</p>}
                </CardContent>
            </Card>
        </div>

        {/* Columna Derecha - Tabla */}
        <main className="md:col-span-2 flex-1 overflow-y-auto">
          <ControlPointsTable controlPoints={controlPoints} />
        </main>
      </div>
    </div>
  );
}
