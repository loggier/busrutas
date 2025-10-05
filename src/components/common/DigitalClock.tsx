
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DigitalClockProps {
  currentTime: Date | null;
}

export default function DigitalClock({ currentTime }: DigitalClockProps) {
  const [showColon, setShowColon] = useState(true);
  const [timeString, setTimeString] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (currentTime) {
      const hours = format(currentTime, 'HH');
      const minutes = format(currentTime, 'mm');
      const seconds = format(currentTime, 'ss');
      setTimeString(`${hours}:${minutes}:${seconds}`);
    } else {
      setTimeString(null);
    }
  }, [currentTime]);

  useEffect(() => {
    if (timeString) {
      const colonTimer = setInterval(() => {
        setShowColon((prev) => !prev);
      }, 1000);

      return () => {
        clearInterval(colonTimer);
      };
    }
  }, [timeString]);

  const handleLogoutClick = () => {
    console.log("Cerrar sesión: limpiando datos y redirigiendo a /login");
    localStorage.removeItem('currentUnitId');
    router.push('/login');
  };

  const renderTime = () => {
    if (!timeString) {
      return (
        <div className="text-3xl sm:text-4xl md:text-5xl tracking-wider">
          <span>--</span>
          <span className="opacity-50 mx-1">:</span>
          <span>--</span>
          <span className="opacity-50 mx-1">:</span>
          <span>--</span>
        </div>
      );
    }
    const [hours, minutes, seconds] = timeString.split(':');
    return (
      <div className="text-3xl tracking-wider font-roboto">
        <span>{hours}</span>
        <span className={`transition-opacity duration-150 ease-in-out mx-0.5 sm:mx-1 ${showColon ? 'opacity-100' : 'opacity-25'}`}>:</span>
        <span>{minutes}</span>
        <span className={`transition-opacity duration-150 ease-in-out mx-0.5 sm:mx-1 ${showColon ? 'opacity-100' : 'opacity-25'}`}>:</span>
        <span>{seconds}</span>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {renderTime()}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogoutClick}
        className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-8 w-8"
        aria-label="Cerrar sesión"
        disabled={!timeString}
      >
        <LogOut size={20} />
      </Button>
    </div>
  );
}
