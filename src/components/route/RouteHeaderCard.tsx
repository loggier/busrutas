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
          src="https://placehold.co/128x64/F44336/FFFFFF.png?text=Logo" // Placeholder logo
          alt="Logo de la Empresa"
          width={128}
          height={64}
          className="h-16 w-auto object-contain"
          data-ai-hint="company logo"
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
