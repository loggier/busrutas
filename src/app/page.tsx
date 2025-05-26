import RouteDashboardClient from '@/components/client/RouteDashboardClient';
import {
  MOCK_ROUTE_INFO,
  MOCK_CONTROL_POINTS,
  MOCK_UNIT_AHEAD,
  MOCK_UNIT_BEHIND,
  // MOCK_HISTORICAL_DATA // Ya no se importa ni se pasa
} from '@/lib/constants';

// This page will be a Server Component by default
export default async function RouteSchedulePage() {
  // In a real application, this data would be fetched from a database or API
  const routeInfo = MOCK_ROUTE_INFO;
  const controlPoints = MOCK_CONTROL_POINTS;
  const unitAhead = MOCK_UNIT_AHEAD;
  const unitBehind = MOCK_UNIT_BEHIND;
  // const historicalData = MOCK_HISTORICAL_DATA; // Ya no se usa

  return (
    <RouteDashboardClient
      initialRouteInfo={routeInfo}
      initialControlPoints={controlPoints}
      initialUnitAhead={unitAhead}
      initialUnitBehind={unitBehind}
      // historicalData prop ya no se pasa
    />
  );
}
