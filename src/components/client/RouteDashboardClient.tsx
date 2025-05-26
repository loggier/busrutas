'use client';

import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useState, useCallback }  from 'react';
import RouteHeaderCard from '@/components/route/RouteHeaderCard';
import ControlPointsSection from '@/components/control-points/ControlPointsSection';
import UnitInfoCard from '@/components/units/UnitInfoCard';
import DigitalClock from '@/components/common/DigitalClock';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RouteDashboardClientProps {
  initialRouteInfo: RouteInfo;
  initialControlPoints: ControlPoint[];
  initialUnitAhead: UnitDetails;
  initialUnitBehind: UnitDetails;
  historicalData?: string; // Prop hecha opcional
}

export default function RouteDashboardClient({
  initialRouteInfo,
  initialControlPoints,
  initialUnitAhead,
  initialUnitBehind,
  // historicalData, // Prop opcional, actualmente no usada directamente en la UI
}: RouteDashboardClientProps) {
  const [routeInfo] = useState<RouteInfo>(initialRouteInfo);
  const [controlPoints] = useState<ControlPoint[]>(initialControlPoints);
  const [unitAhead] = useState<UnitDetails>(initialUnitAhead);
  const [unitBehind] = useState<UnitDetails>(initialUnitBehind);

  const currentTime = useCurrentTime();

  const handleManualRefresh = useCallback(() => {
    console.log("Datos refrescados manualmente (placeholder)");
    // Aquí podrías añadir lógica para volver a obtener datos de una API si fuera necesario
  }, []);

  return (
    <div className="h-screen bg-background p-4 md:p-8 flex flex-col overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Left Column: Control Points */}
        <div className="md:col-span-8 flex flex-col gap-6 overflow-hidden">
          <RouteHeaderCard routeInfo={routeInfo} />
          <ControlPointsSection controlPoints={controlPoints} />
        </div>

        {/* Right Column: Units Ahead and Behind, Clock, Refresh Button */}
        <div className="md:col-span-4 flex flex-col gap-6 overflow-y-auto">
          <DigitalClock currentTime={currentTime} />
          <UnitInfoCard unitDetails={unitAhead} />
          <UnitInfoCard unitDetails={unitBehind} />
           <Button
             onClick={handleManualRefresh}
             className="w-full bg-button-custom-dark-gray hover:bg-button-custom-dark-gray/90 text-primary-foreground mt-auto"
           >
             <RefreshCw size={18} className="mr-2" />
             Refrescar Datos
           </Button>
        </div>
      </div>
    </div>
  );
}
