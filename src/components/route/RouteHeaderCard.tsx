
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


  return (
    <Card className="shadow-xl">
      <CardContent className="p-3 sm:p-4 md:p-5 flex items-center gap-3 sm:gap-4">
        <Image
          src="https://control.puntoexacto.ec/images/logo.png?t=1734027539"
          alt="Logo de la Empresa"
          width={100} // Reducido
          height={50}  // Reducido
          className="h-10 sm:h-12 md:h-14 w-auto object-contain"
          data-ai-hint="company logo"
        />
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-wide">{routeInfo.routeName}</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-0.5 sm:mt-1">
            {displayDate}
          </p>
          <p className="text-base sm:text-lg md:text-xl font-medium mt-0.5 sm:mt-1 text-primary">{routeInfo.unitId}</p>
          {(typeof routeInfo.totalAT === 'number' || typeof routeInfo.totalAD === 'number') && (
            <p className="text-xs sm:text-sm md:text-base text-foreground mt-0.5 sm:mt-1">
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
