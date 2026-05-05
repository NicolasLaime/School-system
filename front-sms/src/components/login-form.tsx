"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/redux/services/authApi"
import { useState } from "react"
import { toast } from "sonner"
import { loginSlice } from "@/redux/features/userSlice"
import { ApiError } from "../../types/RootState"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = loginData;
    console.log("Login data:", email, password);
    try {
      if (email && password) {
        const response = await login({ email, password }).unwrap(); // <-- importante
        console.log("Response login:", response);
        const user = response.data;
        const accessToken = response.accessToken;

     
        
        if (user) {
          dispatch(loginSlice({ userLogin: user, accessToken }));
          toast("Bienvenido " + user.nombre, {
            position: "top-center",
            action: {
              label: "Ir al dashboard",
              onClick: () => router.push("/dashboard"),
            },
          });
          setErrorMessage("");
        } else {
          setErrorMessage("No se pudo obtener la información del usuario");
        }
      } else {
        setErrorMessage("Por favor, rellene todos los campos");
      }
    } catch (err) {
      // el catch ahora sí se ejecutará
      const errorMsg =
        (err as ApiError)?.data?.message ||
        (err instanceof Error ? err.message : "Error inesperado");
      setErrorMessage(errorMsg);
    }
  };



  return (
    <div className={cn("flex flex-col gap-6 w-[60vw]  h-[70vh]", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
              </div>
              <Button type="submit" className="w-full">
                {isLoading ? "Cargando..." : "Login"}
              </Button>
            </div>
            {errorMessage && (
              <p className="mt-4 text-center text-sm text-red-600">
                {errorMessage}
              </p>
            )}
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/fondoLogin.jpg"
              width={500}
              height={500}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
