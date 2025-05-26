
import type { RouteInfo, ControlPoint, UnitDetails } from '@/types';

export const MOCK_ROUTE_INFO: RouteInfo = {
  routeName: 'RUTA 123',
  currentDate: '2025-04-15', // Formato YYYY-MM-DD
  unitId: 'Unidad: 39 (1875)',
  totalAT: 0,
  totalAD: 0,
};

export const MOCK_CONTROL_POINTS: ControlPoint[] = [
  {
    id: 'cp1',
    name: 'Kennedy',
    scheduledTime: '17:33',
    meta: 'M:',
    metaTime: '17:42',
    status: 'l: 9',
  },
  {
    id: 'cp2',
    name: 'C. Ballen',
    scheduledTime: '17:39',
    isCurrent: true,
    meta: 'M:',
    metaTime: '17:52',
    status: 'l: 3',
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
  unitIdentifier: '39 (1875)',
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

export const EMPTY_UNIT_DETAILS: UnitDetails = {
  id: 'empty-unit',
  label: '', // Será sobreescrito
  unitIdentifier: 'N/A',
  totalAT: 0,
  totalAD: 0,
  lastKnownLocation: 'N/A',
  lastKnownTime: '--:--',
  isPrimary: false,
};
