# Requirements Document

## Introduction

Este documento especifica los requisitos formales derivados del diseño técnico para la transformación completa de UX/UI del Sistema de Gestión Escolar (SMS). El sistema ya cuenta con lógica de negocio funcional (12 módulos, 4 roles, API REST conectada), pero presenta 25 problemas críticos de UX/UI. Los requisitos aquí definidos elevan la calidad del producto a nivel SaaS premium mediante la implementación de un sistema de diseño coherente, componentes reutilizables, animaciones con Framer Motion, gráficos con Recharts y un módulo de calendario.

El stack tecnológico es: Next.js 15 + React 19 + TypeScript + Tailwind v4 + shadcn/ui new-york.

---

## Glossary

- **SMS**: School Management System — el sistema de gestión escolar objeto de esta transformación.
- **Design_System**: El conjunto de tokens semánticos, tipografía, espaciado, sombras y paleta de colores definidos en `globals.css`.
- **DashboardLayout**: Componente que envuelve toda la interfaz del dashboard, incluyendo topbar y área de contenido con scroll.
- **DashboardTopbar**: Barra superior fija del dashboard con disparador del sidebar, breadcrumb automático y toggle de modo oscuro.
- **PageHeader**: Componente de encabezado de página con título, descripción, breadcrumb y slot de acciones.
- **AnimatedPage**: Wrapper de Framer Motion que aplica la transición de entrada/salida a cada página del dashboard.
- **AppSidebar**: Sidebar de navegación lateral con grupos, íconos, estados activos y RoleBadge.
- **NavMain**: Componente de navegación principal del sidebar con detección de ruta activa.
- **NavUser**: Componente del perfil de usuario en el sidebar con avatar, email y RoleBadge.
- **RoleBadge**: Badge que muestra el rol del usuario con color semántico correspondiente.
- **StatsCard**: Tarjeta de métrica KPI con icono, valor, tendencia y animación count-up.
- **DashboardKPIs**: Componente que agrupa y renderiza los StatsCard del dashboard por rol.
- **ActivityFeed**: Componente de feed de actividad reciente del sistema.
- **DataTableEnhanced**: Tabla de datos avanzada con búsqueda global, paginación en español, exportación PDF/Excel, EmptyState y SkeletonTable.
- **EmptyState**: Componente visual para representar listas o tablas vacías.
- **SkeletonTable**: Componente de carga esqueleto para tablas.
- **SkeletonCard**: Componente de carga esqueleto para tarjetas.
- **CalendarModule**: Módulo de calendario completo basado en `react-big-calendar`.
- **ExportMenu**: Menú desplegable para exportar datos a PDF o Excel.
- **StatusBadge**: Badge de estado semántico (activo, inactivo, pendiente, etc.).
- **DynamicBreadcrumb**: Breadcrumb generado automáticamente desde los segmentos de la ruta activa.
- **Rol_Valido**: Uno de: `ROLE_ADMIN`, `ROLE_DOCENTE`, `ROLE_DIRECTIVO`, `ROLE_SUPERADMIN`.
- **WCAG_AA**: Estándar de accesibilidad WCAG 2.1 nivel AA, que exige ratio de contraste mayor o igual a 4.5:1 para texto normal.
- **Breakpoint**: Ancho de viewport en píxeles. Los definidos son: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide).
- **Token_Semantico**: Variable CSS con nombre que expresa su propósito (ej: `--success`, `--warning`) en lugar de su valor cromático.
- **OKLCH**: Espacio de color perceptualmente uniforme usado para los tokens de color del Design System.
- **Framer_Motion**: Librería de animaciones para React utilizada para transiciones de página y entrance de componentes.
- **Recharts**: Librería de gráficos SVG para React usada en el dashboard.
- **React_Big_Calendar**: Librería de calendario para React, integrada con `date-fns`.
- **TanStack_Table**: Librería headless de tablas para React, base de DataTableEnhanced.
- **Zod**: Librería de validación de schemas TypeScript, usada en todos los formularios.
- **React_Hook_Form**: Librería de gestión de formularios para React.
- **jsPDF**: Librería para generación de documentos PDF en el navegador.
- **XLSX**: Librería para generación y lectura de archivos Excel en el navegador.
- **next_font**: Módulo de Next.js para carga optimizada de fuentes Google con eliminación de FOUT.
- **FOUT**: Flash of Unstyled Text — parpadeo de texto sin estilo por carga tardía de fuentes.
- **prefers_reduced_motion**: Media query CSS que indica que el usuario prefiere animaciones reducidas.
- **Sonner**: Librería de notificaciones toast ya instalada en el proyecto.
- **SidebarProvider**: Componente de shadcn/ui que provee contexto al sidebar.
- **SidebarInset**: Componente de shadcn/ui que envuelve el área principal junto al sidebar.

