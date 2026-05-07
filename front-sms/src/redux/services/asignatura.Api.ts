import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Asignatura } from "../../../types/materia.types";


interface AsignaturasResponse {
  message: string;
  data: Asignatura[];
  error?: string;
}

interface AsignaturaResponse {
  message: string;
  data: Asignatura;
  error?: string;
}

export const materiasApi = createApi({
  reducerPath: "asignaturaApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Asignaturas"],
  endpoints: (builder) => {
    // Traer todas las asignaturas
    const getAsignaturas = builder.query<AsignaturasResponse, void>({
      query: () => "/asignaturas",
      providesTags: [{ type: "Asignaturas", id: "LIST" }],
    });

    // Traer asignatura por id
    const getAsignaturaById = builder.query<AsignaturaResponse, string>({
      query: (id) => `/asignaturas/${id}`,
      providesTags: (result, error, id) => [{ type: "Asignaturas", id }],
    });

    // Traer asignatura por codigo
    const getAsignaturasByCodigo = builder.query<AsignaturaResponse, string>({
      query: (codigo) => `/asignaturas/codigo/${codigo}`,
      providesTags: (result, error, codigo) => [{ type: "Asignaturas", id: codigo }],
    });

    // Traer asignaturas por grado
    const getAsignaturasByGrado = builder.query<AsignaturasResponse, string>({
      query: (gradoId) => `/asignaturas/grado/${gradoId}`,
      providesTags: (result, error, gradoId) => [{ type: "Asignaturas", id: `GRADO_${gradoId}` }],
    });

    // Traer asignaturas por docente
    const getAsignaturasByDocente = builder.query<AsignaturasResponse, string>({
      query: (docenteId) => `/asignaturas/docente/${docenteId}`,
      providesTags: (result, error, docenteId) => [{ type: "Asignaturas", id: `DOCENTE_${docenteId}` }],
    });
    
    // Crear asignatura
    const createAsignatura = builder.mutation<AsignaturasResponse, { nombre: string; codigo: string; gradoId: string | number }>({
      query: (data) => {
        console.log("🛠️ Enviando asignatura desde mutation:", data);
        return {
          url: "/asignaturas",
          method: "POST",
          body: {
            nombre: data.nombre,
            codigo: data.codigo,
            gradoId: Number(data.gradoId),
          },
        };
      },
      invalidatesTags: [{ type: "Asignaturas", id: "LIST" }],
    });

    // Actualizar asignatura
    const updateAsignatura = builder.mutation<AsignaturasResponse, { id: number; data: Partial<{ nombre: string; codigo: string; gradoId: number }> }>({
      query: ({ id, data }) => {
        console.log("🛠️ Actualizando asignatura desde mutation:", data);
        const body: Record<string, unknown> = {};
        if (data.nombre) body.nombre = data.nombre;
        if (data.codigo) body.codigo = data.codigo;
        if (data.gradoId) body.gradoId = Number(data.gradoId);
        return {
          url: `/asignaturas/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Asignaturas", id },
        { type: "Asignaturas", id: "LIST" },
      ],
    });

    // Eliminar asignatura
    const deleteAsignatura = builder.mutation<AsignaturaResponse, string>({
      query: (id) => ({
        url: `/asignaturas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Asignaturas", id: "LIST" }],
    });

    // Asignar docente a asignatura
    const asignarDocente = builder.mutation<AsignaturaResponse, { docenteId: number; asignaturaId: number; seccionId:  number }>({
      query: (data) => {
        console.log("🛠️ Asignando docente:", data);
        return {
          url: "/asignaturas/asignar-docente",
          method: "POST",
          body: {
            docenteId: Number(data.docenteId),
            asignaturaId: Number(data.asignaturaId),
            seccionId: Number(data.seccionId),
          },
        };
      },
      invalidatesTags: [{ type: "Asignaturas", id: "LIST" }],
    });

    // Desasignar docente
    const desasignarDocente = builder.mutation<AsignaturaResponse, { docenteId: string | number; asignaturaId: string | number; seccionId: string | number }>({
      query: (data) => {
        return {
          url: "/asignaturas/asignar-docente",
          method: "DELETE",
          body: {
            docenteId: Number(data.docenteId),
            asignaturaId: Number(data.asignaturaId),
            seccionId: Number(data.seccionId),
          },
        };
      },
      invalidatesTags: [{ type: "Asignaturas", id: "LIST" }],
    });

    return {
      getAsignaturas,
      getAsignaturaById,
      getAsignaturasByCodigo,
      getAsignaturasByGrado,
      getAsignaturasByDocente,
      createAsignatura,
      updateAsignatura,
      deleteAsignatura,
      asignarDocente,
      desasignarDocente,
    };
  },
});

// Hooks auto-generados
export const {
  useGetAsignaturasQuery,
  useGetAsignaturaByIdQuery,
  useGetAsignaturasByCodigoQuery,
  useGetAsignaturasByGradoQuery,
  useGetAsignaturasByDocenteQuery,
  useCreateAsignaturaMutation,
  useUpdateAsignaturaMutation,
  useDeleteAsignaturaMutation,
  useAsignarDocenteMutation,
  useDesasignarDocenteMutation,
} = materiasApi;
