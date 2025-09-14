
import type { RouteInfo, ControlPoint } from '@/types';

export const MOCK_ROUTE_INFO: RouteInfo = {
  routeName: 'RUTA 123',
  currentDate: '2025-04-15', // Formato YYYY-MM-DD
  currentTime: '17:30:00',
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
