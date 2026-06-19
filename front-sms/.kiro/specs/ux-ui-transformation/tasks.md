# Implementation Plan: Transformación UX/UI — School Management System

## Overview

Transformación completa de UX/UI del SMS en 4 fases incrementales sobre el stack Next.js 15 + React 19 + TypeScript + Tailwind v4 + shadcn/ui. Cada fase es independientemente desplegable y construye sobre la anterior sin romper la funcionalidad existente.

**Gestor de paquetes:** `pnpm`  
**Idioma:** TypeScript

---

## Tasks

- [x] 1. Fase 1 — Fundamentos del Design System
  - [x] 1.1 Instalar dependencias nuevas con versiones exactas
    - Ejecutar `pnpm add framer-motion@12.23.6 recharts@2.15.4 react-big-calendar@1.18.0`
    - Ejecutar `pnpm add -D @types/react-big-calendar@1.8.14`
    - Verificar en `package.json` que las 4 dependencias estén con versiones exactas (sin `^` ni `~`)
    - _Requisitos: 13.1, 13.2, 13.3, 13.5_

  - [x] 1.2 Ampliar `globals.css` con tokens semánticos de color y tipografía
    - Agregar tokens `--success`, `--success-foreground`, `--success-muted`, `--warning`, `--warning-foreground`, `--warning-muted`, `--info`, `--info-foreground`, `--info-muted` con valores OKLCH en `:root` y `.dark`
    - Agregar tokens de superficie `--surface`, `--surface-2`, `--surface-foreground` en `:root` y `.dark`
    - Agregar tokens de sombra `--shadow-card`, `--shadow-card-hover`, `--shadow-dropdown`, `--shadow-modal`, `--shadow-focus` en `:root`
    - Agregar escala tipográfica `--font-size-xs` (11px) hasta `--font-size-3xl` (30px) — 7 niveles
    - Agregar variables `--topbar-height: 3.5rem` y `--sidebar-width: 15rem` / `--sidebar-width-icon: 3.5rem`
    - Registrar todos los tokens en el bloque `@theme inline` para exponerlos como clases Tailwind (`text-success`, `bg-warning`, etc.)
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 1.3 Escribir test de propiedad para contraste WCAG de tokens
    - **Property 7: Contraste WCAG 2.1 AA — Ratio ≥ 4.5:1**
    - **Validates: Requirements 1.7, 11.1**
    - Crear `src/components/__tests__/design-tokens.pbt.test.ts` con fast-check
    - Verificar que cada par `token/token-foreground` supera ratio 4.5:1 en modo claro y oscuro
    - _Requisitos: 1.7, 11.1_

  - [x] 1.4 Corregir carga de fuente Inter y actualizar metadata global en `src/app/layout.tsx`
    - Importar `Inter` desde `next/font/google` con `subsets: ["latin"]`, `variable: "--font-sans"`, `display: "swap"`, pesos `["400","500","600","700"]`
    - Aplicar `inter.variable` como clase en `<html>` junto con `lang="es"` y `suppressHydrationWarning`
    - Definir `metadata` con `title.default`, `title.template` (`"%s | SMS"`), descripción e iconos (`favicon.ico`, `apple-touch-icon.png`)
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.5 Crear `src/lib/animations.ts` con variantes de Framer Motion
    - Exportar `pageTransition`: `opacity 0→1`, `y 8→0`, 250ms easeOut + exit `y 0→-8`
    - Exportar `cardEntrance`: `opacity 0→1`, `scale 0.96→1`, 300ms con delay `i * 0.06s` por índice
    - Exportar `staggerContainer` con `staggerChildren: 0.05`
    - Exportar `fadeInUp`: `opacity 0→1`, `y 16→0`, 350ms easeOut
    - _Requisitos: 8.1_

  - [x] 1.6 Crear hook `src/hooks/useCountUp.ts`
    - Implementar con `requestAnimationFrame` y easing `easeOutCubic` (`1 - Math.pow(1 - progress, 3)`)
    - Retornar `0` en el primer render, animar hasta `target` en la duración indicada (default 800ms)
    - Detener la animación exactamente en `target` al completarse
    - _Requisitos: 8.7, 5.4_

  - [ ]* 1.7 Escribir test de propiedad para `useCountUp`
    - **Property 10: useCountUp — Converge al valor objetivo para cualquier target positivo**
    - **Validates: Requirements 5.4, 8.7**
    - Crear `src/hooks/__tests__/useCountUp.pbt.test.ts`
    - Verificar: (a) inicia en 0, (b) incrementa monotónicamente, (c) converge exactamente a `target`
    - _Requisitos: 5.4, 8.7_

