
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LogOut, Info } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importar useRouter
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
  const router = useRouter(); // Inicializar useRouter

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
    console.log("Cerrar sesión presionado, redirigiendo a /login");
    router.push('/login'); // Redirigir a la página de login
  };

  if (!timeString) {
    return (
      <div className="bg-button-custom-dark-gray text-primary-foreground p-3 rounded-lg shadow-md text-center mb-6">
        <div className="flex justify-end space-x-1 mb-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-7 w-7 opacity-50 cursor-not-allowed"
              aria-label="Información de la aplicación"
              disabled
            >
              <Info size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-7 w-7 opacity-50 cursor-not-allowed"
              aria-label="Cerrar sesión"
              disabled
            >
              <LogOut size={18} />
            </Button>
          </div>
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
    <div className="bg-button-custom-dark-gray text-primary-foreground p-4 rounded-lg shadow-md mb-6 flex flex-col">
      <div className="flex justify-end space-x-1 mb-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-8 w-8"
              aria-label="Información de la aplicación"
            >
              <Info size={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">Información de la Aplicación</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <Image
                src="https://control.puntoexacto.ec/images/logo.png?t=1734027539"
                alt="PuntoExacto Logo"
                width={128}
                height={64}
                className="object-contain"
                data-ai-hint="company logo"
              />
              <p className="text-sm text-muted-foreground text-center">
                Todos los derechos reservados PuntoExacto - 2025
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Versión 1.0.2
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
          className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-8 w-8"
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} />
        </Button>
      </div>
      <div className="text-center">
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
      </div>
    </div>
  );
}

