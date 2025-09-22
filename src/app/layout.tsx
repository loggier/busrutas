
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Orbitron } from 'next/font/google';
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

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Unidad PuntoExacto',
  description: 'Aplicación de seguimiento y despacho para unidades de PuntoExacto.',
  manifest: '/manifest.json',
  themeColor: '#F44336', // Corresponds to --primary color (Vivid Coral)
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Unidad PuntoExacto',
    // startupImage: [], // Puedes añadir imágenes de inicio para iOS aquí
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased font-sans`}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
