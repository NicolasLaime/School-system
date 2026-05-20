"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tutor } from "../../../../types/tutor.type";

export const getTutorColumns = (): ColumnDef<Tutor>[] => [
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
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "apellido",
    header: "Apellido",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "parentesco",
    header: "Parentesco",
  },
  {
    id: "alumnos",
    header: "Alumnos",
    cell: ({ row }) => {
      const tutor = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          {tutor.alumnos?.map((alumno, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {alumno.nombreAlumno}
            </span>
          ))}
        </div>
      );
    },
  },
];
