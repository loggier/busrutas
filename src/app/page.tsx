
import RouteDashboardClient from '@/components/client/RouteDashboardClient';
import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
import {
  MOCK_ROUTE_INFO,
  MOCK_CONTROL_POINTS,
  MOCK_UNIT_AHEAD,
  MOCK_UNIT_BEHIND,
  EMPTY_UNIT_DETAILS,
} from '@/lib/constants';

// This interface represents the expected structure after processing
interface ProcessedApiData {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails;
  unitBehind: UnitDetails;
}

// This interface can represent the raw structure from the API, where unitAhead/Behind might be []
interface RawApiData {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails | [];
  unitBehind: UnitDetails | [];
}


async function getDespachoData(unitId: string): Promise<ProcessedApiData> {
  try {
    const response = await fetch(`https://control.puntoexacto.ec/api/get_despacho/${unitId}`);
    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (e) { /* no-op */ }
      console.error(`Error de API al obtener datos para ${unitId}: ${response.status} ${response.statusText}. ${errorBody}`);
      // Fallback a MOCK_DATA si la API falla y no hay routeInfo
      return {
        routeInfo: { ...MOCK_ROUTE_INFO, unitId: `Error Unidad ${unitId}` },
        controlPoints: MOCK_CONTROL_POINTS, // O [] si prefieres
        unitAhead: MOCK_UNIT_AHEAD,
        unitBehind: MOCK_UNIT_BEHIND,
      };
    }
    const rawData: RawApiData = await response.json();
    
    // Fallback si routeInfo no viene, aunque la API haya respondido OK.
    if (!rawData.routeInfo) {
      console.error(`API Error: routeInfo es nulo o indefinido para la unidad ${unitId} a pesar de respuesta OK. Usando MOCK_ROUTE_INFO.`);
      return {
        routeInfo: { ...MOCK_ROUTE_INFO, unitId: `Fallback Unidad ${unitId}` },
        controlPoints: Array.isArray(rawData.controlPoints) ? rawData.controlPoints : MOCK_CONTROL_POINTS,
        unitAhead: MOCK_UNIT_AHEAD, // Asumimos que si routeInfo falla, el resto también podría
        unitBehind: MOCK_UNIT_BEHIND,
      };
    }

    let processedUnitAhead: UnitDetails;
    let processedUnitBehind: UnitDetails;

    // Procesar unitAhead
    if (Array.isArray(rawData.unitAhead) && rawData.unitAhead.length === 0) {
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-api-${unitId}`, label: 'Adelante' };
    } else if (typeof rawData.unitAhead === 'object' && rawData.unitAhead !== null && !Array.isArray(rawData.unitAhead)) {
      processedUnitAhead = rawData.unitAhead as UnitDetails;
      if (!processedUnitAhead.label) processedUnitAhead.label = 'Adelante'; // Asegurar etiqueta por defecto
    } else {
      console.warn(`API response for unitAhead (unidad ${unitId}) is not a valid object or empty array, using default. Received:`, rawData.unitAhead);
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-fallback-api-${unitId}`, label: 'Adelante' };
    }

    // Procesar unitBehind
    if (Array.isArray(rawData.unitBehind) && rawData.unitBehind.length === 0) {
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-api-${unitId}`, label: 'Atrás' };
    } else if (typeof rawData.unitBehind === 'object' && rawData.unitBehind !== null && !Array.isArray(rawData.unitBehind)) {
      processedUnitBehind = rawData.unitBehind as UnitDetails;
      if (!processedUnitBehind.label) processedUnitBehind.label = 'Atrás'; // Asegurar etiqueta por defecto
    } else {
      console.warn(`API response for unitBehind (unidad ${unitId}) is not a valid object or empty array, using default. Received:`, rawData.unitBehind);
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-fallback-api-${unitId}`, label: 'Atrás' };
    }
    
    const processedControlPoints = Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [];

    const processedData: ProcessedApiData = {
      routeInfo: rawData.routeInfo,
      controlPoints: processedControlPoints,
      unitAhead: processedUnitAhead,
      unitBehind: processedUnitBehind,
    };
    
    if (processedData.routeInfo && typeof processedData.routeInfo.currentDate === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(processedData.routeInfo.currentDate)) {
        console.warn(`Formato de fecha inesperado de la API para routeInfo.currentDate: ${processedData.routeInfo.currentDate}. Se esperaba YYYY-MM-DD.`);
    }

    return processedData;
  } catch (error) {
    console.error(`Error crítico al obtener datos del despacho para la unidad ${unitId}:`, error);
    return {
      routeInfo: { ...MOCK_ROUTE_INFO, unitId: `Error Crítico Unidad ${unitId}` },
      controlPoints: MOCK_CONTROL_POINTS,
      unitAhead: MOCK_UNIT_AHEAD,
      unitBehind: MOCK_UNIT_BEHIND,
    };
  }
}

export default async function RouteSchedulePage() {
  const unitId = "1875"; // ID de unidad para la carga inicial
  const apiData = await getDespachoData(unitId);

  return (
    <RouteDashboardClient
      initialRouteInfo={apiData.routeInfo}
      initialControlPoints={apiData.controlPoints}
      initialUnitAhead={apiData.unitAhead}
      initialUnitBehind={apiData.unitBehind}
      currentUnitId={unitId}
    />
  );
}
