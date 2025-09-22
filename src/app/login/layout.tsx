
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
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
