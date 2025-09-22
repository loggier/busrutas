
'use client';

import { format } from 'date-fns';
import { Power, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface HeaderNavProps {
  currentTime: Date | null;
}

export default function HeaderNav({ currentTime }: HeaderNavProps) {
  const router = useRouter();

  const handleLogoutClick = () => {
    console.log("Cerrar sesión: limpiando datos y redirigiendo a /login");
    localStorage.removeItem('currentUnitId');
    router.push('/login');
  };

  const timeString = currentTime ? format(currentTime, 'HH:mm:ss') : '--:--:--';

  return (
    <header className="bg-primary text-primary-foreground p-2 flex justify-between items-center shadow-lg">
      <nav className="flex items-center gap-3 text-sm font-bold">
        <a href="#" className="border-b-2 border-white pb-1">SALIDAS</a>
        <a href="#" className="opacity-70 hover:opacity-100">MAPA</a>
        <a href="#" className="opacity-70 hover:opacity-100">MENSAJE</a>
        <a href="#" className="opacity-70 hover:opacity-100">DISPATCH</a>
      </nav>
      <div className="flex items-center gap-3 font-orbitron font-bold">
        <RefreshCw size={20} className="cursor-pointer" />
        <span>0 km/h</span>
        <span className="text-lg">{timeString}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogoutClick}
          className="hover:bg-white/20 h-8 w-8"
          aria-label="Cerrar sesión"
        >
          <Power size={22} />
        </Button>
      </div>
    </header>
  );
}
