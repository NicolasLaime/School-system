package backend_escuela.alumno.controller;

import backend_escuela.alumno.dto.AlumnoRequestDto;
import backend_escuela.alumno.dto.AlumnoResponseDto;
import backend_escuela.alumno.service.AlumnoService;
import backend_escuela.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
@RequiredArgsConstructor
public class AlumnoController {



    private final AlumnoService alumnoService;

    // POST /api/alumnos
    @PostMapping
    public ResponseEntity<ApiResponse<AlumnoResponseDto>> crear(
            @Valid @RequestBody AlumnoRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Alumno creado correctamente", alumnoService.crear(request)));
    }

    // GET /api/alumnos
    @GetMapping
    public ResponseEntity<ApiResponse<List<AlumnoResponseDto>>> listarTodos() {
        return ResponseEntity.ok(
                ApiResponse.ok("Alumnos obtenidos", alumnoService.listarTodos())
        );
    }

    // GET /api/alumnos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AlumnoResponseDto>> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok("Alumno encontrado", alumnoService.buscarPorId(id))
        );
    }

    // GET /api/alumnos/codigo/{codigo}
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ApiResponse<AlumnoResponseDto>> buscarPorCodigo(
            @PathVariable String codigo) {

        return ResponseEntity.ok(
                ApiResponse.ok("Alumno encontrado", alumnoService.buscarPorCodigo(codigo))
        );
    }

    // GET /api/alumnos/seccion/{seccionId}
    @GetMapping("/seccion/{seccionId}")
    public ResponseEntity<ApiResponse<List<AlumnoResponseDto>>> listarPorSeccion(
            @PathVariable Long seccionId) {

        return ResponseEntity.ok(
                ApiResponse.ok("Alumnos obtenidos", alumnoService.listarPorSeccion(seccionId))
        );
    }

    // GET /api/alumnos/grado/{gradoId}/ciclo/{cicloLectivo}
    // ej: /api/alumnos/grado/1/ciclo/2024-2025
    @GetMapping("/grado/{gradoId}/ciclo/{cicloLectivo}")
    public ResponseEntity<ApiResponse<List<AlumnoResponseDto>>> listarPorGradoYCiclo(
            @PathVariable Long   gradoId,
            @PathVariable String cicloLectivo) {

        return ResponseEntity.ok(
                ApiResponse.ok("Alumnos obtenidos",
                        alumnoService.listarPorGradoYCiclo(gradoId, cicloLectivo))
        );
    }

    // PUT /api/alumnos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AlumnoResponseDto>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AlumnoRequestDto request) {

        return ResponseEntity.ok(
                ApiResponse.ok("Alumno actualizado correctamente",
                        alumnoService.actualizar(id, request))
        );
    }

    // DELETE /api/alumnos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable Long id) {
        alumnoService.desactivar(id);
        return ResponseEntity.ok(ApiResponse.ok("Alumno desactivado correctamente"));
    }



}
