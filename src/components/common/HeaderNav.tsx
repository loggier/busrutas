
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
    <header className="bg-card text-primary-foreground p-2 flex justify-between items-center shadow-lg border-b border-border">
      <div className="font-bold text-xl">Control</div>
      <div className="flex items-center gap-4 font-orbitron font-bold">
        <RefreshCw size={24} className="cursor-pointer" />
        <span></span>
        <span className="text-2xl">{timeString}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogoutClick}
          className="hover:bg-destructive/80 h-9 w-9"
          aria-label="Cerrar sesión"
        >
          <Power size={26} />
        </Button>
      </div>
    </header>
  );
}