- [x] 2. Checkpoint Fase 1 — Verificar fundamentos
  - Asegurar que `globals.css` compila sin errores de Tailwind v4
  - Verificar que `next dev` arranca sin errores de fuente ni módulos faltantes
  - Confirmar que las 4 dependencias aparecen en `node_modules`
  - Preguntar al usuario si tiene dudas antes de continuar


- [x] 3. Fase 2 — Layout y Navegación
  - [x] 3.1 Crear `src/components/shared/RoleBadge.tsx`
    - Definir `UserRole` type y `RoleBadgeProps` interface según diseño §10.10
    - Implementar `ROLE_CONFIG` con label, ícono Lucide y clases de color semántico para los 4 roles
    - Renderizar `Badge` con `variant="outline"`, ícono + texto (o solo ícono cuando `iconOnly=true`)
    - Aplicar colores: primary / info-muted / warning-muted / success-muted según rol
    - _Requisitos: 4.8, 4.9, 11.5_

  - [ ]* 3.2 Escribir test de propiedad para `RoleBadge`
    - **Property 3: RoleBadge — Etiqueta, ícono y color correctos para cualquier rol válido**
    - **Validates: Requirements 4.8, 4.9, 10.5**
    - Crear `src/components/__tests__/role-badge.pbt.test.ts` con fast-check
    - Verificar para cada `Rol_Valido`: etiqueta visible, ícono correcto, clase de color semántico presente
    - _Requisitos: 4.8, 4.9_

  - [x] 3.3 Crear `src/components/layout/AnimatedPage.tsx`
    - Wrapper `motion.div` con variante `pageTransition` (initial="hidden" animate="visible" exit="exit")
    - Aceptar `routeKey` opcional para forzar re-animación en cambio de ruta
    - Respetar `prefers-reduced-motion` deshabilitando las variantes cuando la media query está activa
    - _Requisitos: 8.2, 8.5, 8.6_

  - [x] 3.4 Crear `src/components/layout/DynamicBreadcrumb.tsx`
    - Usar `usePathname()` para extraer segmentos de la ruta
    - Mapear segmentos a etiquetas legibles usando `SEGMENT_LABELS` según diseño §13.5
    - Tratar segmentos numéricos como `#ID`
    - Renderizar con `<nav aria-label="breadcrumb">` usando componentes Breadcrumb de shadcn/ui
    - _Requisitos: 3.5, 11.3_

  - [x] 3.5 Crear `src/components/layout/DashboardTopbar.tsx`
    - Elemento `<header>` con clase `sticky top-0 z-40 flex h-14` + `backdrop-blur-md` + `border-b`
    - Contener: `SidebarTrigger` a la izquierda, `Separator` vertical, `DynamicBreadcrumb` y acciones (`ModeToggle`) a la derecha
    - _Requisitos: 3.4, 3.5, 11.2_

  - [x] 3.6 Crear `src/components/layout/DashboardLayout.tsx`
    - Usar `SidebarInset` como raíz con `flex flex-col min-h-screen`
    - Incluir `DashboardTopbar` en la parte superior
    - Área `<main>` con `flex-1 overflow-y-auto bg-surface`
    - Contenedor interno `max-w-7xl mx-auto` con padding responsivo: `px-4 py-4` mobile / `px-5 py-5` tablet / `px-6 py-6` desktop / `px-8 py-8` wide
    - _Requisitos: 3.1, 3.2, 3.3_

  - [x] 3.7 Crear `src/components/layout/PageHeader.tsx`
    - Definir `BreadcrumbItem` y `PageHeaderProps` interfaces según diseño §10.3
    - Renderizar título como `<h1 className="text-2xl font-semibold tracking-tight">`
    - Renderizar descripción en `text-sm text-muted-foreground` cuando esté presente
    - Renderizar Breadcrumb de shadcn/ui con "Inicio" como primer ítem fijo cuando se pasen breadcrumbs
    - Slot `actions` alineado a la derecha
    - _Requisitos: 3.7, 3.8, 11.2_

  - [ ]* 3.8 Escribir test de propiedad para `PageHeader`
    - **Property 9: PageHeader — Renderiza título, descripción y breadcrumbs para cualquier input válido**
    - **Validates: Requirements 3.7, 3.8**
    - Crear `src/components/__tests__/page-header.pbt.test.ts` con fast-check
    - Verificar: (a) `h1` siempre presente, (b) descripción solo cuando se pasa, (c) "Inicio" siempre como primer ítem del breadcrumb
    - _Requisitos: 3.7, 3.8_

  - [x] 3.9 Refactorizar `src/app/dashboard/layout.tsx`
    - Reemplazar el `<main>` sin estructura por `<DashboardLayout>` que envuelve los `{children}`
    - Envolver `{children}` en `<AnimatedPage>` dentro de `DashboardLayout`
    - Pasar `defaultOpen={false}` a `<HelpChat>` para que inicie colapsado
    - Importar y usar `DashboardLayout` y `AnimatedPage` recién creados
    - _Requisitos: 14.1, 3.1, 3.6_

  - [x] 3.10 Refactorizar `src/components/nav-main.tsx`
    - Agregar directiva `"use client"` si no existe
    - Importar `usePathname` de `next/navigation` e implementar función `isActive(url)` según diseño §7.1
    - Reemplazar etiquetas `<a>` por componente `Link` de `next/link` en todos los ítems
    - Pasar `isActive={active}` a `SidebarMenuButton` y `SidebarMenuSubButton`
    - Pasar `defaultOpen={active || hasActiveChild}` al `Collapsible` de los ítems con subitems
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 14.2_

  - [ ]* 3.11 Escribir test de propiedad para la detección de ruta activa en `NavMain`
    - **Property 2: Detección correcta de ruta activa en NavMain**
    - **Validates: Requirements 4.1, 4.2, 4.4**
    - Crear `src/components/__tests__/nav-main.pbt.test.ts` con fast-check
    - Verificar que `isActive(url, pathname)` retorna `true` si y solo si las condiciones del diseño se cumplen
    - _Requisitos: 4.1, 4.2, 4.4_

  - [x] 3.12 Refactorizar `src/components/nav-user.tsx` y `src/components/app-sidebar.tsx`
    - En `nav-user.tsx`: aceptar `rol` en props, mostrar `RoleBadge` debajo del email, usar `AvatarImage` con URL del gravatar del store, traducir "Log out" → "Cerrar sesión"
    - En `app-sidebar.tsx`: agregar función `filterNavByRole(nav, role)` que filtra ítems según la propiedad `rol` del ítem; agregar ítem "Calendario" con ícono `CalendarDays` en grupo "Organización" visible para todos los roles; agregar grupo "Comunicación" con "Comunicados" y "Reclamos" visible para ROLE_ADMIN, ROLE_DIRECTIVO, ROLE_SUPERADMIN
    - _Requisitos: 4.5, 4.6, 4.7, 4.10, 7.9, 10.3, 14.3_

  - [ ]* 3.13 Escribir test de propiedad para filtrado de sidebar por rol
    - **Property 1: Sidebar — Solo ítems permitidos por rol**
    - **Validates: Requirements 4.10, 6.9**
    - Crear `src/components/__tests__/app-sidebar.pbt.test.ts` con fast-check
    - Verificar que `filterNavByRole(fullNav, role)` nunca contiene ítems ni subitems cuya prop `rol` no incluya el rol activo
    - _Requisitos: 4.10_

  - [x] 3.14 Refactorizar `HelpChat` para iniciar colapsado
    - Agregar prop `defaultOpen?: boolean` (default `false`) al componente
    - Asegurar que el panel de chat solo se muestra cuando el usuario lo activa
    - El botón FAB flotante debe permanecer siempre visible
    - _Requisitos: 14.7_

