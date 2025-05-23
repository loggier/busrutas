export interface ControlPoint {
  id: string;
  name: string;
  scheduledTime: string;
  meta?: string;
  metaTime?: string;
  status?: string;
  isCurrent?: boolean;
  predictedTime?: string | null; // AI predicted ETA
  delayReason?: string | null; // Reason for delay from AI
}

export interface UnitDetails {
  id: string;
  label: string; // e.g., "Unidad Adelante"
  unitIdentifier: string; // e.g., "39 (1875)"
  totalAT: number;
  totalAD: number;
  lastKnownLocation: string;
  lastKnownTime: string;
  meta?: string;
  metaTime?: string;
  status?: string;
  isPrimary?: boolean; // To style "Unidad Adelante" differently
}

export interface RouteInfo {
  routeName: string;
  currentDate: string;
  unitId: string;
}
