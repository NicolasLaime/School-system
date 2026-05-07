import React, { useState, useEffect } from 'react'
import { User } from '../../../types/Usuario.type'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUserMutation } from '@/redux/services/authApi';
import { useRouter } from "next/navigation";
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Alert, AlertDescription } from "@/components/ui/alert";
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "../ui/select";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui/input';

const formUserSchema = z.object({
    nombre: z.string().min(3, { message: "El nombre es requerido" }).optional(),
    apellido: z.string().min(3, { message: "El apellido es requerido" }).optional(),
    email: z.string().trim().toLowerCase().email({ message: "Correo electrónico inválido" }).optional(),
    telefono: z.string().trim().regex(/^\+?[0-9\s\-()]{7,20}$/, {
        message: "Número de teléfono inválido",
    }).optional(),
    direccion: z.string().min(3, { message: "La direccion es requerida" }).optional(),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
    rol: z.enum(["ADMIN", "DOCENTE", "DIRECTIVO"]).optional(),
});

interface Props {
  dataUser: User | undefined
  userPerfil: string | undefined
}

const FormEditUsuario = ({ dataUser, userPerfil }: Props) => {
    const router = useRouter();
    const [updateProductApi, { isLoading }] = useUpdateUserMutation();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof formUserSchema>>({
        resolver: zodResolver(formUserSchema),
        defaultValues: {
            nombre: dataUser?.nombre || "",
            apellido: dataUser?.apellido || "",
            email: dataUser?.email || "",
            telefono: dataUser?.telefono || "",
            direccion: dataUser?.direccion || "",
            rol: dataUser?.rol || "DOCENTE",
            password: "", 
        },
    });

    // Actualizar los valores del formulario cuando dataUser cambie
    useEffect(() => {
        if (dataUser) {
            form.reset({
                nombre: dataUser.nombre || "",
                apellido: dataUser.apellido || "",
                email: dataUser.email || "",
                telefono: dataUser.telefono || "",
                direccion: dataUser.direccion || "",
                rol: dataUser.rol || "DOCENTE",
                password: "",
            });
        }
    }, [dataUser, form]);

    const handlerEdit = async (values: z.infer<typeof formUserSchema>) => {
        if(!dataUser?.id){
            setError("Usuario no encontrado");
            return;
        }

        // Limpiar mensajes previos
        setError("");
        setMensaje("");

        try {
            const response = await updateProductApi({
                id: dataUser.id,
                data: values
            }).unwrap();
            
            if (response) {
                setMensaje("Usuario actualizado correctamente");
                router.push("/dashboard/usuarios");
            } else {
                setError("Error al actualizar el usuario");
            }
        } catch (error: unknown) {
            console.error("Error al actualizar usuario:", error);
            
            // Asegurar que siempre sea un string
            let errorMessage = "Error inesperado al actualizar el usuario.";
            
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object' && 'data' in error) {
                const errorData = error.data as { error?: string; message?: string };
                if (errorData?.error && typeof errorData.error === 'string') {
                    errorMessage = errorData.error;
                } else if (errorData?.message && typeof errorData.message === 'string') {
                    errorMessage = errorData.message;
                }
            } else if (error && typeof error === 'object' && 'message' in error) {
                const errorObj = error as { message: string };
                if (typeof errorObj.message === 'string') {
                    errorMessage = errorObj.message;
                }
            }
            
            setError(errorMessage);
        }
    };

    // Si no hay dataUser, mostrar loading o error
    if (!dataUser) {
        return <div>Cargando datos del usuario...</div>;
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handlerEdit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre" {...field} />
                                    </FormControl>
                                    <FormDescription>Nombre completo del usuario.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="apellido"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Apellido" {...field} />
                                    </FormControl>
                                    <FormDescription>Apellido completo del usuario.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormDescription>Email del usuario</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="telefono"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefono</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Telefono" {...field} />
                                    </FormControl>
                                    <FormDescription>Telefono del usuario</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="direccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Direccion</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Direccion" {...field} />
                                    </FormControl>
                                    <FormDescription>Direccion del usuario</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Contraseña"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Contraseña para el usuario (dejar vacío para mantener la actual).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       {userPerfil === "ADMIN" && (
                         <FormField
                            control={form.control}
                            name="rol"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona un rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Rol del usuario</SelectLabel>
                                                    <SelectItem value="DOCENTE">Docente</SelectItem>
                                                    <SelectItem value="DIRECTIVO">Directivo</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>Rol que tendrá el usuario</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        )}
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" disabled={isLoading} className="cursor-pointer">
                            {isLoading ? "Guardando..." : "Actualizar Usuario"}
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.push("/dashboard/usuarios")}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
                
                {/* Alertas de estado */}
                <div className="mt-5 space-y-3">
                    {error && typeof error === 'string' && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {mensaje && typeof mensaje === 'string' && (
                        <Alert variant="default">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700">
                                {mensaje}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </Form>
        </div>
    )
}

export default FormEditUsuario