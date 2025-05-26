
export interface ControlPoint {
  id: string;
  name: string;
  scheduledTime: string;
  meta?: string;
  metaTime?: string;
  status?: string;
  isCurrent?: boolean;
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
  totalAT?: number; // Nuevo campo
  totalAD?: number; // Nuevo campo
}
