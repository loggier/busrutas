
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto } from 'next/font/google';
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

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Control Rutas & Paradas',
  description: 'Aplicación de seguimiento y despacho para unidades de Control Rutas & Paradas.',
  manifest: '/manifest.json',
  themeColor: '#F44336', // Corresponds to --primary color (Vivid Coral)
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Control Rutas & Paradas',
    // startupImage: [], // Puedes añadir imágenes de inicio para iOS aquí
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased font-sans`}>
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