---

## Requirements

---

### Requirement 1: Sistema de Diseño y Tokens Semánticos

**User Story:** Como desarrollador front-end, quiero un sistema de design tokens semánticos completo en `globals.css`, para que todos los componentes usen colores, tipografía, espaciado y sombras coherentes en modo claro y oscuro sin valores hardcodeados.

#### Acceptance Criteria

1. THE Design_System SHALL define tokens de color semánticos `--success`, `--success-foreground`, `--success-muted`, `--warning`, `--warning-foreground`, `--warning-muted`, `--info`, `--info-foreground` e `--info-muted` en las secciones `:root` y `.dark` de `globals.css`.
2. THE Design_System SHALL definir tokens de superficie elevada `--surface` y `--surface-2` con valores OKLCH distintos para modo claro y modo oscuro, donde el valor del canal L de `--surface` en modo claro difiere del valor del canal L de `--surface` en modo oscuro en al menos 0.3 unidades OKLCH.
3. THE Design_System SHALL definir tokens de sombra `--shadow-card`, `--shadow-card-hover`, `--shadow-dropdown`, `--shadow-modal` y `--shadow-focus` como variables CSS en `:root`.
4. THE Design_System SHALL definir una escala tipográfica de siete niveles: `--font-size-xs` (11px / 0.6875rem), `--font-size-sm` (13px / 0.8125rem), `--font-size-base` (14px / 0.875rem), `--font-size-lg` (16px / 1rem), `--font-size-xl` (20px / 1.25rem), `--font-size-2xl` (24px / 1.5rem) y `--font-size-3xl` (30px / 1.875rem).
5. THE Design_System SHALL registrar en el bloque `@theme inline` todos los tokens de color semánticos nuevos (success, warning, info y sus variantes muted y foreground), así como los tokens de superficie (surface, surface-2, surface-foreground), para que Tailwind v4 los exponga como clases utilitarias (`text-success`, `bg-warning`, `bg-surface`, etc.).
6. WHEN el elemento `<html>` tiene la clase `.dark` activa, THE Design_System SHALL aplicar los valores OKLCH alternativos definidos en la sección `.dark` de `globals.css`, de modo que los tokens semánticos de estado y superficie adopten sus variantes oscuras.
7. THE Design_System SHALL garantizar que la relacion de contraste calculada segun WCAG 2.1 sea mayor o igual a 4.5:1 para cada par token/token-foreground definido (`--success/--success-foreground`, `--warning/--warning-foreground`, `--info/--info-foreground`, `--primary/--primary-foreground`, `--destructive/--destructive-foreground`), tanto en modo claro como en modo oscuro.

---

### Requirement 2: Carga de Fuente Inter y Metadata Global

**User Story:** Como usuario final, quiero que la fuente Inter cargue correctamente sin parpadeos y que el sitio tenga titulo y descripcion apropiados, para que la experiencia visual sea profesional desde el primer render.

#### Acceptance Criteria

1. WHEN la aplicacion inicia, THE SMS SHALL cargar la fuente Inter mediante `next/font/google` en `src/app/layout.tsx` con los subsets `["latin"]` y los pesos `["400", "500", "600", "700"]`.
2. THE SMS SHALL aplicar la variable CSS `--font-sans` a la etiqueta `<html>` mediante la clase generada por `next/font`, eliminando el FOUT.
3. THE SMS SHALL configurar la etiqueta `<html>` con el atributo `lang="es"` y `suppressHydrationWarning` para soporte correcto de internacionalizacion e hidratacion.
4. THE SMS SHALL definir metadata global con `title.default` igual a `"SMS - Sistema de Gestion Escolar"`, `title.template` igual a `"%s | SMS"` y una descripcion descriptiva del sistema.
5. THE SMS SHALL incluir referencias a `favicon.ico` y `apple-touch-icon.png` en la metadata de iconos.

---

### Requirement 3: Layout del Dashboard