- [x] 4. Checkpoint Fase 2 — Verificar layout y navegación
  - Comprobar que todos los módulos existentes cargan correctamente con el nuevo layout
  - Verificar que el sidebar marca el ítem activo según la ruta
  - Verificar que el dark mode sigue funcionando
  - Verificar que el sidebar colapsa correctamente en mobile
  - Preguntar al usuario si tiene dudas antes de continuar


- [ ] 5. Fase 3 — Tablas y Componentes Compartidos
  - [x] 5.1 Crear `src/components/shared/EmptyState.tsx`
    - Definir `EmptyStateProps` interface según diseño §10.6
    - Aplicar variante `fadeInUp` de Framer Motion al montar (`motion.div`)
    - Renderizar: ícono en contenedor redondeado `bg-muted`, título `text-base font-semibold`, descripción `text-sm text-muted-foreground`, botón de acción opcional con `variant` configurable
    - Aceptar slot `illustration` que reemplaza el ícono por defecto
    - _Requisitos: 6.3, 6.11, 8.4_

  - [x] 5.2 Crear `src/components/shared/SkeletonTable.tsx`
    - Definir `SkeletonTableProps` con `rows`, `columns`, `showToolbar`, `showPagination`
    - Renderizar toolbar skeleton (search 64px + botones), header skeleton y filas con `animationDelay: rowIdx * 50ms`
    - Usar filas alternadas `bg-background` / `bg-muted/20`
    - _Requisitos: 6.4, 6.10, 7.7_

  - [x] 5.3 Crear `src/components/shared/SkeletonCard.tsx`
    - Renderizar 3 bloques `Skeleton` de tamaños correspondientes a ícono, valor y label del `StatsCard`
    - _Requisitos: 5.3_

  - [x] 5.4 Crear utilidades de exportación en `src/lib/export/`
    - Crear `src/lib/export/exportToPdf.ts` con función `exportToPdf()` usando `jsPDF` + `jspdf-autotable` (ya instalados)
    - Generar PDF en orientación landscape con header (título, subtítulo, fecha generación) y tabla con estilos premium
    - Nombre de archivo: `{filename}_{fecha-ISO}.pdf`
    - Crear `src/lib/export/exportToExcel.ts` con función `exportToExcel()` usando `xlsx` (ya instalado)
    - Construir worksheet con headers y anchos de columna configurables, nombre de archivo: `{filename}_{fecha-ISO}.xlsx`
    - _Requisitos: 6.7, 6.8_

  - [x] 5.5 Crear `src/components/shared/ExportMenu.tsx`
    - Definir `ExportMenuProps` interface según diseño §10.11
    - Renderizar `DropdownMenu` con botón disparador "Exportar" y dos ítems: "Exportar PDF" y "Exportar Excel"
    - Llamar `exportToPdf()` / `exportToExcel()` con la configuración de columnas y datos pasados como props
    - Invocar callbacks `onExportStart` y `onExportComplete` cuando corresponda
    - _Requisitos: 6.6, 6.7, 6.8_

  - [x] 5.6 Crear `src/components/shared/DataTableEnhanced.tsx`
    - Definir `ExportConfig` y `DataTableEnhancedProps<TData, TValue>` interfaces según diseño §10.5
    - Integrar `useReactTable` de TanStack Table v8 con `globalFilterFn: "includesString"` cuando `globalSearch=true`
    - Normalizar búsqueda global: `toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")` para insensibilidad a mayúsculas y diacríticos
    - Mostrar `SkeletonTable` cuando `isLoading=true`; mostrar `EmptyState` cuando `data.length === 0`
    - Controles de paginación en español: "Anterior", "Siguiente", "de N páginas", selector de filas/página
    - Control de visibilidad de columnas con etiqueta "Columnas"
    - Renderizar `ExportMenu` en la toolbar cuando `exportConfig` está definido
    - Slot `primaryAction` y `toolbarActions` en la toolbar
    - _Requisitos: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.9, 12.6_

  - [ ]* 5.7 Escribir test de propiedad para EmptyState en `DataTableEnhanced`
    - **Property 5: Tablas — EmptyState siempre visible cuando `data.length === 0`**
    - **Validates: Requirements 6.3**
    - Crear `src/components/__tests__/data-table-enhanced.pbt.test.ts` con fast-check
    - Generar configuraciones arbitrarias de columnas (1–20 columnas) y verificar que con `data=[]` el tbody no contiene filas de datos
    - _Requisitos: 6.3_

  - [x] 5.8 Crear `src/components/shared/StatusBadge.tsx`
    - Badge semántico para estados: activo (success), inactivo (destructive), pendiente (warning)
    - Aplicar colores semánticos del nuevo design system
    - _Requisitos: 1.1_

  - [x] 5.9 Migrar tabla de módulo `alumnos` a `DataTableEnhanced`
    - Reemplazar `src/app/dashboard/alumnos/data-table.tsx` (si existe) pasando columnas y `exportConfig` como props a `DataTableEnhanced`
    - Configurar `searchPlaceholder` en español, `globalSearch=true` y `emptyStateProps` apropiado
    - Corregir el filtro que estaba hardcodeado en columna `"id"`
    - _Requisitos: 14.4, 6.2_

  - [x] 5.10 Migrar tablas de módulos restantes a `DataTableEnhanced`
    - Reemplazar los `data-table.tsx` específicos en: `clases`, `docentes`/`usuarios`, `asistencias`, `notas`, `horarios`, `grados`, `ciclos`, `secciones`, `materias`, `tutores`
    - Para cada módulo: importar `DataTableEnhanced`, pasar columnas existentes y configurar `exportConfig` con las columnas relevantes del módulo
    - _Requisitos: 14.4_

  - [x] 5.11 Refactorizar formularios para eliminar `setTimeout` en redirects
    - Buscar todos los usos de `setTimeout` con duración > 0ms en handlers de formulario y lógica de redirección post-submit
    - Reemplazar por el patrón: `toast.success(...)` + `router.push(...)` inmediato sin setTimeout
    - En caso de error de API: usar `toast.error(message ?? "Error inesperado")`
    - _Requisitos: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 5.12 Escribir test de propiedad para validación de formularios con Zod
    - **Property 4: Formularios — Nunca submit con datos inválidos según Zod**
    - **Validates: Requirements 8.3**
    - Crear `src/components/__tests__/form-validation.pbt.test.ts` con fast-check
    - Verificar que datos inválidos siempre fallan `schema.safeParse()` y datos válidos siempre pasan
    - _Requisitos: 9.3_

