package backend_escuela.ponderacion.controller;

import backend_escuela.ponderacion.dto.PonderacionRequestDto;
import backend_escuela.ponderacion.dto.PonderacionResponseDto;
import backend_escuela.ponderacion.dto.PonderacionResumenDto;
import backend_escuela.ponderacion.service.PonderacionService;
import backend_escuela.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/ponderaciones")
@RequiredArgsConstructor
public class PonderacionController {




        private final PonderacionService ponderacionService;

        // POST /api/ponderaciones
        @PostMapping
        public ResponseEntity<ApiResponse<PonderacionResponseDto>> crear(
                @Valid @RequestBody PonderacionRequestDto request) {

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Ponderación creada correctamente",
                            ponderacionService.crear(request)));
        }

        // GET /api/ponderaciones
        @GetMapping
        public ResponseEntity<ApiResponse<List<PonderacionResponseDto>>> listarTodas() {
            return ResponseEntity.ok(
                    ApiResponse.ok("Ponderaciones obtenidas", ponderacionService.listarTodas())
            );
        }

        // GET /api/ponderaciones/{id}
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<PonderacionResponseDto>> buscarPorId(
                @PathVariable Long id) {

            return ResponseEntity.ok(
                    ApiResponse.ok("Ponderación encontrada", ponderacionService.buscarPorId(id))
            );
        }

        // GET /api/ponderaciones/ciclo/{cicloId}
        // Lista todas las ponderaciones de un ciclo educativo
        @GetMapping("/ciclo/{cicloId}")
        public ResponseEntity<ApiResponse<List<PonderacionResponseDto>>> listarPorCiclo(
                @PathVariable Long cicloId) {

            return ResponseEntity.ok(
                    ApiResponse.ok("Ponderaciones obtenidas",
                            ponderacionService.listarPorCiclo(cicloId))
            );
        }

        // GET /api/ponderaciones/ciclo/{cicloId}/resumen
        // Muestra todas las ponderaciones + total acumulado + si está completo al 100%
        @GetMapping("/ciclo/{cicloId}/resumen")
        public ResponseEntity<ApiResponse<PonderacionResumenDto>> obtenerResumen(
                @PathVariable Long cicloId) {

            return ResponseEntity.ok(
                    ApiResponse.ok("Resumen obtenido",
                            ponderacionService.obtenerResumen(cicloId))
            );
        }

        // PUT /api/ponderaciones/{id}
        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<PonderacionResponseDto>> actualizar(
                @PathVariable Long id,
                @Valid @RequestBody PonderacionRequestDto request) {

            return ResponseEntity.ok(
                    ApiResponse.ok("Ponderación actualizada correctamente",
                            ponderacionService.actualizar(id, request))
            );
        }

        // DELETE /api/ponderaciones/{id}
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
            ponderacionService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.ok("Ponderación eliminada correctamente"));
        }



}
