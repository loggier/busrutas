'use client';

import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';
import { predictETA, type PredictETAInput } from '@/ai/flows/predict-eta';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useState, useEffect, useCallback }  from 'react';
import RouteHeaderCard from '@/components/route/RouteHeaderCard';
import ControlPointsSection from '@/components/control-points/ControlPointsSection';
import UnitInfoCard from '@/components/units/UnitInfoCard';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RouteDashboardClientProps {
  initialRouteInfo: RouteInfo;
  initialControlPoints: ControlPoint[];
  initialUnitAhead: UnitDetails;
  initialUnitBehind: UnitDetails;
  historicalData: string;
}

export default function RouteDashboardClient({
  initialRouteInfo,
  initialControlPoints,
  initialUnitAhead,
  initialUnitBehind,
  historicalData,
}: RouteDashboardClientProps) {
  const [routeInfo] = useState<RouteInfo>(initialRouteInfo);
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>(initialControlPoints);
  const [unitAhead] = useState<UnitDetails>(initialUnitAhead);
  const [unitBehind] = useState<UnitDetails>(initialUnitBehind);
  const [isLoadingEta, setIsLoadingEta] = useState<boolean>(false);
  const { toast } = useToast();

  const currentTime = useCurrentTime(); // Updates every 10 seconds by default

  const fetchAndSetEtas = useCallback(async () => {
    setIsLoadingEta(true);
    try {
      const currentCpIndex = controlPoints.findIndex(cp => cp.isCurrent);
      const currentPoint = currentCpIndex !== -1 ? controlPoints[currentCpIndex] : controlPoints[0];
      
      const upcomingPointsObjects = controlPoints.slice(currentCpIndex !== -1 ? currentCpIndex : 0);
      const upcomingControlPointNames = upcomingPointsObjects.map(cp => cp.name);

      if (upcomingControlPointNames.length === 0) {
        setIsLoadingEta(false);
        return;
      }
      
      const input: PredictETAInput = {
        currentLocation: currentPoint.name,
        upcomingControlPoints: upcomingControlPointNames,
        currentTime: currentTime.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
        historicalData: historicalData,
      };

      const result = await predictETA(input);

      setControlPoints(prevPoints => {
        const updatedPoints = [...prevPoints];
        let overallDelayReasonApplied = false;

        upcomingPointsObjects.forEach((upPoint, index) => {
          const pointIndexInOriginal = updatedPoints.findIndex(p => p.id === upPoint.id);
          if (pointIndexInOriginal !== -1) {
            updatedPoints[pointIndexInOriginal].predictedTime = result.estimatedArrivalTimes[index] || null;
            if (!overallDelayReasonApplied && result.delayReasons && result.delayReasons.length > 0) {
               updatedPoints[pointIndexInOriginal].delayReason = result.delayReasons;
               overallDelayReasonApplied = true; // Show general delay reason on the first upcoming point
            } else {
               updatedPoints[pointIndexInOriginal].delayReason = null;
            }
          }
        });
        return updatedPoints;
      });

      if (result.delayReasons) {
        // toast({ title: "AI ETA Prediction", description: `Potential delay: ${result.delayReasons}` });
      }

    } catch (error) {
      console.error('Error predicting ETA:', error);
      toast({ title: "Error", description: "Failed to predict ETA.", variant: "destructive" });
      // Reset predicted times on error
      setControlPoints(prevPoints => prevPoints.map(p => ({ ...p, predictedTime: null, delayReason: null })));
    } finally {
      setIsLoadingEta(false);
    }
  }, [controlPoints, currentTime, historicalData, toast]);

  useEffect(() => {
    fetchAndSetEtas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]); // Re-fetch ETAs when currentTime changes (debounced by useCurrentTime hook)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Left Column: Control Points */}
        <div className="md:col-span-8 flex flex-col h-full gap-6">
          <RouteHeaderCard routeInfo={routeInfo} />
          <ControlPointsSection controlPoints={controlPoints} isLoadingEta={isLoadingEta} />
        </div>

        {/* Right Column: Units Ahead and Behind */}
        <div className="md:col-span-4 flex flex-col h-full gap-6">
          <UnitInfoCard unitDetails={unitAhead} />
          <UnitInfoCard unitDetails={unitBehind} />
          <Button onClick={fetchAndSetEtas} disabled={isLoadingEta} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <RefreshCw size={18} className={isLoadingEta ? "animate-spin mr-2" : "mr-2"} />
            {isLoadingEta ? "Actualizando ETA..." : "Actualizar ETA Manualmente"}
          </Button>
        </div>
      </div>
    </div>
  );
}
