
'use client';

import { Home, Info, LogOut } from 'lucide-react';

export default function BottomNavigationBar() {
  const navItems = [
    { label: 'Home', icon: Home, action: () => console.log('Home clicked') },
    { label: 'Información', icon: Info, action: () => console.log('Información clicked') },
    { label: 'Salir', icon: LogOut, action: () => console.log('Salir clicked') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-md md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            aria-label={item.label}
            className="flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary focus:text-primary focus:outline-none transition-colors p-2 rounded-md flex-1"
          >
            <item.icon className="w-5 h-5 mb-0.5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
