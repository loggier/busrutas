
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { RouteInfo, ControlPoint } from '@/types';
import RouteDashboardClient from '@/components/client/RouteDashboardClient';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';

interface RawApiData {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: any; // Removed from use
  unitBehind: any; // Removed from use
}

export default function RouteSchedulePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);
  const [pageData, setPageData] = useState<{ routeInfo: RouteInfo; controlPoints: ControlPoint[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogoutAndRedirect = useCallback((message: string) => {
    localStorage.removeItem('currentUnitId');
    toast({
      title: 'Error de Sesión',
      description: message,
      variant: 'destructive',
    });
    router.push('/login');
  }, [router, toast]);
  
  const processRawDataForPage = useCallback((rawData: RawApiData, unitId: string): { routeInfo: RouteInfo; controlPoints: ControlPoint[] } | null => {
    if (!rawData || !rawData.routeInfo || !rawData.routeInfo.unitId) {
        console.warn(`No se encontraron datos de ruta para la unidad ${unitId}.`);
        return null;
    }
  
    const resolvedRouteInfo = rawData.routeInfo;
    const processedControlPoints = Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [];
    
    if (resolvedRouteInfo.currentDate && !/^\d{4}-\d{2}-\d{2}$/.test(resolvedRouteInfo.currentDate)) {
        resolvedRouteInfo.currentDate = new Date().toISOString().split('T')[0];
    }

    return {
      routeInfo: resolvedRouteInfo,
      controlPoints: processedControlPoints,
    };
  }, []);

  const fetchPageData = useCallback(async (unitIdToFetch: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://controlrutas.gpsplataforma.net/api/get_despacho/${unitIdToFetch}`);
      
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status} ${response.statusText}. La unidad podría no ser válida.`);
      }

      const rawData: RawApiData = await response.json();
      const processedData = processRawDataForPage(rawData, unitIdToFetch);

      if (processedData) {
        setPageData(processedData);
      } else {
        throw new Error("No se encontraron datos de despacho para la unidad.");
      }

    } catch (err) {
      console.error(`Error crítico al obtener datos para la unidad ${unitIdToFetch}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido.';
      handleLogoutAndRedirect(`No se pudo cargar la información. ${errorMessage} Por favor, inicie sesión de nuevo.`);
    } finally {
      setIsLoading(false);
    }
  }, [processRawDataForPage, handleLogoutAndRedirect]);

  useEffect(() => {
    const unitIdFromStorage = localStorage.getItem('currentUnitId');
    if (!unitIdFromStorage) {
      router.push('/login');
    } else {
      setCurrentUnitId(unitIdFromStorage);
      fetchPageData(unitIdFromStorage);
    }
  }, [router, fetchPageData]);

  if (isLoading || !currentUnitId || !pageData) {
    return (
      <div className="flex flex-col h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="flex-grow w-full" />
      </div>
    );
  }

  return (
    <RouteDashboardClient
      initialRouteInfo={pageData.routeInfo}
      initialControlPoints={pageData.controlPoints}
      currentUnitId={currentUnitId}
    />
  );
}
