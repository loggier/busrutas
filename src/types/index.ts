export interface ControlPoint {
  id: string;
  name: string;
  scheduledTime: string;
  meta?: string;
  metaTime?: string;
  status?: string;
  isCurrent?: boolean;
  // Campos de ETA removidos de la interfaz por ahora
  // predictedTime?: string | null;
  // delayReason?: string | null;
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
  currentDate: string; // Se espera formato YYYY-MM-DD
  unitId: string;
}
