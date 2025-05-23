
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LogOut, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DigitalClockProps {
  currentTime: Date | null;
}

export default function DigitalClock({ currentTime }: DigitalClockProps) {
  const [showColon, setShowColon] = useState(true);
  const [timeString, setTimeString] = useState<string | null>(null);
  const [dateString, setDateString] = useState<string | null>(null);

  useEffect(() => {
    if (currentTime) {
      const hours = format(currentTime, 'HH');
      const minutes = format(currentTime, 'mm');
      const seconds = format(currentTime, 'ss');
      setTimeString(`${hours}:${minutes}:${seconds}`);

      const formattedDate = format(currentTime, "EEEE, d 'de' MMMM", { locale: es });
      setDateString(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
    } else {
      setTimeString(null);
      setDateString(null);
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

  const handleInfoClick = () => {
    console.log("Información de la app presionada. Versión: 1.0.0, Copyright 2024 MiEmpresa");
    // Aquí podrías abrir un modal con la información
  };

  const handleLogoutClick = () => {
    console.log("Cerrar sesión presionado");
    // Aquí implementarías la lógica de cierre de sesión
  };

  if (!timeString) {
    return (
      <div className="bg-button-custom-dark-gray text-primary-foreground p-3 rounded-lg shadow-md text-center mb-6">
        <div className="font-mono text-2xl md:text-3xl tracking-wider">
          <span>--</span>
          <span className="opacity-50 mx-1">:</span>
          <span>--</span>
          <span className="opacity-50 mx-1">:</span>
          <span>--</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">Cargando...</div>
      </div>
    );
  }

  const [hours, minutes, seconds] = timeString.split(':');

  return (
    <div className="bg-button-custom-dark-gray text-primary-foreground p-4 rounded-lg shadow-md text-center mb-6">
      <div className="font-mono text-2xl md:text-3xl tracking-wider">
        <span>{hours}</span>
        <span className={`transition-opacity duration-150 ease-in-out mx-1 ${showColon ? 'opacity-100' : 'opacity-25'}`}>:</span>
        <span>{minutes}</span>
        <span className={`transition-opacity duration-150 ease-in-out mx-1 ${showColon ? 'opacity-100' : 'opacity-25'}`}>:</span>
        <span>{seconds}</span>
      </div>
      {dateString && (
        <div className="text-sm text-gray-300 mt-1">{dateString}</div>
      )}
      <div className="mt-3 flex justify-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleInfoClick}
          className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
          aria-label="Información de la aplicación"
        >
          <Info size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogoutClick}
          className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} />
        </Button>
      </div>
    </div>
  );
}
