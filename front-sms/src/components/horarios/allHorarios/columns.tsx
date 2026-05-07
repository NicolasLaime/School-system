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
import { Horario } from "../../../../types/horario.type";

export const getColumns = (
): ColumnDef<Horario>[] => [
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
  },
  {
    accessorKey:"diaSemana",
    header: "Dia",
  },
  {
    accessorKey:"horaInicio",
    header: "Hora Inicio",
    cell: ({ row }) => {
      const hora = row.original.horaInicio;
      if (typeof hora === "string") return hora;
      return `${hora.hour.toString().padStart(2, "0")}:${hora.minute.toString().padStart(2, "0")}`;
    },
  },
  {
    accessorKey:"horaFin",
    header: "Hora Fin",
    cell: ({ row }) => {
      const hora = row.original.horaFin;
      if (typeof hora === "string") return hora;
      return `${hora.hour.toString().padStart(2, "0")}:${hora.minute.toString().padStart(2, "0")}`;
    },
  },
  {
    accessorKey:"asignaturaId",
    header: "Asignatura ID",
  },
  {
    accessorKey:"seccionId",
    header: "Seccion ID",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const horario = row.original;

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
              onClick={() => navigator.clipboard.writeText(horario.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/horarios/${horario.id}/edit`}>
            <DropdownMenuItem>
              Editar <List className="ml-1 h-4 w-4" />
            </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
