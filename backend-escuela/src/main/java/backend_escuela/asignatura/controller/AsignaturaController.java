package backend_escuela.asignatura.controller;




import backend_escuela.asignatura.dto.AsignaturaRequestDto;
import backend_escuela.asignatura.dto.AsignaturaResponseDto;
import backend_escuela.asignatura.dto.DocenteAsignaturaRequestDto;
import backend_escuela.asignatura.dto.DocenteAsignaturaResponseDto;
import backend_escuela.asignatura.service.AsignaturaService;
import backend_escuela.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/asignaturas")
@RequiredArgsConstructor
public class AsignaturaController {


    private final AsignaturaService asignaturaService;


    // POST /api/asignaturas
    @PostMapping
    public ResponseEntity<ApiResponse<AsignaturaResponseDto>> crear(
            @Valid @RequestBody AsignaturaRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Asignatura creada correctamente",
                        asignaturaService.crear(request)));
    }

    // GET /api/asignaturas
    @GetMapping
    public ResponseEntity<ApiResponse<List<AsignaturaResponseDto>>> listarTodas() {
        return ResponseEntity.ok(
                ApiResponse.ok("Asignaturas obtenidas", asignaturaService.listarTodas())
        );
    }

    // GET /api/asignaturas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AsignaturaResponseDto>> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok("Asignatura encontrada", asignaturaService.buscarPorId(id))
        );
    }

    // GET /api/asignaturas/grado/{gradoId}
    @GetMapping("/grado/{gradoId}")
    public ResponseEntity<ApiResponse<List<AsignaturaResponseDto>>> listarPorGrado(
            @PathVariable Long gradoId) {

        return ResponseEntity.ok(
                ApiResponse.ok("Asignaturas obtenidas", asignaturaService.listarPorGrado(gradoId))
        );
    }

    // PUT /api/asignaturas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AsignaturaResponseDto>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AsignaturaRequestDto request) {

        return ResponseEntity.ok(
                ApiResponse.ok("Asignatura actualizada correctamente",
                        asignaturaService.actualizar(id, request))
        );
    }

    // DELETE /api/asignaturas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        asignaturaService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Asignatura eliminada correctamente"));
    }

    // POST /api/asignaturas/asignar-docente
    @PostMapping("/asignar-docente")
    public ResponseEntity<ApiResponse<DocenteAsignaturaResponseDto>> asignarDocente(
            @Valid @RequestBody DocenteAsignaturaRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Docente asignado correctamente",
                        asignaturaService.asignarDocente(request)));
    }

    // GET /api/asignaturas/docente/{docenteId}
    @GetMapping("/docente/{docenteId}")
    public ResponseEntity<ApiResponse<List<DocenteAsignaturaResponseDto>>> listarAsignacionesPorDocente(
            @PathVariable Long docenteId) {

        return ResponseEntity.ok(
                ApiResponse.ok("Asignaciones obtenidas",
                        asignaturaService.listarAsignacionesPorDocente(docenteId))
        );
    }



    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ApiResponse<AsignaturaResponseDto>> buscarPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(ApiResponse.ok("Asignatura encontrada", asignaturaService.buscarPorCodigo(codigo)));
    }
    @GetMapping("/con-docentes")
    public ResponseEntity<ApiResponse<List<AsignaturaResponseDto>>> listarConDocenteAsociado() {
        return ResponseEntity.ok(ApiResponse.ok("Asignaturas obtenidas", asignaturaService.listarConDocenteAsociado()));
    }






    // DELETE /api/asignaturas/asignar-docente
    @DeleteMapping("/asignar-docente")
    public ResponseEntity<ApiResponse<Void>> eliminarAsignacion(
            @Valid @RequestBody DocenteAsignaturaRequestDto request) {

        asignaturaService.eliminarAsignacion(request);
        return ResponseEntity.ok(ApiResponse.ok("Asignación eliminada correctamente"));
    }











}