**User Story:** Como usuario autenticado, quiero un layout de dashboard consistente con topbar fija, area de contenido con padding correcto y maximo ancho controlado, para que la navegacion sea predecible y el contenido siempre sea legible.

#### Acceptance Criteria

1. THE DashboardLayout SHALL envolver toda la interfaz del dashboard reemplazando el `<main>` actual que carece de padding y max-width.
2. THE DashboardLayout SHALL contener un DashboardTopbar sticky en la parte superior y un area de contenido principal con scroll vertical independiente.
3. THE DashboardLayout SHALL aplicar `max-w-7xl mx-auto` al contenedor interno del contenido con padding responsivo: `px-4 py-4` en mobile (viewport menor a 768px), `px-5 py-5` en tablet (768px–1023px), `px-6 py-6` en desktop (1024px–1439px) y `px-8 py-8` en wide (mayor o igual a 1440px).
4. THE DashboardTopbar SHALL tener altura de 56px (`h-14`), posicion sticky (`sticky top-0 z-40`), fondo con `backdrop-blur-md` y borde inferior de 1px (`border-b border-border/50`).
5. THE DashboardTopbar SHALL contener el SidebarTrigger a la izquierda, el DynamicBreadcrumb en el centro-izquierda y las acciones globales (incluyendo ModeToggle) a la derecha.
6. WHEN el DashboardLayout es renderizado, THE SMS SHALL envolver los `{children}` en un componente AnimatedPage que aplique una transicion de entrada de tipo fade-in con duracion maxima de 300ms.
7. THE PageHeader SHALL renderizar el titulo de la pagina como elemento `h1` con clases `text-2xl font-semibold`, una descripcion en `text-sm text-muted-foreground` cuando la prop `description` esta presente (omitiendo el elemento del DOM cuando no se proporciona) y un slot de acciones alineado a la derecha.
8. WHEN se le pasan items de breadcrumb, THE PageHeader SHALL renderizar un componente Breadcrumb de shadcn/ui mostrando siempre "Inicio" como primer item con enlace a `/dashboard`.

---

### Requirement 4: Sidebar con Estados Activos, RoleBadge y Links de Next.js

**User Story:** Como usuario autenticado, quiero que el sidebar marque visualmente la seccion activa y que la navegacion use el router de Next.js, para que el contexto de navegacion sea claro y las transiciones sean instantaneas sin recarga de pagina.

#### Acceptance Criteria

1. WHEN la ruta activa coincide con la URL de un item del sidebar, THE NavMain SHALL aplicar el atributo `isActive={true}` al SidebarMenuButton o SidebarMenuSubButton correspondiente.
2. THE NavMain SHALL detectar la ruta activa mediante `usePathname()` de `next/navigation` usando la funcion: `pathname === url || pathname.startsWith(url + "/")`, con excepcion de `/dashboard` que requiere coincidencia exacta.
3. THE NavMain SHALL usar el componente Link de `next/link` en lugar de etiquetas `<a>` planas para todos los items de navegacion, evitando recargas completas de pagina.
4. WHEN un item colapsable contiene al menos un subitem cuya URL coincide con la ruta activa segun el criterio 2, THE NavMain SHALL establecer `defaultOpen={true}` en el Collapsible correspondiente para expandirlo automaticamente.
5. THE NavUser SHALL mostrar el avatar real del usuario mediante AvatarImage con la URL del gravatar almacenada en el store Redux; si la URL es nula o indefinida, SHALL mostrar las dos primeras letras del nombre del usuario en mayusculas como AvatarFallback.
6. THE NavUser SHALL aceptar una prop `rol` de tipo `UserRole` y SHALL mostrar un componente RoleBadge con ese rol debajo del email en el menu desplegable; si la prop `rol` no esta disponible, SHALL omitir el RoleBadge en lugar de renderizar un estado de error.
7. THE NavUser SHALL mostrar la opcion "Cerrar sesion" en lugar de "Log out".
8. THE RoleBadge SHALL mostrar la etiqueta con el nombre legible del rol y el icono Lucide correspondiente para cada Rol_Valido: `"Super Admin"` con icono `ShieldCheck` para ROLE_SUPERADMIN, `"Admin"` con icono `Shield` para ROLE_ADMIN, `"Directivo"` con icono `Users` para ROLE_DIRECTIVO y `"Docente"` con icono `GraduationCap` para ROLE_DOCENTE.
9. THE RoleBadge SHALL aplicar variantes de color semantico distintas por rol usando las clases del design system: `bg-primary/10 text-primary` para ROLE_SUPERADMIN, `bg-info-muted text-info` para ROLE_ADMIN, `bg-warning-muted text-warning` para ROLE_DIRECTIVO y `bg-success-muted text-success` para ROLE_DOCENTE.
10. IF un Rol_Valido es pasado al AppSidebar, THEN THE AppSidebar SHALL mostrar unicamente los items de navegacion cuya propiedad `rol` incluya ese Rol_Valido, o que no tengan restriccion de rol; los items con propiedad `rol` que no incluya el rol activo no SHALL aparecer en el sidebar renderizado.

