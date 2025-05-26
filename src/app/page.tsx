
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
      throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorBody}`);
    }
    const rawData: RawApiData = await response.json();
    
    if (!rawData.routeInfo) {
      console.error('API Error: routeInfo is missing. Falling back to MOCK_DATA.');
      return {
        routeInfo: MOCK_ROUTE_INFO,
        controlPoints: MOCK_CONTROL_POINTS,
        unitAhead: MOCK_UNIT_AHEAD,
        unitBehind: MOCK_UNIT_BEHIND,
      };
    }

    let processedUnitAhead: UnitDetails;
    let processedUnitBehind: UnitDetails;

    if (Array.isArray(rawData.unitAhead) && rawData.unitAhead.length === 0) {
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-initial-${unitId}`, label: 'Adelante' };
       // If it's the current unit and controlPoints are empty, unitAhead might represent the current unit's "empty" state
      if (Array.isArray(rawData.controlPoints) && rawData.controlPoints.length === 0) {
        processedUnitAhead.unitIdentifier = rawData.routeInfo.unitId || 'N/A';
        processedUnitAhead.isPrimary = true;
      }
    } else if (typeof rawData.unitAhead === 'object' && rawData.unitAhead !== null && !Array.isArray(rawData.unitAhead)) {
      processedUnitAhead = rawData.unitAhead as UnitDetails;
    } else {
      console.warn('API response for unitAhead is not a valid object or empty array, using default. Received:', rawData.unitAhead);
      processedUnitAhead = { ...EMPTY_UNIT_DETAILS, id: `empty-ahead-fallback-${unitId}`, label: 'Adelante' };
    }

    if (Array.isArray(rawData.unitBehind) && rawData.unitBehind.length === 0) {
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-initial-${unitId}`, label: 'Atrás' };
    } else if (typeof rawData.unitBehind === 'object' && rawData.unitBehind !== null && !Array.isArray(rawData.unitBehind)) {
      processedUnitBehind = rawData.unitBehind as UnitDetails;
    } else {
      console.warn('API response for unitBehind is not a valid object or empty array, using default. Received:', rawData.unitBehind);
      processedUnitBehind = { ...EMPTY_UNIT_DETAILS, id: `empty-behind-fallback-${unitId}`, label: 'Atrás' };
    }
    
    // Ensure controlPoints is an array
    const processedControlPoints = Array.isArray(rawData.controlPoints) ? rawData.controlPoints : [];

    const processedData: ProcessedApiData = {
      routeInfo: rawData.routeInfo,
      controlPoints: processedControlPoints,
      unitAhead: processedUnitAhead,
      unitBehind: processedUnitBehind,
    };
    
    // Asegurarse de que currentDate en routeInfo está en formato YYYY-MM-DD si la API lo devuelve diferente
    if (processedData.routeInfo && typeof processedData.routeInfo.currentDate === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(processedData.routeInfo.currentDate)) {
        console.warn(`Formato de fecha inesperado de la API para routeInfo.currentDate: ${processedData.routeInfo.currentDate}. Se esperaba YYYY-MM-DD.`);
    }

    return processedData;
  } catch (error) {
    console.error(`Error al obtener datos del despacho para la unidad ${unitId}:`, error);
    // Devolver datos mock como fallback
    return {
      routeInfo: MOCK_ROUTE_INFO,
      controlPoints: MOCK_CONTROL_POINTS, // Consider if MOCK_CONTROL_POINTS should be empty in some error cases
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
