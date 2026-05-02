package backend_escuela.seccion.controller;


import backend_escuela.seccion.dto.SeccionRequestDto;
import backend_escuela.seccion.dto.SeccionResponseDto;
import backend_escuela.seccion.service.SeccionService;
import backend_escuela.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/seccion")
@RequiredArgsConstructor
public class SeccionController {

    private final SeccionService seccionService;

    // POST /api/secciones
    @PostMapping
    public ResponseEntity<ApiResponse<SeccionResponseDto>> crear(
            @Valid @RequestBody SeccionRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Sección creada correctamente", seccionService.crear(request)));
    }

    // GET /api/secciones
    @GetMapping
    public ResponseEntity<ApiResponse<List<SeccionResponseDto>>> listarTodos() {
        return ResponseEntity.ok(
                ApiResponse.ok("Secciones obtenidas", seccionService.listarTodos())
        );
    }

    // GET /api/secciones/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SeccionResponseDto>> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok("Sección encontrada", seccionService.buscarPorId(id))
        );
    }

    // GET /api/secciones/grado/{gradoId}
    @GetMapping("/grado/{gradoId}")
    public ResponseEntity<ApiResponse<List<SeccionResponseDto>>> listarPorGrado(
            @PathVariable Long gradoId) {

        return ResponseEntity.ok(
                ApiResponse.ok("Secciones obtenidas", seccionService.listarPorGrado(gradoId))
        );
    }

    // GET /api/secciones/ciclo-lectivo/{cicloLectivo}  → ej: /api/secciones/ciclo-lectivo/2024-2025
    @GetMapping("/ciclo-lectivo/{cicloLectivo}")
    public ResponseEntity<ApiResponse<List<SeccionResponseDto>>> listarPorCicloLectivo(
            @PathVariable String cicloLectivo) {

        return ResponseEntity.ok(
                ApiResponse.ok("Secciones obtenidas", seccionService.listarPorCicloLectivo(cicloLectivo))
        );
    }

    // PUT /api/secciones/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SeccionResponseDto>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody SeccionRequestDto request) {

        return ResponseEntity.ok(
                ApiResponse.ok("Sección actualizada correctamente", seccionService.actualizar(id, request))
        );
    }

    // DELETE /api/secciones/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        seccionService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Sección eliminada correctamente"));
    }



}
