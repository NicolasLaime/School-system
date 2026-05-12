"use client"

import * as React from "react"
import {
  AlertCircle,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Command,
  FileText,
  GraduationCap,
  Home,
  Percent,
  User,
  Users,
  CalendarRange,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { selectUserLogin } from "@/redux/features/userSlice"
import { LucideIcon } from "lucide-react"

type UserRole = 'ROLE_ADMIN' | 'ROLE_DOCENTE' | 'ROLE_DIRECTIVO' | 'ROLE_SUPERADMIN';

interface NavItem {
  title: string;
  url: string;
  rol?: UserRole[];
}

interface NavSection {
  title: string;
  url: string;
  icon: LucideIcon;
  rol?: UserRole[];
  items?: NavItem[];
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  const userLogin = useSelector(selectUserLogin);

  console.log("User Login in Sidebar:", userLogin);

  const userRole = userLogin?.role || "ROLE_ADMIN";

const fullNav: NavSection[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    items: [{ title: "Inicio", url: "/dashboard" }],
  },
  {
    title: "Clases",
    url: "/dashboard/clases",
    icon: BookOpen,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
    items: [
      { 
        title: "Listado de clases", 
        url: "/dashboard/clases",
        rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      },
      { 
        title: "Mis Clases", 
        url: "/dashboard/clases/mis-clases",
        rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
      },
      { 
        title: "Nueva clase", 
        url: "/dashboard/clases/nueva",
        rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      }
    ],
  },
  {
    title: "Asignaturas",
    url: "/dashboard/materias",
    icon: ClipboardList,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
    items: [
      { title: "Listado de asignaturas", 
        url: "/dashboard/materias",
        rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      },
      {
        title: "Mis asignaturas",
        url: "/dashboard/materias/mis-materias",
        rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
      },
      {
        title: "Nueva asignatura",
        url: "/dashboard/materias/nueva",
        rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      }
      ],
  },
  {
    title: "Ciclos",
    url: "/dashboard/ciclos",
    icon: CalendarRange,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
    items: [{ 
      title: "Listado de ciclos", 
      url: "/dashboard/ciclos" },
    {
      title: "Nuevo ciclo",
      url: "/dashboard/ciclos/nuevo",
    }],
  },
  {
    title: "Grados",
    url: "/dashboard/grados",
    icon: GraduationCap,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
    items: [{ 
      title: "Listado de grados", 
      url: "/dashboard/grados" },
    {
      title: "Nuevo grado",
      url: "/dashboard/grados/nuevo",
    }],
  },
  {
    title: "Secciones",
    url: "/dashboard/secciones",
    icon: ClipboardList,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
    items: [{ 
      title: "Listado de secciones", 
      url: "/dashboard/secciones" },
    {
      title: "Nueva seccion",
      url: "/dashboard/secciones/nuevo",
    }],
  },
  {
    title: "Horarios",
    url: "/dashboard/horarios",
    icon: CalendarRange,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
    items: [{ 
      title: "Listado de horarios", 
      url: "/dashboard/horarios" },
    {
      title: "Nuevo horario",
      url: "/dashboard/horarios/nuevo",
    }],
  },
  {
    title: "Asistencias",
    url: "/dashboard/asistencias",
    icon: CalendarCheck,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
    items: [{ 
      title: "Listado de asistencias", 
      url: "/dashboard/asistencias" },
    {
      title: "Asistencia alumnos",
      url: "/dashboard/asistencias/alumno-nuevo",
    },
    {
      title: "Asistencia docente",
      url: "/dashboard/asistencias/docente-nuevo",
    }],
  },
  {
    title: "Ponderaciones",
    url: "/dashboard/ponderaciones",
    icon: Percent,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
    items: [{ 
      title: "Listado de ponderaciones", 
      url: "/dashboard/ponderaciones" },
    {
      title: "Nueva ponderacion",
      url: "/dashboard/ponderaciones/nuevo",
    }],
  },
  {
    title: "Usuarios",
    url: "/dashboard/usuarios",
    icon: Users,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
    items: [{ 
      title: "Listado de usuarios", 
      url: "/dashboard/usuarios" },
      {
        title: "Maestros",
        url: "/dashboard/usuarios/maestros",
      },
    {
      title: "Nuevo usuario",
      url: "/dashboard/usuarios/nuevo",
    }],
  },
  {
    title: "Alumnos",
    url: "/dashboard/alumnos",
    icon: GraduationCap,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
    items: [{ 
      title: "Listado de alumnos", 
      url: "/dashboard/alumnos" },
    {
      title: "Nuevo alumnos",
      url: "/dashboard/alumnos/nuevo",
    }],
  },
  {
    title: "Notas",
    url: "/dashboard/notas",
    icon: ClipboardList,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
    items: [{
      title: "Listado de notas",
      url: "/dashboard/notas"
    }, {
      title: "Nueva nota",
      url: "/dashboard/notas/nuevo"
    }],
  },
  {
    title: "Notices",
    url: "/dashboard/notices",
    icon: FileText,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
    items: [{ title: "Comunicados", url: "/dashboard/notices" }],
  },
  {
    title: "Complains",
    url: "/dashboard/complains",
    icon: AlertCircle,
    rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
    items: [{ title: "Reclamos", url: "/dashboard/complains" }],
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
    items: [{ title: "Mi perfil", url: `/dashboard/usuarios/${userLogin?.id}/edit` }],
  },
];


const navMain = fullNav
  .filter((item) => !item.rol || item.rol.includes(userRole))
  .map((item) => {
    if (item.items) {
      return {
        ...item,
        items: item.items.filter(
          (subItem) => !subItem.rol || subItem.rol.includes(userRole)
        ),
      };
    }
    return item;
  });


  // This is sample data.
const data = {
   user: {
      name: userLogin?.nombre || "Shadcn",
      email: userLogin?.email || "m@example.com",
      rol: userLogin?.role || "ROLE_SUPERADMIN",
      avatar:
        userLogin?.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  },
  teams: [
    {
      name: "Sistema de gestión",
      logo: Command,
      plan: "escolar",
    },
  ],
  navMain
}


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