- [x] 6. Checkpoint Fase 3 — Verificar tablas y componentes compartidos
  - Verificar que las tablas de al menos 3 módulos muestran la búsqueda global funcionando correctamente
  - Verificar que la exportación a PDF y Excel funciona en al menos un módulo
  - Verificar que el empty state aparece cuando no hay datos
  - Verificar que el skeleton de tabla aparece durante la carga
  - Preguntar al usuario si tiene dudas antes de continuar


- [ ] 7. Fase 4 — Dashboard y Módulos Nuevos
  - [x] 7.1 Crear `src/components/dashboard/StatsCard.tsx`
    - Definir `StatsCardProps` interface según diseño §10.4 incluyendo `index?: number` para stagger
    - Renderizar skeleton con 3 bloques `Skeleton` cuando `isLoading=true`; no renderizar valor ni título ni tendencia en este estado
    - Renderizar ícono 40×40px con fondo semántico suave, valor principal `text-3xl font-bold`, título `text-sm text-muted-foreground`, indicador de tendencia con `TrendingUp`/`TrendingDown`/`Minus` y color success/destructive/muted
    - Aplicar variante `cardEntrance` con delay `index * 0.06s` usando Framer Motion
    - Usar `useCountUp(value)` cuando `animate=true` y value es número
    - _Requisitos: 5.2, 5.3, 5.4, 8.3_

  - [ ]* 7.2 Escribir test de propiedad para `StatsCard` con skeleton
    - **Property 11: StatsCard — Skeleton para cualquier props con isLoading=true**
    - **Validates: Requirements 5.2, 5.3**
    - Crear `src/components/__tests__/stats-card.pbt.test.ts` con fast-check
    - Verificar que con cualquier combinación de props y `isLoading=true`, no se renderizan valor numérico, título ni tendencia
    - _Requisitos: 5.2, 5.3_

  - [ ]* 7.3 Escribir test de propiedad para animaciones no bloqueantes
    - **Property 6: Animaciones — No bloquean interactividad**
    - **Validates: Requirements 7.3, 8.3, 8.6**
    - Crear `src/components/__tests__/animated-page.pbt.test.ts`
    - Verificar que `pointer-events` nunca es `"none"` en elementos interactivos dentro de `AnimatedPage` o `StatsCard` una vez montados
    - Verificar que el delay escalonado de `StatsCard` para índice `i` es exactamente `i * 0.06` segundos
    - _Requisitos: 8.3, 8.6_

  - [x] 7.4 Crear `src/components/dashboard/ActivityFeed.tsx`
    - Definir interface `Activity` con `id`, `actorAvatar`, `actorName`, `action`, `timestamp`
    - Renderizar lista cronológica con `Avatar` + descripción de acción + timestamp relativo por cada actividad
    - Si la lista tiene longitud 0, renderizar `EmptyState` apropiado
    - _Requisitos: 5.7_

  - [ ]* 7.5 Escribir test de propiedad para `ActivityFeed`
    - **Property 12: ActivityFeed — Un elemento renderizado por cada actividad en el input**
    - **Validates: Requirements 5.7**
    - Crear `src/components/__tests__/activity-feed.pbt.test.ts` con fast-check
    - Verificar que para cualquier lista de N actividades (N ≥ 0), el componente renderiza exactamente N elementos en el feed
    - _Requisitos: 5.7_

  - [x] 7.6 Crear `src/components/dashboard/DashboardKPIs.tsx`
    - Renderizar grid responsivo: 1 col mobile / 2 cols tablet / 4 cols desktop con los 4 `StatsCard` para roles admin/directivo/superadmin
    - Para ROLE_DOCENTE: mostrar 4 `StatsCard` específicos (mis clases, alumnos activos, calificaciones pendientes, próxima clase)
    - Incluir al menos un `BarChart` de Recharts para asistencia de los últimos 30 días (Presentes/Ausentes/Tardanzas)
    - Incluir al menos un `RadarChart` de Recharts para promedio de notas por grado
    - Incluir sección de accesos rápidos con 4–6 tarjetas de enlace según el rol del usuario
    - _Requisitos: 5.1, 5.5, 5.6, 5.8, 5.9, 12.5_

  - [x] 7.7 Refactorizar `src/components/home/homeAdmin.tsx`
    - Reemplazar el contenido actual por `<PageHeader>` + `<DashboardKPIs>` + `<ActivityFeed>`
    - Pasar al `PageHeader`: title="Panel de Control", breadcrumbs vacíos (página raíz del dashboard)
    - Conectar `DashboardKPIs` con los datos del store/API existentes
    - _Requisitos: 14.5, 5.1_

  - [x] 7.8 Crear módulo de calendario `src/components/calendar/CalendarModule.tsx`
    - Definir tipos `CalendarEvent`, `CalendarEventType`, `CalendarView` y `CalendarModuleProps` según diseño §10.8
    - Importar y configurar `react-big-calendar` con localizer de `date-fns`
    - Soportar 4 vistas: `month`, `week`, `day`, `agenda`
    - Colorear eventos por tipo usando tokens semánticos: clase→primary, examen→warning, feriado→destructive, reunión→info, comunicado→secondary
    - Mostrar `SkeletonTable rows={12} columns={7}` cuando `isLoading=true`
    - Mostrar modal `EventForm` al clic en espacio vacío cuando `allowCreate=true`
    - Invocar `onEventClick(event)` al clic en evento existente
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x] 7.9 Crear página `/dashboard/calendario` con carga dinámica
    - Crear `src/app/dashboard/calendario/page.tsx`
    - Importar `CalendarModule` con `next/dynamic` con `{ ssr: false }` y `loading: () => <SkeletonTable rows={12} columns={7} />`
    - Renderizar `<PageHeader title="Calendario" breadcrumbs={[{label:"Calendario"}]} />` y el `CalendarModule` dinámico
    - _Requisitos: 7.8, 13.4_

  - [x] 7.10 Crear páginas stub para Comunicados y Reclamos
    - Crear `src/app/dashboard/notices/page.tsx` con `<PageHeader title="Comunicados">` + `<EmptyState title="Módulo en desarrollo">` adecuado
    - Crear `src/app/dashboard/complains/page.tsx` con `<PageHeader title="Reclamos">` + `<EmptyState title="Módulo en desarrollo">` adecuado
    - _Requisitos: 10.1, 10.2_

  - [x] 7.11 Crear páginas globales de error
    - Crear `src/app/not-found.tsx` con diseño coherente al sistema: ilustración 404, `PageHeader` con título "Página no encontrada" y botón "Volver al Dashboard"
    - Crear `src/app/error.tsx` (error boundary global) con botón para reintentar y enlace al dashboard
    - _Requisitos: 14.6_

  - [x] 7.12 Aplicar `PageHeader` en todas las páginas del dashboard
    - Agregar `<PageHeader>` con título, descripción y breadcrumbs apropiados a las páginas existentes: `alumnos`, `clases`, `usuarios`, `asistencias`, `notas`, `horarios`, `grados`, `ciclos`, `secciones`, `materias`, `tutores`
    - Mover los botones "Nuevo/a" existentes al slot `actions` del `PageHeader`
    - _Requisitos: 4.10_

