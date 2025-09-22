
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Unidad PuntoExacto',
  description: 'Página de inicio de sesión para la aplicación de unidades.',
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // El RootLayout en app/layout.tsx ya provee las etiquetas <html> y <body>.
  // Envolver el children en un fragmento o un div simple es suficiente.
  return <>{children}</>;
}