---

### Requirement 5: Dashboard Principal con KPIs, Graficos y Activity Feed

**User Story:** Como administrador o directivo, quiero ver metricas clave del sistema, graficos de asistencia y notas, y un feed de actividad reciente en el dashboard, para tomar decisiones informadas sin navegar entre modulos.

#### Acceptance Criteria

1. THE DashboardKPIs SHALL renderizar al menos cuatro StatsCard para los roles ROLE_ADMIN, ROLE_DIRECTIVO y ROLE_SUPERADMIN mostrando: total de alumnos, total de docentes, total de clases y asistencia del dia.
2. THE StatsCard SHALL mostrar: un icono de 20px con fondo semantico suave, el valor numerico principal en `text-3xl font-bold`, el titulo de la metrica en `text-sm text-muted-foreground` y un indicador de tendencia con icono TrendingUp o TrendingDown y color success o destructive segun corresponda.
3. WHEN `isLoading` es `true`, THE StatsCard SHALL renderizar el estado skeleton con tres bloques Skeleton en lugar del contenido real.
4. WHEN `animate` es `true` y el valor es numerico, THE StatsCard SHALL animar el numero desde 0 hasta el valor objetivo usando el hook useCountUp con duracion de 800ms y easing easeOutCubic.
5. THE DashboardKPIs SHALL incluir al menos un grafico de tipo BarChart de Recharts para mostrar asistencia de los ultimos 30 dias (Presentes, Ausentes y Tardanzas por dia).
6. THE DashboardKPIs SHALL incluir al menos un grafico de tipo RadarChart de Recharts para mostrar el promedio de notas por grado.
7. THE ActivityFeed SHALL renderizar una lista cronologica de acciones recientes del sistema mostrando avatar del actor, descripcion de la accion y timestamp relativo por cada actividad en el input.
8. WHEN el rol del usuario es ROLE_DOCENTE, THE DashboardKPIs SHALL mostrar KPIs especificos del docente: mis clases, alumnos activos, calificaciones pendientes y proxima clase.
9. THE DashboardKPIs SHALL incluir una seccion de accesos rapidos con entre 4 y 6 tarjetas de enlace a las acciones mas frecuentes segun el rol del usuario.

---

### Requirement 6: DataTableEnhanced

**User Story:** Como usuario del sistema, quiero tablas de datos con busqueda global en español, paginacion localizada, exportacion a PDF y Excel, estados de carga skeleton y empty state, para gestionar eficientemente los registros del sistema.

#### Acceptance Criteria

