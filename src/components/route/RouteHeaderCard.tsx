import type { RouteInfo } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface RouteHeaderCardProps {
  routeInfo: RouteInfo;
}

export default function RouteHeaderCard({ routeInfo }: RouteHeaderCardProps) {
  return (
    <Card className="shadow-xl">
      <CardContent className="p-6 flex items-center gap-6">
        <Image
          src="https://control.puntoexacto.ec/images/logo.png?t=1734027539"
          alt="Logo de la Empresa"
          width={128} // Mantendremos el ancho, el alto se ajustará automáticamente o podemos definirlo
          height={64} // Podemos ajustar esto si el aspect ratio del nuevo logo es diferente
          className="h-16 w-auto object-contain" // 'h-16' y 'w-auto' podrían necesitar ajuste
          data-ai-hint="company logo" // Mantenemos el hint
        />
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-wide">{routeInfo.routeName}</h1>
          <p className="text-2xl text-muted-foreground">{routeInfo.currentDate}</p>
          <p className="text-3xl font-medium mt-2 text-primary">{routeInfo.unitId}</p>
        </div>
      </CardContent>
    </Card>
  );
}
