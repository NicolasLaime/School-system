"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"
import {
  Users,
  BookOpen,
  GraduationCap,
  CalendarCheck,
  FileText,
  ClipboardList,
  UserCheck,
  Clock,
} from "lucide-react"
import { StatsCard } from "./StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityFeed } from "./ActivityFeed"
import Link from "next/link"

const attendanceData = [
  { day: "Lun", presentes: 120, ausentes: 8, tardanzas: 5 },
  { day: "Mar", presentes: 115, ausentes: 10, tardanzas: 7 },
  { day: "Mié", presentes: 125, ausentes: 5, tardanzas: 3 },
  { day: "Jue", presentes: 118, ausentes: 9, tardanzas: 6 },
  { day: "Vie", presentes: 110, ausentes: 12, tardanzas: 8 },
  { day: "Sáb", presentes: 105, ausentes: 15, tardanzas: 4 },
  { day: "Lun", presentes: 122, ausentes: 6, tardanzas: 4 },
  { day: "Mar", presentes: 119, ausentes: 8, tardanzas: 5 },
  { day: "Mié", presentes: 124, ausentes: 4, tardanzas: 3 },
  { day: "Jue", presentes: 117, ausentes: 10, tardanzas: 6 },
  { day: "Vie", presentes: 112, ausentes: 11, tardanzas: 7 },
  { day: "Sáb", presentes: 108, ausentes: 13, tardanzas: 5 },
  { day: "Lun", presentes: 121, ausentes: 7, tardanzas: 4 },
  { day: "Mar", presentes: 116, ausentes: 9, tardanzas: 6 },
  { day: "Mié", presentes: 123, ausentes: 5, tardanzas: 3 },
  { day: "Jue", presentes: 120, ausentes: 8, tardanzas: 5 },
  { day: "Vie", presentes: 111, ausentes: 12, tardanzas: 7 },
  { day: "Sáb", presentes: 106, ausentes: 14, tardanzas: 4 },
  { day: "Lun", presentes: 118, ausentes: 9, tardanzas: 6 },
  { day: "Mar", presentes: 114, ausentes: 11, tardanzas: 5 },
]

const gradesRadarData = [
  { subject: "Matemáticas", A: 85, B: 78, C: 92, fullMark: 100 },
  { subject: "Lengua", A: 90, B: 82, C: 88, fullMark: 100 },
  { subject: "Ciencias", A: 78, B: 85, C: 80, fullMark: 100 },
  { subject: "Historia", A: 88, B: 75, C: 85, fullMark: 100 },
  { subject: "Inglés", A: 82, B: 80, C: 90, fullMark: 100 },
  { subject: "Arte", A: 75, B: 88, C: 86, fullMark: 100 },
]

const quickLinksAdmin = [
  { label: "Nuevo alumno", href: "/dashboard/alumnos/nuevo", icon: GraduationCap },
  { label: "Nuevo usuario", href: "/dashboard/usuarios/nuevo", icon: Users },
  { label: "Ver asistencias", href: "/dashboard/asistencias/alumno-nuevo", icon: CalendarCheck },
  { label: "Gestionar notas", href: "/dashboard/notas", icon: FileText },
  { label: "Calendario", href: "/dashboard/calendario", icon: Clock },
  { label: "Comunicados", href: "/dashboard/notices", icon: ClipboardList },
]

const quickLinksDocente = [
  { label: "Registrar asistencia", href: "/dashboard/asistencias/alumno-nuevo", icon: CalendarCheck },
  { label: "Cargar notas", href: "/dashboard/notas/nuevo", icon: FileText },
  { label: "Mis clases", href: "/dashboard/clases/mis-clases", icon: BookOpen },
  { label: "Ver alumnos", href: "/dashboard/alumnos", icon: GraduationCap },
]

export function DashboardKPIs({ role = "ROLE_ADMIN" }: { role?: string }) {
  const isDocente = role === "ROLE_DOCENTE"
  const quickLinks = isDocente ? quickLinksDocente : quickLinksAdmin

  return (
    <div className="space-y-6">
      {isDocente ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Mis clases" value={6} icon={BookOpen} iconColor="primary" />
          <StatsCard title="Alumnos activos" value={124} icon={UserCheck} iconColor="success" />
          <StatsCard title="Calificaciones pendientes" value={18} icon={FileText} iconColor="warning" />
          <StatsCard title="Próxima clase" value="2h 30m" icon={Clock} iconColor="info" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Alumnos" value={1250} icon={GraduationCap} iconColor="primary" trend={12} />
          <StatsCard title="Docentes" value={48} icon={Users} iconColor="info" trend={5} />
          <StatsCard title="Clases" value={36} icon={BookOpen} iconColor="success" trend={-3} />
          <StatsCard title="Asistencia hoy" value="94%" icon={CalendarCheck} iconColor="warning" trend={2} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Asistencia últimos 30 días
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="presentes" fill="var(--color-success)" radius={[4, 4, 0, 0]} name="Presentes" />
                <Bar dataKey="ausentes" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} name="Ausentes" />
                <Bar dataKey="tardanzas" fill="var(--color-warning)" radius={[4, 4, 0, 0]} name="Tardanzas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Promedio de notas por grado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={gradesRadarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <Radar
                  name="1° Año"
                  dataKey="A"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.1}
                />
                <Radar
                  name="2° Año"
                  dataKey="B"
                  stroke="var(--color-success)"
                  fill="var(--color-success)"
                  fillOpacity={0.1}
                />
                <Radar
                  name="3° Año"
                  dataKey="C"
                  stroke="var(--color-warning)"
                  fill="var(--color-warning)"
                  fillOpacity={0.1}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <ActivityFeed activities={[]} />

      <div>
        <h3 className="text-lg font-semibold mb-3">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card hover:shadow-card-hover transition-shadow text-center"
            >
              <link.icon size={20} className="text-primary" />
              <span className="text-xs font-medium text-foreground">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
