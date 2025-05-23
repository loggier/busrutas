import type { RouteInfo } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface RouteHeaderCardProps {
  routeInfo: RouteInfo;
  currentTimeFormatted: string | null;
}

export default function RouteHeaderCard({ routeInfo, currentTimeFormatted }: RouteHeaderCardProps) {
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
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
            {routeInfo.currentDate}
            {currentTimeFormatted ? (
              <span className="ml-2 font-medium text-foreground tabular-nums">{currentTimeFormatted}</span>
            ) : (
              <span className="ml-2 font-medium text-foreground tabular-nums">--:--:--</span>
            )}
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-medium mt-2 text-primary">{routeInfo.unitId}</p>
        </div>
      </CardContent>
    </Card>
  );
}
