package backend_escuela.alumno.controller;

import backend_escuela.alumno.dto.TutorRequestDto;
import backend_escuela.alumno.dto.TutorResponseDto;
import backend_escuela.alumno.service.TutorService;
import backend_escuela.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutores")
@RequiredArgsConstructor
public class TutorController {


    private final TutorService tutorService;

    @PostMapping
    public ResponseEntity<ApiResponse<TutorResponseDto>> crear(@Valid @RequestBody TutorRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tutor creado", tutorService.crear(request)));
    }

    @GetMapping("/alumno/{alumnoId}")
    public ResponseEntity<ApiResponse<List<TutorResponseDto>>> listarPorAlumno(@PathVariable Long alumnoId) {
        return ResponseEntity.ok(
                ApiResponse.ok("Tutores del alumno", tutorService.listarPorAlumno(alumnoId)));
    }







}
