package backend_escuela.asistencia.services;

import backend_escuela.alumno.entity.Alumno;
import backend_escuela.alumno.service.AlumnoService;
import backend_escuela.asistencia.dto.AsistenciaAlumnoRequestDto;
import backend_escuela.asistencia.dto.AsistenciaAlumnoResponseDto;
import backend_escuela.asistencia.dto.AsistenciaDocenteRequestDto;
import backend_escuela.asistencia.dto.AsistenciaDocenteResponseDto;
import backend_escuela.asistencia.entity.AsistenciaAlumno;
import backend_escuela.asistencia.entity.AsistenciaDocente;
import backend_escuela.asistencia.repository.AsistenciaAlumnoRepository;
import backend_escuela.asistencia.repository.AsistenciaDocenteRepository;
import backend_escuela.seccion.entity.Seccion;
import backend_escuela.seccion.service.SeccionService;
import backend_escuela.usuario.entity.Usuario;
import backend_escuela.usuario.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import backend_escuela.usuario.entity.RolNombre;
import backend_escuela.shared.exception.ApiException;
import backend_escuela.asignatura.repository.DocenteAsignaturaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsistenciaService {

    private final AsistenciaAlumnoRepository asistenciaAlumnoRepository;
    private final AsistenciaDocenteRepository asistenciaDocenteRepository;
    private final AlumnoService alumnoService;
    private final SeccionService seccionService;
    private final UsuarioRepository usuarioRepository;
    private final DocenteAsignaturaRepository dasRepository;

    private void validarAccesoDocenteASeccion(Long seccionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            Usuario usuario = usuarioRepository.findByEmail(auth.getName()).orElse(null);
            if (usuario != null && usuario.getRol() == RolNombre.DOCENTE) {
                if (!dasRepository.existsByDocenteIdAndSeccionId(usuario.getId(), seccionId)) {
                    throw ApiException.forbidden("No tiene permisos sobre esta sección");
                }
            }
        }
    }


    @Transactional
    public AsistenciaAlumnoResponseDto registrarAsistenciaAlumno(AsistenciaAlumnoRequestDto request) {
        Alumno alumno = alumnoService.obtenerOFallar(request.getAlumnoId());
        Seccion seccion = seccionService.obtenerOFallar(request.getSeccionId());
        validarAccesoDocenteASeccion(seccion.getId());
        AsistenciaAlumno asistencia = AsistenciaAlumno.builder()
                .fecha(request.getFecha())
                .estado(request.getEstado())
                .alumno(alumno)
                .seccion(seccion).build();
        AsistenciaAlumno guardado = asistenciaAlumnoRepository.save(asistencia);
        return AsistenciaAlumnoResponseDto.builder()
                .id(guardado.getId()).fecha(guardado.getFecha()).estado(guardado.getEstado())
                .alumnoId(alumno.getId()).alumnoNombre(alumno.getNombre()).alumnoApellido(alumno.getApellido())
                .seccionId(seccion.getId()).seccionNombre(seccion.getNombre()).build();
    }

    @Transactional
    public List<AsistenciaAlumnoResponseDto> listarAsistenciaAlumno(Long seccionId, LocalDate fecha) {
        validarAccesoDocenteASeccion(seccionId);
        return asistenciaAlumnoRepository.findBySeccionIdAndFecha(seccionId, fecha).stream()
                .map(a -> AsistenciaAlumnoResponseDto.builder()
                        .id(a.getId())
                        .fecha(a.getFecha())
                        .estado(a.getEstado())
                        .alumnoId(a.getAlumno().getId())
                        .alumnoNombre(a.getAlumno().getNombre())
                        .alumnoApellido(a.getAlumno().getApellido())
                        .seccionId(a.getSeccion().getId())
                        .seccionNombre(a.getSeccion().getNombre())
                        .build())
                .collect(Collectors.toList());
    }


    @Transactional
    public AsistenciaDocenteResponseDto registrarAsistenciaDocente(AsistenciaDocenteRequestDto request) {

        Usuario docente = usuarioRepository.findById(request.getDocenteId())
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
                
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            Usuario currentUser = usuarioRepository.findByEmail(auth.getName()).orElse(null);
            if (currentUser != null && currentUser.getRol() == RolNombre.DOCENTE && !currentUser.getId().equals(docente.getId())) {
                throw ApiException.forbidden("No puede registrar asistencia para otro docente");
            }
        }

        AsistenciaDocente asistencia = new AsistenciaDocente();
        asistencia.setFecha(request.getFecha());
        asistencia.setEstado(request.getEstado());
        asistencia.setDocente(docente);

        AsistenciaDocente guardado = asistenciaDocenteRepository.save(asistencia);

        return AsistenciaDocenteResponseDto.builder()
                .id(guardado.getId())
                .fecha(guardado.getFecha())
                .estado(guardado.getEstado())
                .docenteId(docente.getId())
                .docenteNombre(docente.getNombre())
                .docenteApellido(docente.getApellido())
                .build();
    }



    @Transactional
    public List<AsistenciaDocenteResponseDto> listarAsistenciaDocente(LocalDate fecha) {

        List<AsistenciaDocente> asistencias = asistenciaDocenteRepository.findByFecha(fecha);
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            Usuario currentUser = usuarioRepository.findByEmail(auth.getName()).orElse(null);
            if (currentUser != null && currentUser.getRol() == RolNombre.DOCENTE) {
                asistencias = asistencias.stream()
                        .filter(a -> a.getDocente().getId().equals(currentUser.getId()))
                        .collect(Collectors.toList());
            }
        }

        return asistencias.stream()
                .map(a -> AsistenciaDocenteResponseDto.builder()
                        .id(a.getId())
                        .fecha(a.getFecha())
                        .estado(a.getEstado())
                        .docenteId(a.getDocente().getId())
                        .docenteNombre(a.getDocente().getNombre())
                        .docenteApellido(a.getDocente().getApellido())
                        .build())
                .collect(Collectors.toList());
    }




}
