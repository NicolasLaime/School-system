package backend_escuela.horario.services;

import backend_escuela.asignatura.entity.Asignatura;
import backend_escuela.asignatura.service.AsignaturaService;
import backend_escuela.horario.dto.HorarioRequestDto;
import backend_escuela.horario.dto.HorarioResponseDto;
import backend_escuela.horario.entity.Horario;
import backend_escuela.horario.repository.HorarioRepository;
import backend_escuela.seccion.entity.Seccion;
import backend_escuela.seccion.service.SeccionService;
import backend_escuela.shared.exception.ApiException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HorarioService {


    private final HorarioRepository horarioRepository;
    private final AsignaturaService asignaturaService;
    private final SeccionService seccionService;


    @Transactional
    public HorarioResponseDto crear(HorarioRequestDto request) {
        Asignatura asignatura = asignaturaService.obtenerOFallar(request.getAsignaturaId());
        Seccion seccion = seccionService.obtenerOFallar(request.getSeccionId());
        if (request.getHoraInicio().isAfter(request.getHoraFin())) {
            throw ApiException.badRequest("La hora de inicio debe ser anterior a la hora de fin");
        }
        Horario horario = Horario.builder()
                .diaSemana(request.getDiaSemana())
                .horaInicio(request.getHoraInicio())
                .horaFin(request.getHoraFin())
                .asignatura(asignatura)
                .seccion(seccion).build();
        return toResponse(horarioRepository.save(horario));
    }


    @Transactional
    public List<HorarioResponseDto> listarTodos() {
        return horarioRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }



    private HorarioResponseDto toResponse(Horario h) {
        return HorarioResponseDto.builder()
                .id(h.getId()).diaSemana(h.getDiaSemana()).horaInicio(h.getHoraInicio()).horaFin(h.getHoraFin())
                .asignaturaId(h.getAsignatura().getId()).asignaturaNombre(h.getAsignatura().getNombre())
                .seccionId(h.getSeccion().getId()).seccionNombre(h.getSeccion().getNombre()).build();
    }











}
