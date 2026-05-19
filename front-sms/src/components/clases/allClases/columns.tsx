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
import { AsignaturasConDocentesResponse } from "@/redux/services/asignatura.Api";

type ClaseRow = AsignaturasConDocentesResponse["data"][number];

export const getColumns = (): ColumnDef<ClaseRow>[] => [
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
    enableGlobalFilter: false,
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
    enableGlobalFilter: true,
  },
  {
    accessorKey: "codigo",
    header: "Codigo",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <span className="text-center flex items-center justify-center">
        {row.original.codigo}
      </span>
    ),
  },
  {
    header: "Materia",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <span>{row.original.nombre || "-"}</span>
    ),
  },
  {
    header: "Grado",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <span>{row.original.gradoNombre || "-"}</span>
    ),
  },
  {
    header: "Ciclo",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <span>{row.original.cicloEducativoNombre || "-"}</span>
    ),
  },
  {
    header: "Docente",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <span>{`${row.original.docenteNombre} ${row.original.docenteApellido}`.trim() || "-"}</span>
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
              onClick={() => navigator.clipboard.writeText(String(clase.id))}
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
    enableGlobalFilter: false,
  },
];
