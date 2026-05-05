package backend_escuela.horario.controller;

import backend_escuela.horario.dto.HorarioRequestDto;
import backend_escuela.horario.dto.HorarioResponseDto;
import backend_escuela.horario.services.HorarioService;
import backend_escuela.shared.response.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@AllArgsConstructor
public class HorarioController {

    private final HorarioService horarioService;


    @PostMapping
    public ResponseEntity<ApiResponse<HorarioResponseDto>> crear(@Valid @RequestBody HorarioRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Horario creado", horarioService.crear(request)));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<HorarioResponseDto>>> listarTodos() {
        return ResponseEntity.ok(ApiResponse.ok("Horarios", horarioService.listarTodos()));
    }









}
