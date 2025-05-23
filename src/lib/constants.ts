import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';

export const MOCK_ROUTE_INFO: RouteInfo = {
  routeName: 'RUTA 123',
  currentDate: 'Martes, 15 de Abril 2025',
  unitId: 'Unidad: 39 (1875)',
};

export const MOCK_CONTROL_POINTS: ControlPoint[] = [
  {
    id: 'cp1',
    name: 'Kennedy',
    scheduledTime: '17:33',
    meta: 'M:',
    metaTime: '17:42',
    status: 'l: 9',
    isCurrent: true,
  },
  {
    id: 'cp2',
    name: 'C. Ballen',
    scheduledTime: '17:39',
  },
  {
    id: 'cp3',
    name: '9 de Octubre',
    scheduledTime: '17:47',
  },
  {
    id: 'cp4',
    name: 'Quisquis y Carchi',
    scheduledTime: '17:52',
  },
  {
    id: 'cp5',
    name: 'Cementerio',
    scheduledTime: '18:00',
  },
  {
    id: 'cp6',
    name: 'Florida Norte',
    scheduledTime: '18:15',
  },
];

export const MOCK_UNIT_AHEAD: UnitDetails = {
  id: 'unit-ahead',
  label: 'Unidad Adelante',
  unitIdentifier: '39 (1875)', // This seems to be the current unit, example might need adjustment
  totalAT: 22,
  totalAD: 0,
  lastKnownLocation: 'C. Ballen',
  lastKnownTime: '17:29',
  meta: 'M:',
  metaTime: '17:41',
  status: 'l: 12',
  isPrimary: true,
};

export const MOCK_UNIT_BEHIND: UnitDetails = {
  id: 'unit-behind',
  label: 'Unidad Atrás',
  unitIdentifier: '02 (2075)',
  totalAT: 11,
  totalAD: 1,
  lastKnownLocation: 'Kennedy',
  lastKnownTime: '17:43',
  isPrimary: false,
};

export const MOCK_HISTORICAL_DATA: string = `
  Kennedy a C. Ballen: 2025-04-14 17:30, 7 mins; 2025-04-13 17:32, 6 mins.
  C. Ballen a 9 de Octubre: 2025-04-14 17:38, 8 mins; 2025-04-13 17:40, 9 mins.
  9 de Octubre a Quisquis y Carchi: 2025-04-14 17:47, 5 mins; 2025-04-13 17:49, 5 mins.
  Quisquis y Carchi a Cementerio: 2025-04-14 17:53, 8 mins; 2025-04-13 17:55, 7 mins.
  Cementerio a Florida Norte: 2025-04-14 18:02, 15 mins; 2025-04-13 18:03, 14 mins.
  Datos adicionales: Hora pico (17:00-19:00) puede incrementar tiempos en 2-5 minutos por tramo. Lluvia fuerte reportada el 2025-04-13 incrementó tiempos en 5-10 minutos.
`.trim();
