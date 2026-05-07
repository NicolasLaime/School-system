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
import { Ponderacion } from "../../../../types/ponderacion.type";

export const getColumns = (
  onDelete: (id: string) => void,
): ColumnDef<Ponderacion>[] => [
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
    accessorKey:"cicloEducativoId",
    header: "Ciclo ID",
  },
  {
    accessorKey:"nombre",
    header: "Nombre",
  },
  {
    accessorKey:"porcentaje",
    header: "Porcentaje",
    cell: ({ row }) => `${row.original.porcentaje}%`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ponderacion = row.original;

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
              onClick={() => navigator.clipboard.writeText(String(ponderacion.id))}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/ponderaciones/${ponderacion.id}/edit`}>
            <DropdownMenuItem>
              Editar <List className="ml-1 h-4 w-4" />
            </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => onDelete(String(ponderacion.id))}>
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
