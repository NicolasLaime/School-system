package backend_escuela.notas.dto;


import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class NotaExcelParser {

    // Índices de columnas en el Excel (base 0)
    private static final int COL_CODIGO_ALUMNO  = 0; // "ALU-0001"
    private static final int COL_TIPO_NOTA      = 1; // "Tareas"
    private static final int COL_BIMESTRE       = 2; // 1, 2, 3 o 4
    private static final int COL_VALOR          = 3; // 85.50

    public static class FilaParseada {
        public int    numeroFila;
        public String codigoAlumno;
        public String tipoNota;
        public int    bimestreNumero;
        public BigDecimal valor;
        public String error; // null si la fila es válida

        public boolean tieneError() {
            return error != null;
        }
    }

    /**
     * Parsea el archivo Excel y devuelve una lista de filas.
     * Cada fila puede ser válida o contener un mensaje de error.
     * La fila 0 (encabezado) se ignora automáticamente.
     */
    public List<FilaParseada> parsear(MultipartFile archivo) throws IOException {

        List<FilaParseada> resultado = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0); // Primera hoja

            // Empezamos desde la fila 1 (fila 0 = encabezado)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {

                Row row = sheet.getRow(i);
                FilaParseada fila = new FilaParseada();
                fila.numeroFila = i + 1; // Lo mostramos en base 1 para el usuario

                // Ignorar filas completamente vacías
                if (row == null || esFilaVacia(row)) {
                    continue;
                }

                try {
                    fila.codigoAlumno  = leerTexto(row, COL_CODIGO_ALUMNO, "codigo_alumno");
                    fila.tipoNota      = leerTexto(row, COL_TIPO_NOTA,     "tipo_nota");
                    fila.bimestreNumero = (int) leerNumero(row, COL_BIMESTRE, "bimestre");
                    fila.valor         = BigDecimal.valueOf(leerNumero(row, COL_VALOR, "valor"));

                    // Validar rango del bimestre
                    if (fila.bimestreNumero < 1 || fila.bimestreNumero > 4) {
                        fila.error = "Bimestre inválido: " + fila.bimestreNumero +
                                ". Debe ser 1, 2, 3 o 4";
                    }

                    // Validar rango de la nota
                    if (fila.valor.compareTo(BigDecimal.ZERO) < 0 ||
                            fila.valor.compareTo(BigDecimal.valueOf(100)) > 0) {
                        fila.error = "Valor inválido: " + fila.valor +
                                ". Debe estar entre 0 y 100";
                    }

                } catch (Exception e) {
                    fila.error = e.getMessage();
                    log.warn("Error parseando fila {}: {}", fila.numeroFila, e.getMessage());
                }

                resultado.add(fila);
            }
        }

        return resultado;
    }

    // ─── Helpers de lectura ───────────────────────────────────────────────

    private String leerTexto(Row row, int colIndex, String nombreCol) {
        Cell cell = row.getCell(colIndex);

        if (cell == null) {
            throw new IllegalArgumentException(
                    "La columna '" + nombreCol + "' está vacía"
            );
        }

        // Forzar lectura como String aunque la celda sea numérica
        cell.setCellType(CellType.STRING);
        String valor = cell.getStringCellValue().trim();

        if (valor.isEmpty()) {
            throw new IllegalArgumentException(
                    "La columna '" + nombreCol + "' no puede estar vacía"
            );
        }

        return valor;
    }

    private double leerNumero(Row row, int colIndex, String nombreCol) {
        Cell cell = row.getCell(colIndex);

        if (cell == null) {
            throw new IllegalArgumentException(
                    "La columna '" + nombreCol + "' está vacía"
            );
        }

        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        }

        // Intentar parsear como texto si el tipo no es numérico
        if (cell.getCellType() == CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException(
                        "La columna '" + nombreCol + "' debe ser un número"
                );
            }
        }

        throw new IllegalArgumentException(
                "La columna '" + nombreCol + "' tiene un formato inesperado"
        );
    }

    private boolean esFilaVacia(Row row) {
        for (int i = COL_CODIGO_ALUMNO; i <= COL_VALOR; i++) {
            Cell cell = row.getCell(i);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }













}
