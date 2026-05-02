package backend_escuela.reporte.controller;


import backend_escuela.reporte.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {


    private final ReporteService reporteService;

    /**
     * GET /api/reportes/boleta/{alumnoId}?cicloLectivo=2024-2025&usuarioId=1
     *
     * Devuelve el PDF directamente como descarga.
     * El navegador muestra el diálogo "Guardar como boleta_ALU0001.pdf"
     */
    @GetMapping("/boleta/{alumnoId}")
    public ResponseEntity<byte[]> generarBoleta(
            @PathVariable Long   alumnoId,
            @RequestParam String cicloLectivo,
            @RequestParam Long   usuarioId) {

        byte[] pdf = reporteService.generarBoleta(alumnoId, cicloLectivo, usuarioId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("boleta_" + alumnoId + "_" + cicloLectivo + ".pdf")
                                .build()
                                .toString())
                .body(pdf);
    }

    /**
     * GET /api/reportes/boletas/seccion/{seccionId}?cicloLectivo=2024-2025&usuarioId=1
     *
     * Genera las boletas de todos los alumnos de una sección
     * y las devuelve como un ZIP con un PDF por alumno.
     */
    @GetMapping("/boletas/seccion/{seccionId}")
    public ResponseEntity<byte[]> generarBoletasSeccion(
            @PathVariable Long   seccionId,
            @RequestParam String cicloLectivo,
            @RequestParam Long   usuarioId) {

        java.util.Map<Long, byte[]> boletas =
                reporteService.generarBoletasSeccion(seccionId, cicloLectivo, usuarioId);

        // Empaquetar todos los PDFs en un ZIP
        byte[] zip = crearZip(boletas, cicloLectivo);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/zip"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("boletas_seccion_" + seccionId + "_" + cicloLectivo + ".zip")
                                .build()
                                .toString())
                .body(zip);
    }

    /**
     * Empaqueta los PDFs en un ZIP en memoria.
     * Cada entrada del ZIP es: boleta_{alumnoId}_{ciclo}.pdf
     */
    private byte[] crearZip(java.util.Map<Long, byte[]> boletas, String cicloLectivo) {

        java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();

        try (java.util.zip.ZipOutputStream zos =
                     new java.util.zip.ZipOutputStream(baos)) {

            for (java.util.Map.Entry<Long, byte[]> entry : boletas.entrySet()) {
                String nombreArchivo =
                        "boleta_" + entry.getKey() + "_" + cicloLectivo + ".pdf";

                zos.putNextEntry(new java.util.zip.ZipEntry(nombreArchivo));
                zos.write(entry.getValue());
                zos.closeEntry();
            }

        } catch (java.io.IOException e) {
            throw new RuntimeException("Error creando el ZIP de boletas: " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }





}