1. THE DataTableEnhanced SHALL aceptar las props `columns`, `data`, `searchPlaceholder`, `globalSearch`, `exportConfig`, `primaryAction`, `pageSize`, `isLoading` y `emptyStateProps`; la prop `exportConfig` SHALL requerir al minimo un campo `filename` de tipo string no vacio.
2. WHEN `globalSearch` es `true` y el termino de busqueda tiene al menos un caracter, THE DataTableEnhanced SHALL aplicar el filtro sobre todas las columnas de tipo string simultaneamente, normalizando tanto el termino como los valores de celda con `toLowerCase()` y `normalize("NFD").replace(/\p{Diacritic}/gu, "")` para ser insensible a mayusculas y diacriticos.
3. WHEN `isLoading` es `false` y `data` tiene longitud cero, THE DataTableEnhanced SHALL renderizar el componente EmptyState con las props de `emptyStateProps` y el `<tbody>` no SHALL contener filas de datos.
4. WHEN `isLoading` es `true`, THE DataTableEnhanced SHALL renderizar el componente SkeletonTable con `columns` igual al numero de columnas definidas en la prop `columns` y `rows` igual a 5 por defecto, en lugar de la tabla real.
5. THE DataTableEnhanced SHALL mostrar los controles de paginacion con textos en español: "Anterior", "Siguiente", indicador de pagina actual en formato "Pagina X de Y", y selector de filas por pagina con opciones 10, 25, 50 y 100.
6. WHEN `exportConfig` esta definido, THE DataTableEnhanced SHALL mostrar un ExportMenu con opciones para exportar en formato PDF y Excel.
7. WHEN el usuario activa la exportacion en PDF, THE ExportMenu SHALL invocar `exportToPdf` generando un archivo con nombre `{filename}_{YYYYMMDD}.pdf` donde `YYYYMMDD` es la fecha actual en formato ISO sin separadores.
8. WHEN el usuario activa la exportacion en Excel, THE ExportMenu SHALL invocar `exportToExcel` generando un archivo con nombre `{filename}_{YYYYMMDD}.xlsx` donde `YYYYMMDD` es la fecha actual en formato ISO sin separadores.
9. THE DataTableEnhanced SHALL incluir un control de visibilidad de columnas con la etiqueta "Columnas" en el boton.
10. THE SkeletonTable SHALL renderizar filas y columnas esqueleto en cantidad configurable mediante props `rows` y `columns`, con delay de animacion escalonado de 50ms por fila.
11. IF se pasa la prop `action` al componente EmptyState, THEN THE EmptyState SHALL renderizar un boton con la etiqueta, handler y variante especificados en la prop `action`.

---

### Requirement 7: Modulo de Calendario

**User Story:** Como usuario autenticado, quiero acceder a un modulo de calendario en `/dashboard/calendario` que muestre eventos del sistema por tipo, para planificar y visualizar actividades academicas.

#### Acceptance Criteria

1. THE SMS SHALL crear la ruta `/dashboard/calendario` con un componente CalendarModule basado en `react-big-calendar`.
2. THE CalendarModule SHALL soportar cuatro vistas: `month` (mensual), `week` (semanal), `day` (diaria) y `agenda` (lista cronologica).
3. THE CalendarModule SHALL renderizar eventos diferenciados por tipo con colores semanticos: `clase` (primary), `examen` (warning), `feriado` (destructive), `reunion` (info) y `comunicado` (secondary).
4. THE CalendarModule SHALL aceptar eventos de tipo CalendarEvent con campos obligatorios: `id`, `title`, `start`, `end` y `type`, y campos opcionales: `description`, `claseId`, `allDay` y `createdBy`.
5. WHEN `allowCreate` es `true`, THE CalendarModule SHALL mostrar un modal de formulario al hacer clic en un espacio vacio del calendario para crear nuevos eventos.
6. WHEN el usuario hace clic en un evento existente, THE CalendarModule SHALL invocar el callback `onEventClick` con el evento correspondiente.
7. WHEN `isLoading` es `true`, THE CalendarModule SHALL mostrar un SkeletonTable con `rows={12}` y `columns={7}` como placeholder de carga.
8. THE SMS SHALL cargar el CalendarModule usando `dynamic()` de Next.js con `ssr: false` para lazy-loading, mostrando SkeletonTable durante la carga del chunk.
9. THE AppSidebar SHALL incluir un item de navegacion "Calendario" con icono CalendarDays visible para todos los Roles_Validos, dentro del grupo "Organizacion".

---

### Requirement 8: Sistema de Animaciones con Framer Motion

**User Story:** Como usuario final, quiero que las transiciones entre paginas y la aparicion de componentes sean suaves y propositivas, sin bloquear la interactividad, para que la experiencia sea premium y fluida.

#### Acceptance Criteria

