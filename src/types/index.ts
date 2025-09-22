
export interface ControlPoint {
  id: string;
  order?: number; // #
  name: string; // Relojes
  t?: number; // T
  scheduledTime: string; // Hora
  marcade?: string; // Marcade
  flt_mas?: string | number; // Flt+
  flt_menos?: string | number; // Flt-
  vm?: string | number; // VM
  isCurrent?: boolean;
  
  // Old fields that may still be in the API response
  meta?: string;
  metaTime?: string;
  status?: string;
}

export interface UnitDetails {
  unit: string;
  time: string;
  status?: string;
}

export interface RouteInfo {
  routeName: string;
  currentDate: string; // Se espera formato YYYY-MM-DD
  currentTime?: string; // Nuevo campo, formato "HH:MM:SS"
  unitId: string;
  totalAT?: number;
  totalAD?: number;
}
