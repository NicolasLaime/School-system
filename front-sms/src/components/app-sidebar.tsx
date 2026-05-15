"use client"

import * as React from "react"
import {
  AlertCircle,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Clock,
  Command,
  FileText,
  GraduationCap,
  Home,
  LayoutGrid,
  Megaphone,
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

type UserRole = "ROLE_ADMIN" | "ROLE_DOCENTE" | "ROLE_DIRECTIVO" | "ROLE_SUPERADMIN"
type NavGroup = "academico" | "organizacion" | "personas" | "comunicacion"

interface NavItem {
  title: string
  url: string
  rol?: UserRole[]
}

interface NavSection {
  title: string
  url: string
  icon: LucideIcon
  rol?: UserRole[]
  items?: NavItem[]
  group?: NavGroup
  isSeparator?: boolean
}

const GROUP_LABELS: Record<NavGroup, string> = {
  academico: "Académico",
  organizacion: "Organización",
  personas: "Personas",
  comunicacion: "Comunicación",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userLogin = useSelector(selectUserLogin)
  const userRole = (userLogin?.role || "ROLE_ADMIN") as UserRole

  const fullNav: NavSection[] = [
    // ── Sin grupo (siempre visible) ──────────────────────────────
    {
      title: "Inicio",
      url: "/dashboard",
      icon: Home,
      items: [{ title: "Inicio", url: "/dashboard" }],
    },

    // ── ACADÉMICO ────────────────────────────────────────────────
    {
      title: "Clases",
      url: "/dashboard/clases",
      icon: BookOpen,
      group: "academico",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
      items: [
        {
          title: "Listado de clases",
          url: "/dashboard/clases",
          rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
        },
        {
          title: "Mis clases",
          url: "/dashboard/clases/mis-clases",
          rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
        },
        {
          title: "Nueva clase",
          url: "/dashboard/clases/nueva",
          rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
        },
      ],
    },
    {
      title: "Asignaturas",
      url: "/dashboard/materias",
      icon: ClipboardList,
      group: "academico",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
      items: [
        {
          title: "Listado de asignaturas",
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
        },
      ],
    },
    {
      title: "Notas",
      url: "/dashboard/notas",
      icon: FileText,
      group: "academico",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
      items: [
        { title: "Listado de notas", url: "/dashboard/notas" },
        { title: "Nueva nota", url: "/dashboard/notas/nuevo" },
      ],
    },
    {
      title: "Ponderaciones",
      url: "/dashboard/ponderaciones",
      icon: Percent,
      group: "academico",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      items: [
        { title: "Listado de ponderaciones", url: "/dashboard/ponderaciones" },
        { title: "Nueva ponderación", url: "/dashboard/ponderaciones/nuevo" },
      ],
    },

    // ── ORGANIZACIÓN ─────────────────────────────────────────────
    {
      title: "Ciclos",
      url: "/dashboard/ciclos",
      icon: CalendarRange,
      group: "organizacion",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      items: [
        { title: "Listado de ciclos", url: "/dashboard/ciclos" },
        { title: "Nuevo ciclo", url: "/dashboard/ciclos/nuevo" },
      ],
    },
    {
      title: "Grados",
      url: "/dashboard/grados",
      icon: GraduationCap,
      group: "organizacion",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      items: [
        { title: "Listado de grados", url: "/dashboard/grados" },
        { title: "Nuevo grado", url: "/dashboard/grados/nuevo" },
      ],
    },
    {
      title: "Secciones",
      url: "/dashboard/secciones",
      icon: LayoutGrid,
      group: "organizacion",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      items: [
        { title: "Listado de secciones", url: "/dashboard/secciones" },
        { title: "Nueva sección", url: "/dashboard/secciones/nuevo" },
      ],
    },
    {
      title: "Horarios",
      url: "/dashboard/horarios",
      icon: Clock,
      group: "organizacion",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      items: [
        { title: "Listado de horarios", url: "/dashboard/horarios" },
        { title: "Nuevo horario", url: "/dashboard/horarios/nuevo" },
      ],
    },

    // ── PERSONAS ─────────────────────────────────────────────────
    {
      title: "Usuarios",
      url: "/dashboard/usuarios",
      icon: Users,
      group: "personas",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      items: [
        { title: "Listado de usuarios", url: "/dashboard/usuarios" },
        { title: "Maestros", url: "/dashboard/usuarios/maestros" },
        { title: "Nuevo usuario", url: "/dashboard/usuarios/nuevo" },
      ],
    },
    {
      title: "Alumnos",
      url: "/dashboard/alumnos",
      icon: GraduationCap,
      group: "personas",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
      items: [
        { title: "Listado de alumnos", url: "/dashboard/alumnos" },
        { title: "Nuevo alumno", url: "/dashboard/alumnos/nuevo" },
      ],
    },
    {
      title: "Asistencias",
      url: "/dashboard/asistencias",
      icon: CalendarCheck,
      group: "personas",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
      items: [
        { title: "Listado de asistencias", url: "/dashboard/asistencias" },
        { title: "Asistencia alumnos", url: "/dashboard/asistencias/alumno-nuevo" },
        { title: "Asistencia docente", url: "/dashboard/asistencias/docente-nuevo" },
      ],
    },

    // ── COMUNICACIÓN ─────────────────────────────────────────────
    {
      title: "Comunicados",
      url: "/dashboard/notices",
      icon: Megaphone,
      group: "comunicacion",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO", "ROLE_DOCENTE"],
      items: [{ title: "Comunicados", url: "/dashboard/notices" }],
    },
    {
      title: "Reclamos",
      url: "/dashboard/complains",
      icon: AlertCircle,
      group: "comunicacion",
      rol: ["ROLE_ADMIN", "ROLE_DIRECTIVO"],
      items: [{ title: "Reclamos", url: "/dashboard/complains" }],
    },

    // ── Sin grupo (siempre visible) ──────────────────────────────
    {
      title: "Mi perfil",
      url: "/dashboard/profile",
      icon: User,
      items: [{ title: "Mi perfil", url: `/dashboard/usuarios/${userLogin?.userId}/edit` }],
    },
  ]

  // 1. Filtrar por rol
  const filteredNav = fullNav
    .filter((item) => !item.rol || item.rol.includes(userRole))
    .map((item) => ({
      ...item,
      items: item.items?.filter(
        (subItem) => !subItem.rol || subItem.rol.includes(userRole)
      ),
    }))

  // 2. Insertar separadores de grupo entre secciones
  const navMain = filteredNav.reduce<NavSection[]>((acc, item, i) => {
    const prevGroup = filteredNav[i - 1]?.group
    if (item.group && item.group !== prevGroup) {
      acc.push({
        title: GROUP_LABELS[item.group],
        url: "#",
        icon: Home,       // requerido por el tipo pero NavMain lo ignora en separadores
        isSeparator: true,
      })
    }
    acc.push(item)
    return acc
  }, [])

  const data = {
    user: {
      name: userLogin?.nombre || "Usuario",
      email: userLogin?.email || "usuario@ejemplo.com",
      rol: userLogin?.role || "ROLE_SUPERADMIN",
      avatar:
        userLogin?.avatar ||
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
    teams: [
      {
        name: "Sistema de gestión",
        logo: Command,
        plan: "escolar",
      },
    ],
    navMain,
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