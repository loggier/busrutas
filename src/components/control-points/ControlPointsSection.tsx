import type { ControlPoint } from '@/types';
import ControlPointItemCard from './ControlPointItemCard';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ControlPointsSectionProps {
  controlPoints: ControlPoint[];
  isLoadingEta: boolean;
}

export default function ControlPointsSection({ controlPoints, isLoadingEta }: ControlPointsSectionProps) {
  return (
    <Card className="shadow-xl flex-1 flex flex-col overflow-hidden">
      <CardContent className="p-6 flex-1 flex flex-col gap-6 overflow-hidden">
      {isLoadingEta && <p className="text-center text-muted-foreground">Calculando ETA con IA...</p>}
        <ScrollArea className="flex-1 pr-3"> {/* Added pr-3 to prevent scrollbar overlap */}
          <div className="flex flex-col gap-6">
            {controlPoints.map((point) => (
              <ControlPointItemCard key={point.id} point={point} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
