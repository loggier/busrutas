
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

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
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow"> {/* Eliminado pb-16 md:pb-0 */}
            {children}
          </main>
          {/* Eliminado BottomNavigationBar */}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
