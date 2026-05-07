"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import * as XLSX from "xlsx";
import { User } from "../../../../types/Usuario.type";
import { useCreateUserMutation } from "@/redux/services/authApi";
import { z } from "zod";
import { Loader2, FileInput, FileOutput, AlertTriangle, CheckCircle } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// Esquema de validación para filas de Excel
  const UserExcelSchema = z.object({
    "Nombre Completo": z.string().min(3, { message: "Nombre debe tener al menos 3 caracteres" }),
    Email: z.string().email({ message: "Email inválido" }),
    Teléfono: z.union([z.string(), z.number()]).transform(val => String(val)).refine(
      val => val.length >= 8,
      { message: "Teléfono debe tener al menos 8 dígitos" }
    ),
    Contraseña: z.string().min(6, { message: "Contraseña debe tener al menos 6 caracteres" }),
    Rol: z.enum(["ADMIN", "DOCENTE", "SUPERADMIN"], { message: "Rol debe ser ADMIN, DOCENTE o SUPERADMIN" }),
    Dirección: z.string().optional(),
  });

type UserExcelRow = z.infer<typeof UserExcelSchema>;

interface ImportError {
  row: number;
  field?: string;
  value?: string;
  error: string;
  suggestion?: string;
}

export function DataTable<TData extends User, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [isImporting, setImporting] = React.useState(false);
  const [importProgress, setImportProgress] = React.useState(0);
  const [importResults, setImportResults] = React.useState<{
    success: number;
    errors: number;
    duplicates: number;
    errorDetails: ImportError[];
  } | null>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [createUser] = useCreateUserMutation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Constantes de configuración
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_ROWS = 1000;
  const BATCH_SIZE = 20;
  const EXPECTED_HEADERS = ["Nombre Completo", "Email", "Teléfono", "Contraseña", "Rol", "Dirección"];

  const handleExport = () => {
    try {
      // Encabezados personalizados
      const headers = [
        "ID",
        "Nombre Completo",
        "Email",
        "Teléfono",
        "Dirección",
        "Rol",
        "Fecha Creación"
      ];

      // Datos formateados
      const dataToExport = [
        headers,
        ...data.map((user) => [
          user.id,
          user.nombre,
          user.email,
          user.telefono,
          user.direccion,
          user.rol
        ]),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
      
      // Ajustar anchos de columna
      worksheet["!cols"] = [
        { width: 35 }, // ID
        { width: 25 }, // Nombre
        { width: 25 }, // Email
        { width: 15 }, // Teléfono
        { width: 30 }, // Dirección
        { width: 15 }, // Rol
        { width: 15 }, // Fecha
      ];

      // Estilo para la fila de encabezados
      const headerStyle = {
        fill: { fgColor: { rgb: "4472C4" } }, // Azul
        font: { bold: true, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center" },
      };

      for (let col = 0; col < headers.length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellRef]) continue;
        worksheet[cellRef].s = headerStyle;
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
      XLSX.writeFile(workbook, `Usuarios_${new Date().toISOString().slice(0, 10)}.xlsx`);
      
      // Log de auditoría
      console.log(`Exportación exitosa: ${data.length} usuarios exportados`);
    } catch (error) {
      console.error("Error en exportación:", error);
      alert("Error al exportar el archivo");
    }
  };

  const validateHeaders = (sheet: XLSX.WorkSheet): boolean => {
    try {
      const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
      const headers: string[] = [];
      
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        headers.push(sheet[cellAddress]?.v || '');
      }
      
      const missingHeaders = EXPECTED_HEADERS.filter(h => !headers.includes(h));
      const extraHeaders = headers.filter(h => h && !EXPECTED_HEADERS.includes(h));
      
      if (missingHeaders.length > 0) {
        alert(`Headers faltantes: ${missingHeaders.join(', ')}\n\nUse la plantilla proporcionada.`);
        return false;
      }
      
      if (extraHeaders.length > 0) {
        const proceed = confirm(`Se encontraron headers adicionales: ${extraHeaders.join(', ')}\n\n¿Continuar con la importación?`);
        if (!proceed) return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error validando headers:", error);
      alert("Error al validar los headers del archivo");
      return false;
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    // Validaciones iniciales
    if (file.size > MAX_FILE_SIZE) {
      alert(`El archivo es demasiado grande (máximo ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)`);
      return;
    }

    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      alert("Formato no soportado. Use archivos .xlsx, .xls o .csv");
      return;
    }

    setImporting(true);
    setImportProgress(0);
    setImportResults(null);

         try {
       const fileData = await readFileAsync(file);
       const workbook = XLSX.read(fileData, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Validar headers
      if (!validateHeaders(sheet)) {
        setImporting(false);
        return;
      }

      const rawRows = XLSX.utils.sheet_to_json<UserExcelRow>(sheet);

      // Validar cantidad de filas
      if (rawRows.length > MAX_ROWS) {
        alert(`Archivo demasiado grande. Máximo ${MAX_ROWS} filas permitidas. Su archivo tiene ${rawRows.length} filas.`);
        setImporting(false);
        return;
      }

      if (rawRows.length === 0) {
        alert("El archivo está vacío o no contiene datos válidos");
        setImporting(false);
        return;
      }

             // Crear Set de emails existentes para validar duplicados
       const existingEmails = new Set(data.map((user: User) => user.email.toLowerCase()));
       const fileEmails = new Set<string>();

      const results = {
        success: 0,
        errors: 0,
        duplicates: 0,
        errorDetails: [] as ImportError[],
      };

      // Procesar en lotes para mejor rendimiento
      for (let i = 0; i < rawRows.length; i += BATCH_SIZE) {
        const batch = rawRows.slice(i, i + BATCH_SIZE);
        await processBatch(batch, i + 2, results, existingEmails, fileEmails); // +2 porque Excel empieza en fila 1 y la 1 son headers
        
        // Actualizar progreso
        const progress = Math.min(((i + BATCH_SIZE) / rawRows.length) * 100, 100);
        setImportProgress(progress);
        
        // Pequeña pausa para no bloquear la UI
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      setImportProgress(100);
      setImportResults(results);
      
      // Mostrar resumen
      const summary = [
        `✅ Usuarios creados: ${results.success}`,
        `❌ Errores: ${results.errors}`,
        `🔄 Duplicados omitidos: ${results.duplicates}`,
        `📊 Total procesado: ${rawRows.length}`
      ].join('\n');
      
      alert(`Importación completada:\n\n${summary}`);
      
      // Log de auditoría
      console.log("Importación completada:", results);

    } catch (error) {
      console.error("Error en importación:", error);
      alert("Error al procesar el archivo. Verifique que el formato sea correcto.");
    } finally {
      setImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const readFileAsync = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsArrayBuffer(file);
    });
  };

  const processBatch = async (
    batch: UserExcelRow[],
    startRow: number,
    results: NonNullable<typeof importResults>,
    existingEmails: Set<string>,
    fileEmails: Set<string>
  ) => {
    const promises = batch.map(async (row, index) => {
      const currentRow = startRow + index;
      try {
        // Validar datos con Zod
        const validatedData = UserExcelSchema.parse(row);
        
        // Verificar email duplicado en BD
        const emailLower = validatedData.Email.toLowerCase();
        if (existingEmails.has(emailLower)) {
          results.duplicates++;
          results.errorDetails.push({
            row: currentRow,
            field: "Email",
            value: validatedData.Email,
            error: "Email ya existe en el sistema",
            suggestion: "Use un email diferente"
          });
          return;
        }
        
        // Verificar email duplicado en el archivo
        if (fileEmails.has(emailLower)) {
          results.duplicates++;
          results.errorDetails.push({
            row: currentRow,
            field: "Email", 
            value: validatedData.Email,
            error: "Email duplicado en el archivo",
            suggestion: "Revise las filas duplicadas en el archivo"
          });
          return;
        }
        
        fileEmails.add(emailLower);

        const userData = {
          nombre: validatedData["Nombre Completo"].trim(),
          email: emailLower,
          password: validatedData.Contraseña,
          rol: validatedData.Rol,
          telefono: validatedData.Teléfono.trim(),
          direccion: validatedData.Dirección?.trim() || "",
        };

        await createUser(userData).unwrap();
        existingEmails.add(emailLower); // Agregar a la lista para futuras validaciones
        results.success++;
        
      } catch (error) {
        results.errors++;
        let errorMessage = "Error desconocido";
        let field = "";
        let suggestion = "";

        if (error instanceof z.ZodError) {
          const firstError = error.issues[0];
          field = firstError.path.join(".");
          errorMessage = firstError.message;
          
          // Sugerencias específicas según el campo
          switch (field) {
            case "Nombre Completo":
              suggestion = "Debe tener al menos 3 caracteres";
              break;
            case "Email":
              suggestion = "Verifique el formato: usuario@dominio.com";
              break;
            case "Teléfono":
              suggestion = "Debe tener al menos 8 dígitos";
              break;
            case "Contraseña":
              suggestion = "Debe tener al menos 6 caracteres";
              break;
            case "Rol":
              suggestion = "Use solo: ADMIN, DOCENTE o SUPERADMIN";
              break;
          }
        } else if (typeof error === "object" && error !== null && "data" in error) {
          const apiError = error as { data?: { message?: string; error?: string } };
          errorMessage = apiError.data?.message || apiError.data?.error || "Error de API";
          suggestion = "Contacte al administrador si persiste";
        }

        results.errorDetails.push({
          row: currentRow,
          field,
          value: row ? String(Object.values(row)[0] || '') : '',
          error: errorMessage,
          suggestion
        });
      }
    });

    await Promise.allSettled(promises); // Usar allSettled para que un error no pare todo el lote
  };

  const downloadErrorReport = () => {
    if (!importResults?.errorDetails.length) return;

    const errorData = [
      ["Fila", "Campo", "Valor", "Error", "Sugerencia"],
      ...importResults.errorDetails.map(({ row, field, value, error, suggestion }) => [
        row,
        field || "General", 
        value || "",
        error,
        suggestion || "Revise los datos"
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(errorData);
    
    // Estilos para el reporte de errores
    worksheet["!cols"] = [
      { width: 8 },  // Fila
      { width: 15 }, // Campo
      { width: 20 }, // Valor
      { width: 30 }, // Error
      { width: 25 }, // Sugerencia
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Errores");
    XLSX.writeFile(workbook, `Errores_Importacion_Usuarios_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const downloadTemplate = () => {
    const templateData = [
      ["Nombre Completo", "Email", "Teléfono", "Contraseña", "Rol", "Dirección"],
      ["Juan Pérez López", "juan.perez@escuela.com", "123456789", "password123", "DOCENTE", "Av. Principal 123"],
      ["María García", "maria.garcia@escuela.com", "987654321", "secure456", "ADMIN", "Calle Secundaria 456"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    
    // Estilos para la plantilla
    worksheet["!cols"] = [
      { width: 20 }, // Nombre
      { width: 25 }, // Email
      { width: 15 }, // Teléfono
      { width: 15 }, // Contraseña
      { width: 12 }, // Rol
      { width: 25 }, // Dirección
    ];

    // Estilo para headers
    const headerStyle = {
      fill: { fgColor: { rgb: "366092" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
    };

    for (let col = 0; col < 6; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellRef]) continue;
      worksheet[cellRef].s = headerStyle;
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla");
    XLSX.writeFile(workbook, "Plantilla_Importacion_Usuarios.xlsx");
  };

  return (
    <div className="space-y-4">
      {/* Input oculto para importación */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        style={{ display: "none" }}
        accept=".xlsx, .xls, .csv"
      />

      {/* Barra de progreso durante importación */}
      {isImporting && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importando usuarios...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} className="h-2" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columnas <span className="ml-1">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Acciones <span className="ml-1">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={downloadTemplate} className="cursor-pointer">
                <FileInput className="mr-2 h-4 w-4" />
                Descargar plantilla
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleImportClick} 
                disabled={isImporting}
                className="cursor-pointer"
              >
                {isImporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileInput className="mr-2 h-4 w-4" />
                )}
                {isImporting ? "Importando..." : "Importar Excel"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
                <FileOutput className="mr-2 h-4 w-4" />
                Exportar Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/dashboard/usuarios/nuevo" passHref>
            <Button variant="default">Nuevo Usuario</Button>
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* Resumen de resultados de importación */}
      {importResults && (
        <div className="space-y-3">
          {/* Resumen exitoso */}
          {importResults.success > 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ <strong>{importResults.success} usuarios</strong> importados correctamente
              </AlertDescription>
            </Alert>
          )}

          {/* Duplicados */}
          {importResults.duplicates > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                🔄 <strong>{importResults.duplicates} registros duplicados</strong> omitidos
              </AlertDescription>
            </Alert>
          )}

          {/* Errores */}
          {importResults.errors > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span>
                    ❌ <strong>{importResults.errors} errores</strong> encontrados durante la importación
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadErrorReport}
                    className="ml-4 text-red-800 border-red-300"
                  >
                    Descargar reporte detallado
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}