- [x] 8. Checkpoint Final — Verificar integración completa
  - Ejecutar `pnpm build` y asegurar que no hay errores de TypeScript ni de compilación
  - Verificar el dashboard principal con KPIs y gráficos para cada rol
  - Verificar el módulo de calendario navegando a `/dashboard/calendario`
  - Verificar las páginas stub de Comunicados y Reclamos
  - Verificar que las páginas 404 y error global funcionan correctamente
  - Preguntar al usuario si tiene dudas o ajustes antes de dar por completada la transformación


---

## Notes

- Las tareas marcadas con `*` son opcionales (tests de propiedades) y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos formales para trazabilidad completa
- Los checkpoints al final de cada fase permiten validación incremental antes de continuar
- Las dependencias nuevas usan versiones exactas (sin `^` ni `~`) para reproducibilidad de builds
- El `CalendarModule` usa `next/dynamic` para lazy-loading y evitar errores de SSR con `react-big-calendar`
- Todos los tests de propiedades requieren instalar `fast-check` y una librería de testing (vitest o jest) si no están presentes
- Los componentes `"use client"` que usan hooks de React deben tener la directiva en la primera línea del archivo

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.5", "1.6"] },
    { "id": 1, "tasks": ["1.3", "1.4", "1.7", "3.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "3.4", "3.5"] },
    { "id": 3, "tasks": ["3.6", "3.7"] },
    { "id": 4, "tasks": ["3.8", "3.9", "3.10"] },
    { "id": 5, "tasks": ["3.11", "3.12"] },
    { "id": 6, "tasks": ["3.13", "3.14", "5.1", "5.2", "5.3"] },
    { "id": 7, "tasks": ["5.4", "5.5", "5.8"] },
    { "id": 8, "tasks": ["5.6", "5.11"] },
    { "id": 9, "tasks": ["5.7", "5.9", "5.12"] },
    { "id": 10, "tasks": ["5.10"] },
    { "id": 11, "tasks": ["7.1", "7.4"] },
    { "id": 12, "tasks": ["7.2", "7.3", "7.5", "7.6"] },
    { "id": 13, "tasks": ["7.7", "7.8"] },
    { "id": 14, "tasks": ["7.9", "7.10", "7.11"] },
    { "id": 15, "tasks": ["7.12"] }
  ]
}
```
