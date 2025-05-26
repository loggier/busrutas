
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
import RouteDashboardClient from '@/components/client/RouteDashboardClient';
import { MOCK_ROUTE_INFO, MOCK_CONTROL_POINTS, MOCK_UNIT_AHEAD, MOCK_UNIT_BEHIND, EMPTY_UNIT_DETAILS } from '@/lib/constants';
import { Skeleton } from "@/components/ui/skeleton"; // Para el estado de carga

// Representa la estructura de datos después del procesamiento del cliente
interface ProcessedClientData {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails;
  unitBehind: UnitDetails;
}

// Representa la estructura cruda de la API, donde unitAhead/Behind podrían ser []
interface RawApiData {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails | []; // La API puede devolver un array vacío
  unitBehind: UnitDetails | []; // La API puede devolver un array vacío
}


export default function RouteSchedulePage() {
  const router = useRouter();
  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);
  const [pageData, setPageData] = useState<ProcessedClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processRawDataForPage = useCallback((rawData: RawApiData, unitId: string): ProcessedClientData => {
    const resolvedRouteInfo = rawData.routeInfo || {
      ...MOCK_ROUTE_INFO,
      unitId: `Fallback Unidad ${unitId}`,
      routeName: 'Error: Ruta Desconocida',
      currentDate: new Date().toISOString().split('T')[0],
    };

    let processedUnitAhead: UnitDetails;
    if (Array.isArray(rawData.unitAhead) && rawData.unitAhead.length === 0) {
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-api-${unitId}`, label: 'Adelante' };
    } else if (typeof rawData.unitAhead === 'object' && rawData.unitAhead !== null && !Array.isArray(rawData.unitAhead)) {
      processedUnitAhead = rawData.unitAhead as UnitDetails;
      if (!processedUnitAhead.label) processedUnitAhead.label = 'Adelante';
    } else {
      console.warn(`API response for unitAhead (unidad ${unitId}) is not a valid object or empty array, using default. Received:`, rawData.unitAhead);
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-fallback-api-${unitId}`, label: 'Adelante' };
    }

    let processedUnitBehind: UnitDetails;
    if (Array.isArray(rawData.unitBehind) && rawData.unitBehind.length === 0) {
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-api-${unitId}`, label: 'Atrás' };
    } else if (typeof rawData.unitBehind === 'object' && rawData.unitBehind !== null && !Array.isArray(rawData.unitBehind)) {
      processedUnitBehind = rawData.unitBehind as UnitDetails;
      if (!processedUnitBehind.label) processedUnitBehind.label = 'Atrás';
    } else {
      console.warn(`API response for unitBehind (unidad ${unitId}) is not a valid object or empty array, using default. Received:`, rawData.unitBehind);
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-fallback-api-${unitId}`, label: 'Atrás' };
    }
    
    const processedControlPoints = Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [];
    
    // Asegurarse que la fecha esté en formato YYYY-MM-DD si viene de la API
    if (resolvedRouteInfo.currentDate && !/^\d{4}-\d{2}-\d{2}$/.test(resolvedRouteInfo.currentDate)) {
        console.warn(`Formato de fecha inesperado para routeInfo.currentDate: ${resolvedRouteInfo.currentDate}. Se esperaba YYYY-MM-DD. Usando fecha actual.`);
        resolvedRouteInfo.currentDate = new Date().toISOString().split('T')[0];
    }


    return {
      routeInfo: resolvedRouteInfo,
      controlPoints: processedControlPoints,
      unitAhead: processedUnitAhead,
      unitBehind: processedUnitBehind,
    };
  }, []);

  const fetchPageData = useCallback(async (unitIdToFetch: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://control.puntoexacto.ec/api/get_despacho/${unitIdToFetch}`);
      if (!response.ok) {
        let errorBody = '';
        try { errorBody = await response.text(); } catch (e) { /* no-op */ }
        console.error(`Error de API al obtener datos para ${unitIdToFetch}: ${response.status} ${response.statusText}. ${errorBody}`);
        throw new Error(`Error de API: ${response.statusText}`);
      }
      const rawData: RawApiData = await response.json();
      const processedData = processRawDataForPage(rawData, unitIdToFetch);
      setPageData(processedData);
    } catch (err) {
      console.error(`Error crítico al obtener datos del despacho para la unidad ${unitIdToFetch}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`No se pudo cargar la información del despacho: ${errorMessage}. Usando datos de demostración.`);
      // Fallback a MOCK_DATA en caso de error crítico
      setPageData({
        routeInfo: { ...MOCK_ROUTE_INFO, unitId: `Error Unidad ${unitIdToFetch}` },
        controlPoints: MOCK_CONTROL_POINTS,
        unitAhead: MOCK_UNIT_AHEAD,
        unitBehind: MOCK_UNIT_BEHIND,
      });
    } finally {
      setIsLoading(false);
    }
  }, [processRawDataForPage]);

  useEffect(() => {
    const unitIdFromStorage = localStorage.getItem('currentUnitId');
    if (!unitIdFromStorage) {
      router.push('/login');
    } else {
      setCurrentUnitId(unitIdFromStorage);
      fetchPageData(unitIdFromStorage);
    }
  }, [router, fetchPageData]);


  if (isLoading || !currentUnitId) {
    // Mostrar un esqueleto o spinner de carga más elaborado si se desea
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="space-y-4 w-full max-w-4xl">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-4 space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !pageData) { // Si hay error y no hay datos (ni siquiera de mock)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4 text-destructive">
        Error: {error}
      </div>
    );
  }
  
  // Si hay un error pero tenemos pageData (mock data), mostramos el dashboard con una advertencia/toast
  if (error && pageData) {
     console.warn("Mostrando datos de MOCK debido a error en API:", error);
     // El toast de error se podría manejar aquí o dentro de RouteDashboardClient si se pasa el error
  }


  if (!pageData) {
    // Este caso no debería ocurrir si isLoading es false y no hay error, pero es un fallback.
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            No hay datos para mostrar.
        </div>
    );
  }


  return (
    <RouteDashboardClient
      initialRouteInfo={pageData.routeInfo}
      initialControlPoints={pageData.controlPoints}
      initialUnitAhead={pageData.unitAhead}
      initialUnitBehind={pageData.unitBehind}
      currentUnitId={currentUnitId} // Pasar el unitId
    />
  );
}
