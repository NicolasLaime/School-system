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

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import backend_escuela.usuario.entity.Usuario;
import backend_escuela.usuario.entity.RolNombre;
import backend_escuela.usuario.repository.UsuarioRepository;
import backend_escuela.asignatura.repository.DocenteAsignaturaRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HorarioService {


    private final HorarioRepository horarioRepository;
    private final AsignaturaService asignaturaService;
    private final SeccionService seccionService;
    private final UsuarioRepository usuarioRepository;
    private final DocenteAsignaturaRepository dasRepository;


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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            Usuario usuario = usuarioRepository.findByEmail(auth.getName()).orElse(null);
            if (usuario != null && usuario.getRol() == RolNombre.DOCENTE) {
                // Filtrar horarios
                return horarioRepository.findAll().stream()
                        .filter(h -> dasRepository.existsByDocenteIdAndAsignaturaIdAndSeccionId(
                                usuario.getId(), h.getAsignatura().getId(), h.getSeccion().getId()
                        ))
                        .map(this::toResponse)
                        .collect(Collectors.toList());
            }
        }
        return horarioRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }



    private HorarioResponseDto toResponse(Horario h) {
        return HorarioResponseDto.builder()
                .id(h.getId()).diaSemana(h.getDiaSemana()).horaInicio(h.getHoraInicio()).horaFin(h.getHoraFin())
                .asignaturaId(h.getAsignatura().getId()).asignaturaNombre(h.getAsignatura().getNombre())
                .seccionId(h.getSeccion().getId()).seccionNombre(h.getSeccion().getNombre()).build();
    }











}
