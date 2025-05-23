import type { RouteInfo } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface RouteHeaderCardProps {
  routeInfo: RouteInfo;
  // currentTimeFormatted prop removed
}

export default function RouteHeaderCard({ routeInfo }: RouteHeaderCardProps) {
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-wide">{routeInfo.routeName}</h1>
          {/* Removed date/time display from here, it's now in DigitalClock */}
          {/* The routeInfo.currentDate could still be displayed if it represents a 'base' or 'scheduled' date for the route
              For example: <p className="text-base text-muted-foreground">{routeInfo.currentDate}</p> 
              But for now, keeping it clean as per the focus on the new DigitalClock for current time.
          */}
          <p className="text-xl sm:text-2xl md:text-3xl font-medium mt-1 text-primary">{routeInfo.unitId}</p>
        </div>
      </CardContent>
    </Card>
  );
}