1. THE SMS SHALL crear el archivo `src/lib/animations.ts` con las variantes de Framer Motion exportadas: `pageTransition`, `cardEntrance`, `staggerContainer` y `fadeInUp`; este archivo no SHALL importar framer-motion directamente sino exportar objetos `Variants` compatibles con el tipo de framer-motion.
2. WHEN el componente AnimatedPage se monta, THE AnimatedPage SHALL aplicar la variante `pageTransition` que transiciona `opacity` de 0 a 1 y `y` de 8px a 0px con duracion de 250ms y easing easeOut.
3. WHEN el componente StatsCard se monta con un prop `index` de valor `i` (entero no negativo), THE StatsCard SHALL aplicar la variante `cardEntrance` que transiciona `opacity` de 0 a 1 y `scale` de 0.96 a 1 con duracion de 300ms y delay de exactamente `i * 0.06` segundos.
4. WHEN el componente EmptyState se monta, THE EmptyState SHALL aplicar la variante `fadeInUp` que transiciona `opacity` de 0 a 1 y `y` de 16px a 0px con duracion de 350ms y easing easeOut.
5. WHEN el usuario tiene activado `prefers-reduced-motion` en su sistema operativo, THE SMS SHALL deshabilitar las animaciones de Framer Motion de modo que la duracion efectiva de todas las transiciones sea menor o igual a 100ms o que no haya movimiento perceptible.
6. THE SMS SHALL garantizar que `pointer-events` nunca sea `"none"` para los elementos interactivos (botones, enlaces, inputs) dentro de un wrapper AnimatedPage o StatsCard una vez que el componente esta montado; el delay de animacion de StatsCard no SHALL afectar el valor de `pointer-events` del contenido interno.
7. THE SMS SHALL crear el hook `useCountUp` en `src/hooks/useCountUp.ts` que acepta los parametros `target: number` y `duration?: number` (default 800ms), retorna 0 en el primer render, anima el valor usando easing easeOutCubic (`1 - Math.pow(1 - progress, 3)`) mediante `requestAnimationFrame` y converge exactamente al valor de `target` al completarse la duracion.

---

### Requirement 9: Formularios con Feedback Visual Mejorado

**User Story:** Como usuario que completa formularios, quiero recibir feedback inmediato sobre el resultado de mis acciones y ser redirigido sin demoras artificiales, para que el flujo de trabajo sea eficiente y confiable.

#### Acceptance Criteria

1. WHEN un formulario es enviado exitosamente, THE SMS SHALL mostrar un toast de exito mediante `toast.success` de Sonner y ejecutar `router.push` hacia la ruta destino inmediatamente, sin usar `setTimeout` con valores mayores a 0ms.
2. WHEN un formulario falla en el envio por error de API, THE SMS SHALL mostrar un toast de error mediante `toast.error` con el mensaje de error de la API o un mensaje generico de respaldo.
3. IF los datos del formulario no pasan la validacion del schema Zod (`zodSchema.safeParse(data).success === false`), THEN THE SMS SHALL prevenir la invocacion del handler `onSubmit` mediante la integracion de React_Hook_Form con el resolver de Zod.
4. THE SMS SHALL eliminar todos los usos de `setTimeout` con duraciones mayores a cero en handlers de formulario y logica de redireccion post-submit.

---

### Requirement 10: Modulos Stub — Comunicados y Reclamos

**User Story:** Como administrador, quiero que las secciones de Comunicados y Reclamos existan como paginas navegables aunque esten en construccion, para que el sidebar no tenga enlaces rotos y el sistema se perciba completo.

#### Acceptance Criteria

1. THE SMS SHALL crear la pagina `/dashboard/notices` con un PageHeader titulado "Comunicados" y un EmptyState que indique que el modulo esta en desarrollo.
2. THE SMS SHALL crear la pagina `/dashboard/complains` con un PageHeader titulado "Reclamos" y un EmptyState que indique que el modulo esta en desarrollo.
3. THE AppSidebar SHALL incluir un grupo "Comunicacion" con items de navegacion para "Comunicados" (`/dashboard/notices`) y "Reclamos" (`/dashboard/complains`) visibles para los roles ROLE_ADMIN, ROLE_DIRECTIVO y ROLE_SUPERADMIN.

---

### Requirement 11: Accesibilidad WCAG 2.1 AA

**User Story:** Como usuario con necesidades de accesibilidad, quiero que el sistema cumpla con los criterios de contraste y estructura semantica de WCAG 2.1 AA, para poder usar el sistema con tecnologias asistivas.

#### Acceptance Criteria

1. THE Design_System SHALL mantener una relacion de contraste mayor o igual a 4.5:1 para cada par de tokens semanticos definidos en el Requisito 1, calculada segun la formula WCAG 2.1 en modo claro y en modo oscuro.
2. THE SMS SHALL usar elementos HTML semanticos: `<header>` para el topbar, `<main>` para el area de contenido principal, `<nav>` para el sidebar de navegacion.
3. THE DashboardTopbar SHALL incluir el DynamicBreadcrumb con estructura `<nav aria-label="breadcrumb">` para correcta semantica de navegacion.
4. THE SMS SHALL asociar explicitamente cada `<label>` con su `<input>` correspondiente mediante atributo `htmlFor` e `id` para todas las acciones de formulario del sistema.
5. WHEN `iconOnly` es `false`, THE RoleBadge SHALL incluir texto visible ademas del icono, garantizando que la informacion del rol sea legible sin soporte de iconos.

