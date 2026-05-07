"use client";
import { ColumnDef } from "@tanstack/react-table";
import { List, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { AsignaturaEdit } from "../../../../types/materia.types";

export const getColumns = (): ColumnDef<AsignaturaEdit>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false, // No buscar en esta columna
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableGlobalFilter: true, // ✅ Hacer buscable
  },
  { 
    id: "anioLectivo",
    accessorKey: "anioLectivo", // ✅ Agregar accessorKey
    header: "Año Lectivo",
    enableGlobalFilter: true, // ✅ Hacer buscable
    cell: ({ row }) => (
      <span className="text-center flex items-center justify-center">
        {row.original.anioLectivo}
      </span>
    ),
  },
  {
    id: "docenteNombre",
    accessorFn: (row) => row.docente?.nombre ?? "", // ✅ Usar accessorFn
    header: "Docente",
    enableGlobalFilter: true, // ✅ Hacer buscable
    cell: ({ row }) => (
      <span>{row.original.docente?.nombre ?? "-"}</span>
    ),
  },
  {
    id: "docenteEmail",
    accessorFn: (row) => row.docente?.email ?? "", // ✅ Usar accessorFn
    header: "Email",
    enableGlobalFilter: true, // ✅ Hacer buscable
    cell: ({ row }) => (
      <span>{row.original.docente?.email ?? "-"}</span>
    ),
  },
  {
    id: "materiaNombre",
    accessorFn: (row) => row.materia?.nombre ?? "", // ✅ Usar accessorFn
    header: "Materia",
    enableGlobalFilter: true, // ✅ Hacer buscable
    cell: ({ row }) => (
      <span>{row.original.materia?.nombre ?? "-"}</span>
    ),
  },
  {
    id: "materiaCiclo",
    accessorFn: (row) => row.materia?.ciclo ?? "", // ✅ Usar accessorFn
    header: "Ciclo",
    enableGlobalFilter: true, // ✅ Hacer buscable
    cell: ({ row }) => (
      <span>{row.original.materia?.ciclo ?? "-"}</span>
    ),
  },
  {
    id: "materiaCodigo",
    accessorFn: (row) => row.materia?.codigo ?? "", // ✅ Usar accessorFn
    header: "Código",
    enableGlobalFilter: true, // ✅ Hacer buscable
    cell: ({ row }) => (
      <span>{row.original.materia?.codigo ?? "-"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clase = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(clase.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/clases/${clase.id}/informacion`}>
              <DropdownMenuItem>
                Informacion <List className="ml-1 h-4 w-4" />
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableGlobalFilter: false, // No buscar en acciones
  },
];