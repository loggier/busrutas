
'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

export default function LoginForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitName: '',
      pin: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Login attempt:', values);
    toast({
      title: 'Intento de Ingreso',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
    // Aquí se manejaría la lógica de autenticación real
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
                    <Input placeholder="Ej: U-001 o NombreUnidad" {...field} />
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
