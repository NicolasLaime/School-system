"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/redux/services/authApi"
import { useState } from "react"
import { toast } from "sonner"
import { loginSlice } from "@/redux/features/userSlice"
import { ApiError } from "../../types/RootState"
import { jwtDecode } from "jwt-decode";


interface JwtPayload {
  sub: string;      // email
  role: string;     // "ROLE_DIRECTIVO"
  userId: number    // user id
  iss: string;
  iat: number;
  exp: number;
  jti: string;
  nbf: number;
}

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
  try {
    if (email && password) {
      const response = await login({ email, password }).unwrap();
      const token = response.token; // <-- ahora solo viene el token

      // Decodificás el token para obtener los datos del usuario
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("decoded", decoded)

      dispatch(loginSlice({ 
        userLogin: {
          email: decoded.sub,
          role: decoded.role,
          userId: decoded.userId
        }, 
        accessToken: token 
      }));

      toast("Bienvenido", { position: "top-center" });
      router.push("/dashboard");
      setErrorMessage("");
    }
  } catch (err) {
    const errorMsg =
      (err as ApiError)?.data?.message ||
      (err instanceof Error ? err.message : "Error inesperado");
    setErrorMessage(errorMsg);
  }
};



  return (
    <div className={cn("flex flex-col gap-8 w-full max-w-[400px]", className)} {...props}>
      <Card className="overflow-hidden border border-border/40 bg-card shadow-2xl shadow-black/5 rounded-2xl">
        <CardContent className="p-8 md:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Bienvenido</h1>
              <p className="text-sm text-muted-foreground">
                Ingresa tus credenciales para acceder al portal
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@colegio.com"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="h-11 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" title="password" className="text-sm font-medium">Contraseña</Label>
                  <a
                    href="#"
                    className="text-xs text-primary hover:underline underline-offset-4"
                  >
                    ¿Olvidaste tu contraseña?
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
                  className="h-11 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Cargando...
                </span>
              ) : "Iniciar sesión"}
            </Button>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-xs text-center text-destructive font-medium">
                  {errorMessage}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      <p className="px-8 text-center text-xs text-muted-foreground">
        Al iniciar sesión, aceptas nuestros{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Términos de servicio
        </a>{" "}
        y{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Política de privacidad
        </a>.
      </p>
    </div>

  )
}
