package backend_escuela.notas.controller;


import backend_escuela.notas.dto.NotaExcelResultDto;
import backend_escuela.notas.dto.NotaRequestDto;
import backend_escuela.notas.dto.NotaResponseDto;
import backend_escuela.notas.dto.ResumenAlumnoDto;
import backend_escuela.notas.service.NotaService;
import backend_escuela.shared.enums.Bimestre;
import backend_escuela.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notas")
@RequiredArgsConstructor
public class NotaController {



    private final NotaService notaService;

    // POST /api/notas  →  carga manual de una nota
    @PostMapping
    public ResponseEntity<ApiResponse<NotaResponseDto>> crear(
            @Valid @RequestBody NotaRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Nota creada correctamente",
                        notaService.crear(request)));
    }

    // GET /api/notas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NotaResponseDto>> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok("Nota encontrada", notaService.buscarPorId(id))
        );
    }

    // GET /api/notas/alumno/{alumnoId}/asignatura/{asignaturaId}?cicloLectivo=2024-2025
    @GetMapping("/alumno/{alumnoId}/asignatura/{asignaturaId}")
    public ResponseEntity<ApiResponse<List<NotaResponseDto>>> listarPorAlumnoYAsignatura(
            @PathVariable Long   alumnoId,
            @PathVariable Long   asignaturaId,
            @RequestParam String cicloLectivo) {

        return ResponseEntity.ok(
                ApiResponse.ok("Notas obtenidas",
                        notaService.listarPorAlumnoYAsignatura(
                                alumnoId, asignaturaId, cicloLectivo))
        );
    }

    // GET /api/notas/seccion/{seccionId}/asignatura/{asignaturaId}/bimestre/{bimestre}
    // ?cicloLectivo=2024-2025
    @GetMapping("/seccion/{seccionId}/asignatura/{asignaturaId}/bimestre/{bimestre}")
    public ResponseEntity<ApiResponse<List<NotaResponseDto>>> listarPorSeccion(
            @PathVariable Long     seccionId,
            @PathVariable Long     asignaturaId,
            @PathVariable Bimestre bimestre,
            @RequestParam String   cicloLectivo) {

        return ResponseEntity.ok(
                ApiResponse.ok("Notas obtenidas",
                        notaService.listarPorSeccionAsignaturaBimestre(
                                seccionId, asignaturaId, bimestre, cicloLectivo))
        );
    }

    // PUT /api/notas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NotaResponseDto>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody NotaRequestDto request) {

        return ResponseEntity.ok(
                ApiResponse.ok("Nota actualizada correctamente",
                        notaService.actualizar(id, request))
        );
    }

    // DELETE /api/notas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        notaService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Nota eliminada correctamente"));
    }

    // POST /api/notas/excel
    // Recibe el archivo + parámetros de contexto
    @PostMapping(value = "/excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<NotaExcelResultDto>> cargarDesdeExcel(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("seccionId")    Long          seccionId,
            @RequestParam("asignaturaId") Long          asignaturaId,
            @RequestParam("cicloLectivo") String        cicloLectivo,
            @RequestParam("docenteId")    Long          docenteId) {

        NotaExcelResultDto resultado = notaService.cargarDesdeExcel(
                archivo, seccionId, asignaturaId, cicloLectivo, docenteId
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        resultado.getGuardadas() + " notas guardadas, " +
                                resultado.getErrores()   + " errores",
                        resultado
                )
        );
    }

    // GET /api/notas/resumen/alumno/{alumnoId}?cicloLectivo=2024-2025
    // Cuadro completo con promedios ponderados por bimestre y promedio final
    @GetMapping("/resumen/alumno/{alumnoId}")
    public ResponseEntity<ApiResponse<ResumenAlumnoDto>> obtenerResumen(
            @PathVariable Long   alumnoId,
            @RequestParam String cicloLectivo) {

        return ResponseEntity.ok(
                ApiResponse.ok("Resumen obtenido",
                        notaService.obtenerResumen(alumnoId, cicloLectivo))
        );
    }















}
