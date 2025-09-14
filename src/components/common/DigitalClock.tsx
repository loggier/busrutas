
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LogOut, Info } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DigitalClockProps {
  currentTime: Date | null;
}

export default function DigitalClock({ currentTime }: DigitalClockProps) {
  const [showColon, setShowColon] = useState(true);
  const [timeString, setTimeString] = useState<string | null>(null);
  const [dateString, setDateString] = useState<string | null>(null);
  const router = useRouter();

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

  const handleLogoutClick = () => {
    console.log("Cerrar sesión: limpiando datos y redirigiendo a /login");
    localStorage.removeItem('currentUnitId');
    router.push('/login');
  };

  if (!timeString) {
    return (
      <div className="bg-button-custom-dark-gray text-primary-foreground p-1.5 sm:p-2 rounded-lg shadow-md text-center mb-2 sm:mb-3 md:mb-4">
        <div className="flex justify-end space-x-1 mb-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-5 w-5 sm:h-6 sm:w-6 opacity-50 cursor-not-allowed"
              aria-label="Información de la aplicación"
              disabled
            >
              <Info size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-5 w-5 sm:h-6 sm:w-6 opacity-50 cursor-not-allowed"
              aria-label="Cerrar sesión"
              disabled
            >
              <LogOut size={14} />
            </Button>
          </div>
        <div className="font-orbitron text-2xl sm:text-3xl md:text-4xl tracking-wider">
          <span>--</span>
          <span className="opacity-50 mx-1">:</span>
          <span>--</span>
          <span className="opacity-50 mx-1">:</span>
          <span>--</span>
        </div>
        <div className="font-orbitron text-base text-gray-400 mt-0.5">Cargando...</div>
      </div>
    );
  }

  const [hours, minutes, seconds] = timeString.split(':');

  return (
    <div className="bg-button-custom-dark-gray text-primary-foreground p-1.5 sm:p-2 rounded-lg shadow-md mb-2 sm:mb-3 md:mb-4 flex flex-col">
      <div className="flex justify-end space-x-1 mb-0.5 sm:mb-1">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-5 w-5 sm:h-6 sm:w-6"
              aria-label="Información de la aplicación"
            >
              <Info size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl">Información de la Aplicación</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <Image
                src="https://controlrutas.gpsplataforma.net/images/logo.png?t=1734027539"
                alt="PuntoExacto Logo"
                width={100} 
                height={50}
                className="object-contain"
                data-ai-hint="company logo"
              />
              <p className="text-lg text-muted-foreground text-center">
                Todos los derechos reservados PuntoExacto - 2025
              </p>
              <p className="text-lg text-muted-foreground text-center">
                Versión 1.0.3
              </p>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction>Cerrar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogoutClick}
          className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-5 w-5 sm:h-6 sm:w-6"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
        </Button>
      </div>
      <div className="text-center font-orbitron">
        <div className="text-2xl sm:text-3xl md:text-4xl tracking-wider">
          <span>{hours}</span>
          <span className={`transition-opacity duration-150 ease-in-out mx-0.5 sm:mx-1 ${showColon ? 'opacity-100' : 'opacity-25'}`}>:</span>
          <span>{minutes}</span>
          <span className={`transition-opacity duration-150 ease-in-out mx-0.5 sm:mx-1 ${showColon ? 'opacity-100' : 'opacity-25'}`}>:</span>
          <span>{seconds}</span>
        </div>
        {dateString && (
          <div className="text-base text-gray-300 mt-0.5">{dateString}</div>
        )}
      </div>
    </div>
  );
}
