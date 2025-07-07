
import type { RouteInfo } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

interface RouteHeaderCardProps {
  routeInfo: RouteInfo;
}

export default function RouteHeaderCard({ routeInfo }: RouteHeaderCardProps) {
  let displayDate = routeInfo.currentDate;
  if (routeInfo.currentDate && /^\d{4}-\d{2}-\d{2}$/.test(routeInfo.currentDate)) {
    try {
      const dateObject = parseISO(routeInfo.currentDate);
      if (isValid(dateObject)) {
        const dayName = format(dateObject, 'EEEE', { locale: es });
        const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        displayDate = `${capitalizedDayName}, ${format(dateObject, "d 'de' MMMM, yyyy", { locale: es })}`;
      } else {
        console.warn("RouteHeaderCard: Parsed date is invalid:", routeInfo.currentDate);
      }
    } catch (error) {
      console.warn("RouteHeaderCard: Could not parse routeInfo.currentDate:", routeInfo.currentDate, error);
    }
  } else if (routeInfo.currentDate) {
     console.warn("RouteHeaderCard: routeInfo.currentDate is not in YYYY-MM-DD format:", routeInfo.currentDate);
  }

  const displayTime = routeInfo.currentTime && /^\d{2}:\d{2}:\d{2}$/.test(routeInfo.currentTime)
    ? routeInfo.currentTime.substring(0, 5) 
    : null;


  return (
    <Card className="shadow-xl">
      <CardContent className="p-2 sm:p-3 md:p-4 flex items-center gap-2 sm:gap-3">
        <Image
          src="https://control.puntoexacto.ec/images/logo.png"
          alt="Logo de la Empresa"
          width={100} 
          height={60} 
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
          data-ai-hint="company logo"
        />
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-wide">{routeInfo.routeName}</h1>
          <p className="text-base sm:text-base md:text-lg text-muted-foreground mt-0.5">
            {displayDate}
          </p>
          {displayTime && (
            <p className="text-base sm:text-base md:text-lg text-muted-foreground">
              Hora Despacho: <span className="font-semibold">{displayTime}</span>
            </p>
          )}
          <p className="text-lg sm:text-xl md:text-2xl font-medium mt-0.5 text-primary">{routeInfo.unitId}</p>
          {(typeof routeInfo.totalAT === 'number' || typeof routeInfo.totalAD === 'number') && (
            <p className="text-base sm:text-base md:text-lg text-foreground mt-0.5">
              {typeof routeInfo.totalAT === 'number' && (
                <>
                  Total AT: <span className="font-semibold">{routeInfo.totalAT}</span>
                </>
              )}
              {typeof routeInfo.totalAT === 'number' && typeof routeInfo.totalAD === 'number' && " | "}
              {typeof routeInfo.totalAD === 'number' && (
                <>
                  Total AD: <span className="font-semibold">{routeInfo.totalAD}</span>
                </>
              )}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
