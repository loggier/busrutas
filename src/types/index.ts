
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
  unit: string;
  time: string;
  status: string;
}

export interface RouteInfo {
  routeName: string;
  currentDate: string; // Se espera formato YYYY-MM-DD
  currentTime?: string; // Nuevo campo, formato "HH:MM:SS"
  unitId: string;
  totalAT?: number;
  totalAD?: number;
}
