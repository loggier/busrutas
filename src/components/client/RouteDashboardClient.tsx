
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
      // En un caso real, esto podría venir de MOCK_ROUTE_INFO si la API falla completamente
      // o se podría lanzar un error más específico si routeInfo es crucial.
      console.error('API Error: routeInfo is missing in processRawDataForClient. Using potentially incomplete data.');
      // Devolvemos un objeto RouteInfo vacío o con valores por defecto para evitar errores de renderizado.
      const fallbackRouteInfo: RouteInfo = { 
        routeName: 'Error: Ruta Desconocida', 
        currentDate: new Date().toISOString().split('T')[0], 
        unitId: unitId,
        totalAD: 0,
        totalAT: 0
      };
       return {
        routeInfo: rawData.routeInfo || fallbackRouteInfo, // Usar fallback si rawData.routeInfo es undefined
        controlPoints: Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [],
        unitAhead: { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-client-critical-fallback-${unitId}`, label: 'Adelante', unitIdentifier: rawData.routeInfo?.unitId || 'N/A', isPrimary: true },
        unitBehind: { ...EMPTY_UNIT_DETAILS, id: `empty-behind-client-critical-fallback-${unitId}`, label: 'Atrás' },
      };
    }
    
    let processedUnitAhead: UnitDetails;
    let processedUnitBehind: UnitDetails;

    if (Array.isArray(rawData.unitAhead) && rawData.unitAhead.length === 0) {
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-client-${unitId}`, label: 'Adelante' }; // Etiqueta original
       // Si no hay puntos de control, la tarjeta 'unitAhead' representa la unidad actual.
      if (Array.isArray(rawData.controlPoints) && rawData.controlPoints.length === 0) {
        processedUnitAhead.unitIdentifier = rawData.routeInfo.unitId || 'N/A';
        processedUnitAhead.isPrimary = true; // Resaltar como unidad principal
        // Podríamos considerar cambiar el 'label' aquí si queremos que diga "Unidad Actual"
        // processedUnitAhead.label = "Unidad Actual"; 
      }
    } else if (typeof rawData.unitAhead === 'object' && rawData.unitAhead !== null && !Array.isArray(rawData.unitAhead)) {
      processedUnitAhead = rawData.unitAhead as UnitDetails;
    } else {
      console.warn('API response for unitAhead is not a valid object or empty array, using default. Received:', rawData.unitAhead);
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-client-fallback-${unitId}`, label: 'Adelante' };
      if (Array.isArray(rawData.controlPoints) && rawData.controlPoints.length === 0 && rawData.routeInfo) {
        processedUnitAhead.unitIdentifier = rawData.routeInfo.unitId || 'N/A';
        processedUnitAhead.isPrimary = true;
      }
    }

    if (Array.isArray(rawData.unitBehind) && rawData.unitBehind.length === 0) {
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-client-${unitId}`, label: 'Atrás' };
    } else if (typeof rawData.unitBehind === 'object' && rawData.unitBehind !== null && !Array.isArray(rawData.unitBehind)) {
      processedUnitBehind = rawData.unitBehind as UnitDetails;
    } else {
      console.warn('API response for unitBehind is not a valid object or empty array, using default. Received:', rawData.unitBehind);
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


  const fetchData = useCallback(async (unitIdToFetch: string, isBackgroundRefresh: boolean = false) => {
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(`https://control.puntoexacto.ec/api/get_despacho/${unitIdToFetch}`);
      if (!response.ok) {
        let errorBody = '';
        try { errorBody = await response.text(); } catch(e) { /* no-op */ }
        // Si el error es por no encontrar despacho, la API podría devolver un 404 o una estructura específica.
        // Aquí asumimos que un !response.ok es un error genérico de API.
        // El manejo de "no despacho" se hace por la estructura de datos (controlPoints vacío).
        throw new Error(`Error al ${isBackgroundRefresh ? 'actualizar en segundo plano' : 'refrescar'}: ${response.status} ${response.statusText}. ${errorBody}`);
      }
      const rawData: RawApiDataForClient = await response.json();
      const processedData = processRawDataForClient(rawData, unitIdToFetch);

      setRouteInfo(processedData.routeInfo);
      setControlPoints(processedData.controlPoints);
      setUnitAhead(processedData.unitAhead);
      setUnitBehind(processedData.unitBehind);

      if (!isBackgroundRefresh) { // Solo mostrar toast en refresco manual
        if (processedData.controlPoints.length > 0) {
          toast({
            title: 'Datos Actualizados',
            description: 'La información del despacho ha sido refrescada.',
            variant: 'default',
          });
        } else { // No hay puntos de control, significa que no hay despacho
           toast({
            title: 'Información',
            description: 'La unidad no tiene despacho asignado actualmente.',
            variant: 'default',
          });
        }
      }
    } catch (error) {
      console.error(`Error en fetchData (${isBackgroundRefresh ? 'background' : 'manual'}):`, error);
      // No mostrar toast de error si es un error esperado de "no encontrado" que ya se maneja con el mensaje en UI.
      // Solo mostrar toast de error para fallos inesperados de la API o de red.
      if (!isBackgroundRefresh) { // Solo mostrar toast de error en refresco manual
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
  }, [toast]); // No necesitamos currentUnitId aquí como dependencia, usamos el que se pasa a fetchData.

  const handleManualRefresh = useCallback(() => {
    fetchData(currentUnitId, false);
  }, [currentUnitId, fetchData]);

  useEffect(() => {
    // Carga inicial de datos ya se hace en page.tsx (Server Component)
    // Este efecto es solo para el auto-refresco
    const intervalId = setInterval(() => {
      fetchData(currentUnitId, true); // isBackgroundRefresh = true
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [currentUnitId, fetchData]);


  return (
    <div className="h-screen bg-background p-4 md:p-8 flex flex-col overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Columna Izquierda: Información de Ruta y Puntos de Control */}
        <div className="md:col-span-8 flex flex-col gap-6 overflow-hidden">
          <RouteHeaderCard routeInfo={routeInfo} />
          <ControlPointsSection controlPoints={controlPoints} />
        </div>

        {/* Columna Derecha: Reloj, Unidades Adicionales y Botón de Refresco */}
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
