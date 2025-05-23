
'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation'; // Importar useRouter

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

const formSchema = z.object({
  unitName: z.string().min(1, { message: 'El nombre de la unidad es requerido.' }),
  pin: z.string()
    .length(6, { message: 'El PIN debe tener 6 dígitos.' })
    .regex(/^\d{6}$/, { message: 'El PIN debe contener solo números.' }),
});

const VALID_UNIT_NAME = "00890";
const VALID_PIN = "123456";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter(); // Inicializar useRouter
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitName: '',
      pin: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.unitName === VALID_UNIT_NAME && values.pin === VALID_PIN) {
      toast({
        title: 'Ingreso Exitoso',
        description: 'Bienvenido. Redirigiendo a la página principal...',
        variant: 'default', // Puedes usar 'default' o crear una variante 'success' si la tienes
      });
      router.push('/'); // Redirigir a la página principal
    } else {
      toast({
        title: 'Error de Ingreso',
        description: 'Nombre de unidad o PIN incorrectos. Intente nuevamente.',
        variant: 'destructive',
      });
      // Limpiar el campo de PIN para que el usuario lo reingrese
      form.setValue('pin', '');
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
          priority // Prioritize loading the logo
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
                    <Input placeholder="Ej: U-001 o 00890" {...field} />
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
                        field.onChange(target.value); // Ensure react-hook-form is updated
                      }}
                      maxLength={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
              Ingresar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
