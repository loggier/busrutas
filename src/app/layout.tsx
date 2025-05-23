
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar'; // Importar la nueva barra

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RouteWise - Horarios',
  description: 'Gestión de horarios y predicción ETA para rutas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {/* Envolver children para manejar el padding inferior y asegurar que el footer (si existe) o la barra se posicione correctamente */}
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow pb-16 md:pb-0"> {/* Añadir padding-bottom para la barra en móviles/tablets */}
            {children}
          </main>
          <BottomNavigationBar /> {/* Añadir la barra de navegación */}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
