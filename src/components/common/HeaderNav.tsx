
'use client';

interface HeaderNavProps {
  currentTime: Date | null;
}

export default function HeaderNav({ currentTime }: HeaderNavProps) {
  // El contenido se ha movido a DigitalClock y RouteDashboardClient
  // Este componente ahora sirve como un placeholder o puede ser eliminado si no se necesita.
  return (
    <header className="bg-card text-primary-foreground p-2 flex justify-between items-center shadow-lg border-b border-border h-10">
      {/* Contenido vacío o un logo si se decide después */}
    </header>
  );
}
