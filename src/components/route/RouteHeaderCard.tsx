import type { RouteInfo } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface RouteHeaderCardProps {
  routeInfo: RouteInfo;
}

export default function RouteHeaderCard({ routeInfo }: RouteHeaderCardProps) {
  let formattedDate = routeInfo.currentDate;
  try {
    // Intenta parsear la fecha y formatearla
    const dateObject = parseISO(routeInfo.currentDate); // Parsea YYYY-MM-DD
    const dayName = format(dateObject, 'EEEE', { locale: es });
    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    formattedDate = `${capitalizedDayName}, ${format(dateObject, "d 'de' MMMM, yyyy", { locale: es })}`;
  } catch (error) {
    console.warn("Could not parse routeInfo.currentDate:", routeInfo.currentDate, error);
    // Si falla el parseo, usa la fecha tal como viene (o podrías definir un fallback)
  }

  return (
    <Card className="shadow-xl">
      <CardContent className="p-6 flex items-center gap-6">
        <Image
          src="https://control.puntoexacto.ec/images/logo.png?t=1734027539"
          alt="Logo de la Empresa"
          width={128}
          height={64}
          className="h-12 md:h-16 w-auto object-contain"
          data-ai-hint="company logo"
        />
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-wide">{routeInfo.routeName}</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1">
            {formattedDate}
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-medium mt-1 text-primary">{routeInfo.unitId}</p>
        </div>
      </CardContent>
    </Card>
  );
}
