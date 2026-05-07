"use client";
import {
  useCreateUserMutation,
  useGetUsersQuery,
} from "@/redux/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2, Loader2, MailCheck, MailWarning } from "lucide-react";
import { selectUserLogin, selectUserToken } from "@/redux/features/userSlice";

import { useSelector } from "react-redux";
import { User } from "../../../types/Usuario.type";

const formUserSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre es requerido" }),
  apellido: z.string().min(3, { message: "El apellido es requerido" }),
  email: z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Correo electrónico inválido" }),
  telefono: z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, {
    message: "Número de teléfono inválido",
  }),
  direccion: z.string().min(3, { message: "La direccion es requerida" }),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["ADMIN", "DOCENTE", "DIRECTIVO"]),
});

const CreateUserForm = () => {

  const userLogin = useSelector(selectUserLogin);
  const idUserLogin = userLogin?.id

  const token = useSelector(selectUserToken);
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [MailMessage, setErrorMailMessage] = useState("");
  const [verifyMail, setVerifyMail] = useState(false);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const { data, isLoading: isLoadingUsers } = useGetUsersQuery(token);

  const form = useForm<z.infer<typeof formUserSchema>>({
    resolver: zodResolver(formUserSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      rol: "DOCENTE",
      password: "",
    },
  });


  //handler para crear el usuario
  async function onSubmit(values: z.infer<typeof formUserSchema>) {

  const userData = {
    nombre: values.nombre,
    apellido: values.apellido,
    email: values.email,
    telefono: values.telefono,
    direccion: values.direccion,
    password: values.password, 
    rol: values.rol
  }
    
   console.log("🚀 Creando usuario...", userData,idUserLogin);
    try {
       const response = await createUser({data:userData, userLoginId:idUserLogin}).unwrap();
      if (response) {
        setMessage("Usuario creado correctamente");

        setTimeout(() => {
          router.push("/dashboard/usuarios");
        }, 1500);
      } else {
        setMessage("Error al crear el usuario");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al crear el usuario.";
      setError(errorMessage);
    }
  }

  if (isLoadingUsers)  return (
          <section className="container mx-auto py-10">
           <Loader2 className="animate-spin h-48 w-48  mx-auto" />
          </section>
        );

  //verificar si el usuario ya existe
  const verifyEmailHandler = async (email: string) => {
    if (!email || form.formState.errors.email) {
      setErrorMailMessage("Por favor ingrese un email válido");
      setVerifyMail(true);
      return;
    }

    console.log("🚀 Enviando usuario desde mutation:", data);

    const user = data?.data?.find((user: User) => user.email === email);
    if (user) {
      console.log("🚀 Usuario encontrado:", user);
      setErrorMailMessage("El mail ya está registrado");
      setVerifyMail(true);
    } else {
      console.log("🚀 Email disponible");
      setErrorMailMessage("Email disponible");
      setVerifyMail(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => verifyEmailHandler(field.value)}
                >
                  Verificar
                </Button>
                {verifyMail ? (
                  <div className="flex items-center gap-1 text-red-500">
                    <MailWarning className="h-4 w-4" />
                    <span>{MailMessage}</span>
                  </div>
                ) : MailMessage ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <MailCheck className="h-4 w-4" />
                    <span>{MailMessage}</span>
                  </div>
                ) : null}
                <FormDescription>Email del usuario</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="rol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un tipo de medida" />
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
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Contraseña para el nuevo usuario.
                </FormDescription>
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


        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Usuario"}
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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mensaje && (
          <Alert className="border-green-200 ">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {mensaje}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Form>
  );
};

export default CreateUserForm;
