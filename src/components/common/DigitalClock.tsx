'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
    // Colon blink effect, only if timeString is available
    if (timeString) {
      const colonTimer = setInterval(() => {
        setShowColon((prev) => !prev);
      }, 1000); // Blink every second

      return () => {
        clearInterval(colonTimer);
      };
    }
  }, [timeString]); // Rerun if timeString changes (e.g. from null to actual time)

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
    <div className="bg-button-custom-dark-gray text-primary-foreground p-3 rounded-lg shadow-md text-center mb-6">
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
  );
}
