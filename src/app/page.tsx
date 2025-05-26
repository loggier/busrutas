
import RouteDashboardClient from '@/components/client/RouteDashboardClient';
import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
import {
  MOCK_ROUTE_INFO,
  MOCK_CONTROL_POINTS,
  MOCK_UNIT_AHEAD,
  MOCK_UNIT_BEHIND,
} from '@/lib/constants';

interface ApiData {
  routeInfo: RouteInfo;
  controlPoints: ControlPoint[];
  unitAhead: UnitDetails;
  unitBehind: UnitDetails;
}

async function getDespachoData(unitId: string): Promise<ApiData> {
  try {
    const response = await fetch(`https://control.puntoexacto.ec/api/get_despacho/${unitId}`);
    if (!response.ok) {
      // Intenta leer el cuerpo del error si es posible
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (e) {
        // No hacer nada si no se puede leer el cuerpo
      }
      throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorBody}`);
    }
    const data: ApiData = await response.json();
    
    // Validar estructura básica esperada (puedes hacer esto más robusto)
    if (!data.routeInfo || !data.controlPoints || !data.unitAhead || !data.unitBehind) {
        throw new Error('La respuesta de la API no tiene la estructura esperada.');
    }
    
    // Asegurarse de que currentDate en routeInfo está en formato YYYY-MM-DD si la API lo devuelve diferente
    if (data.routeInfo && typeof data.routeInfo.currentDate === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(data.routeInfo.currentDate)) {
        // Intenta convertir a YYYY-MM-DD o muestra una advertencia
        console.warn(`Formato de fecha inesperado de la API para routeInfo.currentDate: ${data.routeInfo.currentDate}. Se esperaba YYYY-MM-DD.`);
        // Aquí podrías intentar parsear y reformatear, o dejar que el componente lo maneje si está preparado.
        // Por ahora, se pasará tal cual lo devuelve la API.
    }

    return data;
  } catch (error) {
    console.error(`Error al obtener datos del despacho para la unidad ${unitId}:`, error);
    // Devolver datos mock como fallback
    return {
      routeInfo: MOCK_ROUTE_INFO,
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
