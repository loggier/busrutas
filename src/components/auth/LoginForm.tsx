
'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // Para el estado de carga

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
import { RefreshCw } from 'lucide-react';

const formSchema = z.object({
  unitName: z.string().min(1, { message: 'El nombre de la unidad es requerido.' }),
  pin: z.string()
    .length(6, { message: 'El PIN debe tener 6 dígitos.' })
    .regex(/^\d{6}$/, { message: 'El PIN debe contener solo números.' }),
});

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
      // Construir la URL con query parameters
      const params = new URLSearchParams({
        unidad: values.unitName,
        pin: values.pin,
      });
      const url = `https://control.puntoexacto.ec/api/login_unidad?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET', // Cambiado a GET
        // No se necesita 'headers' ni 'body' para GET con query params
      });

      const data = await response.json();

      if (response.ok && data.status === 1) {
        localStorage.setItem('currentUnitId', values.unitName); // Guardar el unitName ingresado
        toast({
          title: 'Ingreso Exitoso',
          description: 'Bienvenido. Redirigiendo a la página principal...',
          variant: 'default',
        });
        router.push('/');
      } else if (data.status === 0 && data.msg) {
        toast({
          title: 'Error de Ingreso',
          description: data.msg,
          variant: 'destructive',
        });
        form.setValue('pin', ''); // Limpiar PIN
      } else {
        // Error genérico si la respuesta no es la esperada
        toast({
          title: 'Error de Ingreso',
          description: data.msg || 'Ocurrió un error inesperado. Intente nuevamente.',
          variant: 'destructive',
        });
        form.setValue('pin', ''); // Limpiar PIN
      }
    } catch (error) {
      console.error('Error en la petición de login:', error);
      toast({
        title: 'Error de Conexión',
        description: 'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.',
        variant: 'destructive',
      });
      form.setValue('pin', ''); // Limpiar PIN
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="items-center pt-6 pb-4">
        <Image
          src="https://control.puntoexacto.ec/images/logo.png?t=1734027539"
          alt="PuntoExacto Logo"
          width={160}
          height={80}
          className="object-contain mb-6"
          priority
          data-ai-hint="company logo"
        />
        <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
