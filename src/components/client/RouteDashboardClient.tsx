'use client';

import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
// import { predictETA, type PredictETAInput } from '@/ai/flows/predict-eta'; // ETA functionality removed
import { useCurrentTime } from '@/hooks/use-current-time';
import { useState, useEffect, useCallback }  from 'react';
import RouteHeaderCard from '@/components/route/RouteHeaderCard';
import ControlPointsSection from '@/components/control-points/ControlPointsSection';
import UnitInfoCard from '@/components/units/UnitInfoCard';
// import { useToast } from "@/hooks/use-toast"; // Toast for ETA removed
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RouteDashboardClientProps {
  initialRouteInfo: RouteInfo;
  initialControlPoints: ControlPoint[];
  initialUnitAhead: UnitDetails;
  initialUnitBehind: UnitDetails;
  historicalData: string; // Kept for potential future use, but not used now
}

export default function RouteDashboardClient({
  initialRouteInfo,
  initialControlPoints,
  initialUnitAhead,
  initialUnitBehind,
  // historicalData, // Not used for now
}: RouteDashboardClientProps) {
  const [routeInfo] = useState<RouteInfo>(initialRouteInfo);
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>(initialControlPoints);
  const [unitAhead] = useState<UnitDetails>(initialUnitAhead);
  const [unitBehind] = useState<UnitDetails>(initialUnitBehind);
  // const [isLoadingEta, setIsLoadingEta] = useState<boolean>(false); // ETA functionality removed
  // const { toast } = useToast(); // Toast for ETA removed

  const currentTime = useCurrentTime(); // Updates every 10 seconds by default

  // ETA Fetching logic removed
  const handleManualRefresh = useCallback(() => {
    // Placeholder for any manual refresh logic if needed in the future,
    // for now, it might just re-render or re-fetch basic data if applicable.
    // console.log("Manual refresh triggered at:", currentTime.toLocaleTimeString());
    // For now, let's just simulate a loading state for the button if clicked
    // setIsLoadingEta(true); // If we had a loading state for other things
    // setTimeout(() => setIsLoadingEta(false), 1000); // Simulate loading
  }, []);


  // useEffect to update something based on currentTime, if necessary, can be added here.
  // For example, updating displayed times if they are dynamic beyond the control points.
  useEffect(() => {
    // Example: console.log("Current time updated in dashboard:", currentTime.toLocaleTimeString());
    // If there were other parts of the UI that needed to react to time changes,
    // independent of ETA, that logic would go here.
  }, [currentTime]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Left Column: Control Points */}
        <div className="md:col-span-8 flex flex-col h-full gap-6">
          <RouteHeaderCard routeInfo={routeInfo} />
          <ControlPointsSection controlPoints={controlPoints} /> {/* isLoadingEta removed */}
        </div>

        {/* Right Column: Units Ahead and Behind */}
        <div className="md:col-span-4 flex flex-col h-full gap-6">
          <UnitInfoCard unitDetails={unitAhead} />
          <UnitInfoCard unitDetails={unitBehind} />
          {/* ETA Update Button removed, replaced with a generic refresh button if needed in future */}
          {/* Or completely remove the button if no manual refresh action is desired */}
           <Button onClick={handleManualRefresh} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
             <RefreshCw size={18} className="mr-2" />
             Refrescar Datos
           </Button>
        </div>
      </div>
    </div>
  );
}
