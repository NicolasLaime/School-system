package backend_escuela.reporte.service;


import backend_escuela.notas.dto.ResumenAlumnoDto;
import backend_escuela.shared.enums.Bimestre;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;


@Component
public class BoletaBuilder {

    // ─── Colores institucionales ──────────────────────────────────────────
    // Podés cambiar estos valores por los colores del colegio
    private static final DeviceRgb COLOR_PRIMARIO    = new DeviceRgb(30,  80,  160); // Azul
    private static final DeviceRgb COLOR_SECUNDARIO  = new DeviceRgb(240, 244, 252); // Azul muy claro
    private static final DeviceRgb COLOR_APROBADO    = new DeviceRgb(22,  163, 74);  // Verde
    private static final DeviceRgb COLOR_REPROBADO   = new DeviceRgb(220, 38,  38);  // Rojo
    private static final DeviceRgb COLOR_TEXTO_GRIS  = new DeviceRgb(100, 100, 100);

    // Nota mínima para aprobar
    private static final BigDecimal NOTA_MINIMA = BigDecimal.valueOf(60);

    /**
     * Genera el PDF de la boleta y lo devuelve como arreglo de bytes.
     * Spring lo manda directo al navegador — no se guarda en disco.
     */
    public byte[] generar(ResumenAlumnoDto resumen, String nombreColegio) {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            // ── Inicializar documento ─────────────────────────────────────
            PdfWriter writer   = new PdfWriter(baos);
            PdfDocument pdfDoc   = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(36, 36, 36, 36); // márgenes en puntos

            // ── Fuentes ───────────────────────────────────────────────────
            PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontBold   = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            // ── 1. Encabezado ─────────────────────────────────────────────
            agregarEncabezado(document, fontBold, fontNormal, nombreColegio, resumen);

            // ── 2. Datos del alumno ───────────────────────────────────────
            agregarDatosAlumno(document, fontBold, fontNormal, resumen);

            // ── 3. Tabla de notas ─────────────────────────────────────────
            agregarTablaNotas(document, fontBold, fontNormal, resumen);

            // ── 4. Promedio general ───────────────────────────────────────
            agregarPromedioGeneral(document, fontBold, fontNormal, resumen);

            // ── 5. Pie de página con firma ────────────────────────────────
            agregarFirma(document, fontNormal);

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generando el PDF de la boleta: " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    // ─────────────────────────────────────────────────────────────────────
    // SECCIÓN 1: ENCABEZADO
    // ─────────────────────────────────────────────────────────────────────
    private void agregarEncabezado(Document doc, PdfFont bold, PdfFont normal,
                                   String nombreColegio, ResumenAlumnoDto resumen) {

        // Tabla de 2 columnas: nombre del colegio | fecha y ciclo
        Table header = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                .setWidth(UnitValue.createPercentValue(100))
                .setBackgroundColor(COLOR_PRIMARIO)
                .setBorder(Border.NO_BORDER);

        // Columna izquierda: nombre del colegio
        Cell celdaNombre = new Cell()
                .setBorder(Border.NO_BORDER)
                .setPadding(12);
        celdaNombre.add(new Paragraph(nombreColegio)
                .setFont(bold)
                .setFontSize(14)
                .setFontColor(ColorConstants.WHITE));
        celdaNombre.add(new Paragraph("Boleta de Calificaciones")
                .setFont(normal)
                .setFontSize(10)
                .setFontColor(ColorConstants.WHITE));
        header.addCell(celdaNombre);

        // Columna derecha: ciclo lectivo y fecha
        Cell celdaCiclo = new Cell()
                .setBorder(Border.NO_BORDER)
                .setPadding(12)
                .setTextAlignment(TextAlignment.RIGHT);
        celdaCiclo.add(new Paragraph("Ciclo " + resumen.getCicloLectivo())
                .setFont(bold)
                .setFontSize(11)
                .setFontColor(ColorConstants.WHITE));
        celdaCiclo.add(new Paragraph(
                "Generada: " + LocalDate.now().format(
                        DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .setFont(normal)
                .setFontSize(9)
                .setFontColor(ColorConstants.WHITE));
        header.addCell(celdaCiclo);

        doc.add(header);

        // Espacio después del encabezado
        doc.add(new Paragraph("\n").setFontSize(4));
    }

    // ─────────────────────────────────────────────────────────────────────
    // SECCIÓN 2: DATOS DEL ALUMNO
    // ─────────────────────────────────────────────────────────────────────
    private void agregarDatosAlumno(Document doc, PdfFont bold, PdfFont normal,
                                    ResumenAlumnoDto resumen) {

        // Tabla de 4 columnas para los datos del alumno
        Table tabla = new Table(UnitValue.createPercentArray(new float[]{25, 25, 25, 25}))
                .setWidth(UnitValue.createPercentValue(100))
                .setBackgroundColor(COLOR_SECUNDARIO)
                .setBorder(new SolidBorder(COLOR_PRIMARIO, 0.5f));

        agregarCeldaDato(tabla, bold, normal, "Alumno",
                resumen.getAlumnoApellido() + ", " + resumen.getAlumnoNombre());
        agregarCeldaDato(tabla, bold, normal, "Código",
                resumen.getAlumnoCodigo());
        agregarCeldaDato(tabla, bold, normal, "Grado",
                resumen.getGradoNombre());
        agregarCeldaDato(tabla, bold, normal, "Sección",
                resumen.getSeccionNombre());

        doc.add(tabla);
        doc.add(new Paragraph("\n").setFontSize(6));
    }

    // Celda con etiqueta arriba y valor abajo
    private void agregarCeldaDato(Table tabla, PdfFont bold, PdfFont normal,
                                  String etiqueta, String valor) {
        Cell celda = new Cell()
                .setPadding(8)
                .setBorder(Border.NO_BORDER)
                .setBorderRight(new SolidBorder(ColorConstants.WHITE, 1));

        celda.add(new Paragraph(etiqueta.toUpperCase())
                .setFont(normal)
                .setFontSize(8)
                .setFontColor(COLOR_TEXTO_GRIS));
        celda.add(new Paragraph(valor)
                .setFont(bold)
                .setFontSize(10));

        tabla.addCell(celda);
    }

    // ─────────────────────────────────────────────────────────────────────
    // SECCIÓN 3: TABLA DE NOTAS
    // La parte más importante. Una fila por asignatura.
    // Columnas: Asignatura | Bim.1 | Bim.2 | Bim.3 | Bim.4 | Promedio
    // ─────────────────────────────────────────────────────────────────────
    private void agregarTablaNotas(Document doc, PdfFont bold, PdfFont normal,
                                   ResumenAlumnoDto resumen) {

        // 6 columnas: asignatura (40%) + 4 bimestres (10% c/u) + promedio (20%)
        Table tabla = new Table(UnitValue.createPercentArray(new float[]{40, 10, 10, 10, 10, 20}))
                .setWidth(UnitValue.createPercentValue(100));

        // ── Encabezados de la tabla ───────────────────────────────────────
        String[] encabezados = {"Asignatura", "Bim. 1", "Bim. 2", "Bim. 3", "Bim. 4", "Promedio"};
        for (String enc : encabezados) {
            tabla.addHeaderCell(
                    new Cell()
                            .setBackgroundColor(COLOR_PRIMARIO)
                            .setPadding(7)
                            .setBorder(Border.NO_BORDER)
                            .add(new Paragraph(enc)
                                    .setFont(bold)
                                    .setFontSize(9)
                                    .setFontColor(ColorConstants.WHITE)
                                    .setTextAlignment(
                                            enc.equals("Asignatura")
                                                    ? TextAlignment.LEFT
                                                    : TextAlignment.CENTER
                                    ))
            );
        }

        // ── Filas de asignaturas ──────────────────────────────────────────
        boolean filaAlterna = false;

        for (ResumenAlumnoDto.FilaAsignaturaDto fila : resumen.getAsignaturas()) {

            DeviceRgb colorFila = filaAlterna
                    ? COLOR_SECUNDARIO
                    : null; // null = blanco

            // Celda de nombre de asignatura
            tabla.addCell(celdaTexto(fila.getAsignaturaNombre(), bold, 10,
                    TextAlignment.LEFT, colorFila, false));

            // Celdas de cada bimestre
            for (Bimestre bimestre : Bimestre.values()) {
                String key   = "Bimestre " + bimestre.getNumero();
                BigDecimal v = fila.getPromediosPorBimestre().getOrDefault(key, null);

                if (v != null) {
                    tabla.addCell(celdaNumero(v, normal, colorFila));
                } else {
                    // Sin notas en ese bimestre
                    tabla.addCell(celdaTexto("-", normal, 9,
                            TextAlignment.CENTER, colorFila, false));
                }
            }

            // Celda de promedio final (coloreada según aprobado/reprobado)
            boolean aprobado = fila.getPromedioFinal()
                    .compareTo(NOTA_MINIMA) >= 0;

            tabla.addCell(celdaPromedioFinal(fila.getPromedioFinal(), bold, aprobado, colorFila));

            filaAlterna = !filaAlterna;
        }

        doc.add(tabla);
        doc.add(new Paragraph("\n").setFontSize(6));
    }

    // ─────────────────────────────────────────────────────────────────────
    // SECCIÓN 4: PROMEDIO GENERAL
    // ─────────────────────────────────────────────────────────────────────
    private void agregarPromedioGeneral(Document doc, PdfFont bold, PdfFont normal,
                                        ResumenAlumnoDto resumen) {

        boolean aprobado = resumen.getPromedioGeneral()
                .compareTo(NOTA_MINIMA) >= 0;

        Table tabla = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                .setWidth(UnitValue.createPercentValue(100));

        // Celda vacía izquierda
        tabla.addCell(new Cell()
                .setBorder(Border.NO_BORDER)
                .setPadding(8));

        // Celda derecha: promedio general
        DeviceRgb colorPromedio = aprobado ? COLOR_APROBADO : COLOR_REPROBADO;

        Cell celdaPromedio = new Cell()
                .setBackgroundColor(colorPromedio)
                .setPadding(8)
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.CENTER);

        celdaPromedio.add(new Paragraph("PROMEDIO GENERAL")
                .setFont(normal)
                .setFontSize(8)
                .setFontColor(ColorConstants.WHITE));

        celdaPromedio.add(new Paragraph(
                resumen.getPromedioGeneral().setScale(2, RoundingMode.HALF_UP).toString())
                .setFont(bold)
                .setFontSize(18)
                .setFontColor(ColorConstants.WHITE)
                .setTextAlignment(TextAlignment.CENTER));

        celdaPromedio.add(new Paragraph(aprobado ? "APROBADO" : "REPROBADO")
                .setFont(bold)
                .setFontSize(9)
                .setFontColor(ColorConstants.WHITE)
                .setTextAlignment(TextAlignment.CENTER));

        tabla.addCell(celdaPromedio);
        doc.add(tabla);
        doc.add(new Paragraph("\n").setFontSize(10));
    }

    // ─────────────────────────────────────────────────────────────────────
    // SECCIÓN 5: FIRMA
    // ─────────────────────────────────────────────────────────────────────
    private void agregarFirma(Document doc, PdfFont normal) {

        Table tabla = new Table(UnitValue.createPercentArray(new float[]{33, 34, 33}))
                .setWidth(UnitValue.createPercentValue(100));

        // Firma del docente
        tabla.addCell(celdaFirma(normal, "Docente"));

        // Celda central vacía
        tabla.addCell(new Cell()
                .setBorder(Border.NO_BORDER));

        // Firma del director
        tabla.addCell(celdaFirma(normal, "Director/a"));

        doc.add(tabla);
    }

    private Cell celdaFirma(PdfFont normal, String cargo) {
        Cell celda = new Cell()
                .setBorder(Border.NO_BORDER)
                .setPadding(8)
                .setTextAlignment(TextAlignment.CENTER);

        // Línea de firma (simulada con un borde superior)
        celda.add(new Paragraph("_________________________")
                .setFont(normal)
                .setFontSize(10)
                .setFontColor(COLOR_TEXTO_GRIS)
                .setTextAlignment(TextAlignment.CENTER));

        celda.add(new Paragraph(cargo)
                .setFont(normal)
                .setFontSize(9)
                .setFontColor(COLOR_TEXTO_GRIS)
                .setTextAlignment(TextAlignment.CENTER));

        return celda;
    }

    // ─────────────────────────────────────────────────────────────────────
    // HELPERS DE CELDAS
    // ─────────────────────────────────────────────────────────────────────
    private Cell celdaTexto(String texto, PdfFont font, float size,
                            TextAlignment align, DeviceRgb bgColor, boolean esHeader) {
        Cell celda = new Cell()
                .setPadding(6)
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER)
                .setBorderTop(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.3f));

        if (bgColor != null) celda.setBackgroundColor(bgColor);

        celda.add(new Paragraph(texto)
                .setFont(font)
                .setFontSize(size)
                .setTextAlignment(align));

        return celda;
    }

    private Cell celdaNumero(BigDecimal valor, PdfFont font, DeviceRgb bgColor) {
        return celdaTexto(
                valor.setScale(2, RoundingMode.HALF_UP).toString(),
                font, 9, TextAlignment.CENTER, bgColor, false
        );
    }

    private Cell celdaPromedioFinal(BigDecimal valor, PdfFont bold,
                                    boolean aprobado, DeviceRgb bgColor) {
        Cell celda = new Cell()
                .setPadding(6)
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER)
                .setBorderTop(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.3f));

        if (bgColor != null) celda.setBackgroundColor(bgColor);

        DeviceRgb colorTexto = aprobado ? COLOR_APROBADO : COLOR_REPROBADO;

        celda.add(new Paragraph(valor.setScale(2, RoundingMode.HALF_UP).toString())
                .setFont(bold)
                .setFontSize(10)
                .setFontColor(colorTexto)
                .setTextAlignment(TextAlignment.CENTER));

        return celda;
    }

















}
