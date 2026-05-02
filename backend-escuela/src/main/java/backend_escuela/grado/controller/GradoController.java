package backend_escuela.grado.controller;

import backend_escuela.grado.dto.GradoRequestDto;
import backend_escuela.grado.dto.GradoResponseDto;
import backend_escuela.grado.service.GradoService;
import backend_escuela.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/grados")
@RequiredArgsConstructor
public class GradoController {




    private final GradoService gradoService;

    // POST /api/grados
    @PostMapping
    public ResponseEntity<ApiResponse<GradoResponseDto>> crear(
            @Valid @RequestBody GradoRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Grado creado correctamente", gradoService.crear(request)));
    }

    // GET /api/grados
    @GetMapping
    public ResponseEntity<ApiResponse<List<GradoResponseDto>>> listarTodos() {
        return ResponseEntity.ok(
                ApiResponse.ok("Grados obtenidos", gradoService.listarTodos())
        );
    }

    // GET /api/grados/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GradoResponseDto>> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok("Grado encontrado", gradoService.buscarPorId(id))
        );
    }

    // GET /api/grados/ciclo/{cicloId}  → todos los grados de un ciclo
    @GetMapping("/ciclo/{cicloId}")
    public ResponseEntity<ApiResponse<List<GradoResponseDto>>> listarPorCiclo(
            @PathVariable Long cicloId) {

        return ResponseEntity.ok(
                ApiResponse.ok("Grados obtenidos", gradoService.listarPorCiclo(cicloId))
        );
    }

    // PUT /api/grados/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GradoResponseDto>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody GradoRequestDto request) {

        return ResponseEntity.ok(
                ApiResponse.ok("Grado actualizado correctamente", gradoService.actualizar(id, request))
        );
    }

    // DELETE /api/grados/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        gradoService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Grado eliminado correctamente"));
    }













}
