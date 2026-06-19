"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Inicio",
  alumnos: "Alumnos",
  asistencias: "Asistencias",
  ciclos: "Ciclos",
  clases: "Clases",
  grados: "Grados",
  horarios: "Horarios",
  materias: "Asignaturas",
  notas: "Notas",
  ponderaciones: "Ponderaciones",
  secciones: "Secciones",
  tutores: "Tutores",
  usuarios: "Usuarios",
  notices: "Comunicados",
  complains: "Reclamos",
  calendario: "Calendario",
  nuevo: "Nuevo",
  nueva: "Nueva",
  edit: "Editar",
  "mis-clases": "Mis clases",
  "mis-materias": "Mis asignaturas",
  informacion: "Información",
  "subir-excel": "Subir Excel",
  maestros: "Maestros",
  profile: "Mi Perfil",
  "alumno-nuevo": "Nueva asistencia alumno",
  "docente-nuevo": "Nueva asistencia docente",
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const items = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/")
    const isNumeric = /^\d+$/.test(seg)
    const label = isNumeric ? `#${seg}` : (SEGMENT_LABELS[seg] ?? seg)
    const isLast = i === segments.length - 1
    return { label, href, isLast }
  })

  if (items.length <= 1) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => (
          <React.Fragment key={item.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
