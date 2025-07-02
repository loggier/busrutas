
'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Download } from 'lucide-react';

const formSchema = z.object({
  unitName: z.string().min(1, { message: 'El nombre de la unidad es requerido.' }),
  pin: z.string()
    .length(6, { message: 'El PIN debe tener 6 dígitos.' })
    .regex(/^\d{6}$/, { message: 'El PIN debe contener solo números.' }),
});

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}


export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);


  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsAppInstalled(true);
    }

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setInstallPromptEvent(null);
      toast({
          title: 'Aplicación Instalada',
          description: 'Unidad PuntoExacto se ha instalado correctamente.',
          variant: 'default',
      });
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }
    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    if (outcome === 'accepted') {
      console.log('El usuario aceptó la instalación');
      setIsAppInstalled(true);
    } else {
      console.log('El usuario rechazó la instalación');
    }
    setInstallPromptEvent(null);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitName: '',
      pin: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        unidad: values.unitName,
        pin: values.pin,
      });
      const url = `https://control.puntoexacto.ec/api/login_unidad?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok && data.status === 1 && data.id_unidad) {
        localStorage.setItem('currentUnitId', String(data.id_unidad));
        toast({
          title: 'Ingreso Exitoso',
          description: data.msg || 'Bienvenido. Redirigiendo a la página principal...',
          variant: 'default',
          duration: 10000,
        });
        router.push('/');
      } else if (data.status === 0 && data.msg) {
        toast({
          title: 'Error de Ingreso',
          description: data.msg,
          variant: 'destructive',
        });
        form.setValue('pin', '');
      } else {
        toast({
          title: 'Error de Ingreso',
          description: data.msg || 'Ocurrió un error inesperado. Intente nuevamente.',
          variant: 'destructive',
        });
        form.setValue('pin', '');
      }
    } catch (error) {
      console.error('Error en la petición de login:', error);
      toast({
        title: 'Error de Conexión',
        description: 'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.',
        variant: 'destructive',
      });
      form.setValue('pin', '');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm sm:max-w-md shadow-lg">
      <CardHeader className="items-center pt-4 sm:pt-6 pb-3 sm:pb-4">
        <Image
          src="https://control.puntoexacto.ec/images/logo.png?t=1734027539"
          alt="PuntoExacto Logo"
          width={100} 
          height={50} 
          className="object-contain mb-2 sm:mb-4"
          priority
          data-ai-hint="company logo"
        />
        <CardTitle className="text-xl sm:text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 sm:pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="unitName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Unidad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: U-001 o 00890" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN (6 dígitos)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••"
                      {...field}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, '').slice(0, 6);
                        field.onChange(target.value);
                      }}
                      maxLength={6}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg py-3 sm:py-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
            {installPromptEvent && !isAppInstalled && (
              <Button
                variant="outline"
                onClick={handleInstallClick}
                className="w-full mt-2 sm:mt-4 text-sm sm:text-base py-2 sm:py-3"
                disabled={isLoading}
                type="button"
              >
                <Download className="mr-2 h-4 w-4" />
                Instalar Aplicación
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