---

### Requirement 12: Responsive Mobile First

**User Story:** Como usuario que accede desde dispositivos de distinto tamaño, quiero que el dashboard sea completamente usable desde 375px hasta 1440px de ancho, para gestionar el sistema desde cualquier dispositivo.

#### Acceptance Criteria

1. WHEN el viewport es menor a 768px, THE AppSidebar SHALL estar oculto por defecto y abrirse en modo overlay al activar el SidebarTrigger, sin desplazar el contenido principal.
2. WHEN el viewport esta entre 768px y 1023px, THE AppSidebar SHALL mostrarse en modo icono (56px de ancho) con tooltips para los items de navegacion.
3. WHEN el viewport es mayor o igual a 1024px, THE AppSidebar SHALL mostrarse expandido con etiquetas de texto visibles (240px de ancho).
4. THE SMS SHALL garantizar que `document.body.scrollWidth` sea menor o igual a `document.body.clientWidth` para cada uno de los breakpoints definidos [375px, 768px, 1024px, 1440px], eliminando el scroll horizontal no deseado en cualquier ruta del dashboard.
5. THE DashboardKPIs SHALL renderizar las StatsCard en un grid responsivo: 1 columna en mobile, 2 columnas en tablet y 4 columnas en desktop y wide.
6. THE DataTableEnhanced SHALL ocultar columnas secundarias en mobile segun la configuracion de visibilidad de columnas para mantener la tabla legible.

---

### Requirement 13: Instalacion y Configuracion de Dependencias

**User Story:** Como desarrollador, quiero que las dependencias necesarias esten instaladas con versiones exactas y su uso correctamente optimizado, para que el bundle sea predecible y no haya conflictos de version.

#### Acceptance Criteria

1. THE SMS SHALL tener instalada la dependencia `framer-motion` en version `12.23.6` en `package.json`.
2. THE SMS SHALL tener instalada la dependencia `recharts` en version `2.15.4` en `package.json`.
3. THE SMS SHALL tener instalada la dependencia `react-big-calendar` en version `1.18.0` y la dependencia de desarrollo `@types/react-big-calendar` en version `1.8.14` en `package.json`.
4. THE SMS SHALL cargar el CalendarModule con `next/dynamic` con `{ ssr: false }` para que el bundle del calendario sea lazy-loaded unicamente cuando el usuario navega a `/dashboard/calendario`.
5. THE SMS SHALL configurar versiones exactas sin rangos `^` o `~` para las tres dependencias nuevas en `package.json`, garantizando reproducibilidad de builds.

---

### Requirement 14: Refactorizacion de Componentes Existentes

**User Story:** Como desarrollador, quiero que los componentes existentes sean refactorizados para usar los nuevos estandares de layout, navegacion y exportacion, para que el sistema sea coherente y no haya duplicacion de codigo.

#### Acceptance Criteria

1. THE SMS SHALL refactorizar `src/app/dashboard/layout.tsx` para usar DashboardLayout como contenedor principal en lugar del `<main>` actual, envolviendo los `{children}` en AnimatedPage.
2. THE SMS SHALL refactorizar `src/components/nav-main.tsx` para usar Link de `next/link` en todos los items y detectar la ruta activa con `usePathname()`.
3. THE SMS SHALL refactorizar `src/components/nav-user.tsx` para mostrar el avatar real del usuario, el componente RoleBadge y la opcion "Cerrar sesion" en lugar de "Log out".
4. THE SMS SHALL reemplazar todos los componentes `data-table.tsx` especificos de modulo por el componente DataTableEnhanced generico, pasando las columnas y configuracion de cada modulo como props.
5. THE SMS SHALL refactorizar `src/components/home/homeAdmin.tsx` para usar DashboardKPIs, ActivityFeed y PageHeader en lugar del contenido actual.
6. THE SMS SHALL crear las paginas globales `src/app/not-found.tsx` (error 404) y `src/app/error.tsx` (error boundary global) con diseño coherente al sistema.
7. WHEN HelpChat es renderizado, THE SMS SHALL mostrar unicamente el boton FAB flotante por defecto con `defaultOpen={false}`, desplegando el panel de chat unicamente cuando el usuario lo activa explicitamente.
