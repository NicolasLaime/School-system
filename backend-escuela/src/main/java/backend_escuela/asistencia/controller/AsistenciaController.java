package backend_escuela.asistencia.controller;

import backend_escuela.asistencia.dto.AsistenciaAlumnoRequestDto;
import backend_escuela.asistencia.dto.AsistenciaAlumnoResponseDto;
import backend_escuela.asistencia.dto.AsistenciaDocenteRequestDto;
import backend_escuela.asistencia.dto.AsistenciaDocenteResponseDto;
import backend_escuela.asistencia.services.AsistenciaService;
import backend_escuela.shared.response.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
@AllArgsConstructor
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    @PostMapping("/alumno")
    public ResponseEntity<ApiResponse<AsistenciaAlumnoResponseDto>> registrarAsistenciaAlumno(
            @Valid @RequestBody AsistenciaAlumnoRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Asistencia registrada", asistenciaService.registrarAsistenciaAlumno(request)));
    }
    @GetMapping("/alumno/seccion/{seccionId}")
    public ResponseEntity<ApiResponse<List<AsistenciaAlumnoResponseDto>>> listarAsistenciaAlumno(
            @PathVariable Long seccionId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(ApiResponse.ok("Asistencias obtenidas", asistenciaService.listarAsistenciaAlumno(seccionId, fecha)));
    }

    @PostMapping("/docente")
    public ResponseEntity<ApiResponse<AsistenciaDocenteResponseDto>> registrarAsistenciaDocente(
            @Valid @RequestBody AsistenciaDocenteRequestDto request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(
                        "Asistencia docente registrada",
                        asistenciaService.registrarAsistenciaDocente(request)
                ));
    }

    @GetMapping("/docente")
    public ResponseEntity<ApiResponse<List<AsistenciaDocenteResponseDto>>> listarAsistenciaDocente(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Asistencias docentes obtenidas",
                        asistenciaService.listarAsistenciaDocente(fecha)
                )
        );
    }




}
