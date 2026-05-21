"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Tutor } from "../../../../types/tutor.type";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteTutorMutation } from "@/redux/services/tutoresApi";
import { toast } from "sonner";

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
  {
    id: "actions",
    cell: ({ row }) => {
      const tutor = row.original;
      const [deleteOpen, setDeleteOpen] = useState(false);
      const [deleteTutor, { isLoading: isDeleting }] = useDeleteTutorMutation();

      const handleDelete = async () => {
        try {
          await deleteTutor(tutor.id).unwrap();
          toast.success("Tutor eliminado correctamente");
          setDeleteOpen(false);
        } catch {
          toast.error("Error al eliminar el tutor");
        }
      };

      return (
        <>
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
                onClick={() => navigator.clipboard.writeText(String(tutor.id))}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={`/dashboard/tutores/${tutor.id}`}>
                <DropdownMenuItem>
                  Editar <Edit className="ml-1 h-4 w-4" />
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                Eliminar <Trash2 className="ml-1 h-4 w-4 text-destructive" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDelete}
            title="Eliminar tutor"
            description={`¿Está seguro de eliminar al tutor ${tutor.nombre} ${tutor.apellido}? Esta acción no se puede deshacer.`}
            confirmText="Eliminar"
            loading={isDeleting}
          />
        </>
      );
    },
  },
];
