package backend_escuela.ciclo.controller;

import backend_escuela.ciclo.dto.CicloEducativoRequestDto;
import backend_escuela.ciclo.dto.CicloEducativoResponseDto;
import backend_escuela.ciclo.service.CicloEducativoService;
import backend_escuela.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/api/ciclos")
@RequiredArgsConstructor
public class CicloEducativoController {


    private final CicloEducativoService cicloService;

    // POST /api/ciclos
    @PostMapping
    public ResponseEntity<ApiResponse<CicloEducativoResponseDto>> crear(
            @Valid @RequestBody CicloEducativoRequestDto request) {

        CicloEducativoResponseDto creado = cicloService.crear(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Ciclo educativo creado correctamente", creado));
    }

    // GET /api/ciclos
    @GetMapping
    public ResponseEntity<ApiResponse<List<CicloEducativoResponseDto>>> listarTodos() {
        return ResponseEntity.ok(
                ApiResponse.ok("Ciclos obtenidos", cicloService.listarTodos())
        );
    }

    // GET /api/ciclos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CicloEducativoResponseDto>> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok("Ciclo encontrado", cicloService.buscarPorId(id))
        );
    }

    // PUT /api/ciclos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CicloEducativoResponseDto>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CicloEducativoRequestDto request) {

        return ResponseEntity.ok(
                ApiResponse.ok("Ciclo actualizado correctamente", cicloService.actualizar(id, request))
        );
    }

    // DELETE /api/ciclos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        cicloService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Ciclo eliminado correctamente"));
    }






}
