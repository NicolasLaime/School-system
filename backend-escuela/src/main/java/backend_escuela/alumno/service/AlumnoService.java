package backend_escuela.alumno.service;

import backend_escuela.alumno.dto.AlumnoRequestDto;
import backend_escuela.alumno.dto.AlumnoResponseDto;
import backend_escuela.alumno.entity.Alumno;
import backend_escuela.alumno.repository.AlumnoRepository;
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
public class AlumnoService {

    private final AlumnoRepository alumnoRepository;
    private final SeccionService seccionService;

    // ─── Crear ───────────────────────────────────────────────────────────
    @Transactional
    public AlumnoResponseDto crear(AlumnoRequestDto request) {

        if (alumnoRepository.existsByCodigo(request.getCodigo())) {
            throw ApiException.conflict(
                    "Ya existe un alumno con el código: " + request.getCodigo()
            );
        }

        Seccion seccion = seccionService.obtenerOFallar(request.getSeccionId());

        Alumno alumno = Alumno.builder()
                .codigo(request.getCodigo())
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .documento(request.getDocumento())
                .seccion(seccion)
                .activo(true)
                .build();

        return toResponse(alumnoRepository.save(alumno));
    }

    // ─── Listar todos ────────────────────────────────────────────────────
    @Transactional
    public List<AlumnoResponseDto> listarTodos() {
        return alumnoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Listar por sección ───────────────────────────────────────────────
    @Transactional
    public List<AlumnoResponseDto> listarPorSeccion(Long seccionId) {
        seccionService.obtenerOFallar(seccionId);
        return alumnoRepository.findBySeccionIdAndActivoTrue(seccionId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Listar por grado y ciclo lectivo ────────────────────────────────
    @Transactional
    public List<AlumnoResponseDto> listarPorGradoYCiclo(Long gradoId, String cicloLectivo) {
        return alumnoRepository.findByGradoIdAndCicloLectivo(gradoId, cicloLectivo)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Buscar por ID ───────────────────────────────────────────────────
    @Transactional
    public AlumnoResponseDto buscarPorId(Long id) {
        return toResponse(obtenerOFallar(id));
    }

    // ─── Buscar por código ────────────────────────────────────────────────
    @Transactional
    public AlumnoResponseDto buscarPorCodigo(String codigo) {
        Alumno alumno = alumnoRepository.findByCodigo(codigo)
                .orElseThrow(() -> ApiException.notFound(
                        "Alumno con código " + codigo + " no encontrado"
                ));
        return toResponse(alumno);
    }

    // ─── Actualizar ──────────────────────────────────────────────────────
    @Transactional
    public AlumnoResponseDto actualizar(Long id, AlumnoRequestDto request) {

        Alumno  alumno  = obtenerOFallar(id);
        Seccion seccion = seccionService.obtenerOFallar(request.getSeccionId());

        // Verificar código duplicado solo si cambió
        if (!alumno.getCodigo().equals(request.getCodigo())
                && alumnoRepository.existsByCodigo(request.getCodigo())) {
            throw ApiException.conflict(
                    "Ya existe un alumno con el código: " + request.getCodigo()
            );
        }

        alumno.setCodigo(request.getCodigo());
        alumno.setNombre(request.getNombre());
        alumno.setApellido(request.getApellido());
        alumno.setTelefono(request.getTelefono());
        alumno.setDireccion(request.getDireccion());
        alumno.setDocumento(request.getDocumento());
        alumno.setSeccion(seccion);

        return toResponse(alumnoRepository.save(alumno));
    }

    // ─── Desactivar (baja lógica) ─────────────────────────────────────────
    @Transactional
    public void desactivar(Long id) {
        Alumno alumno = obtenerOFallar(id);
        alumno.setActivo(false);
        alumnoRepository.save(alumno);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────

    public Alumno obtenerOFallar(Long id) {
        return alumnoRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Alumno con id " + id + " no encontrado"
                ));
    }

    private AlumnoResponseDto toResponse(Alumno a) {
        return AlumnoResponseDto.builder()
                .id(a.getId())
                .codigo(a.getCodigo())
                .nombre(a.getNombre())
                .apellido(a.getApellido())
                .telefono(a.getTelefono())
                .direccion(a.getDireccion())
                .documento(a.getDocumento())
                .activo(a.getActivo())
                .seccionId(a.getSeccion().getId())
                .seccionNombre(a.getSeccion().getNombre())
                .gradoId(a.getSeccion().getGrado().getId())
                .gradoNombre(a.getSeccion().getGrado().getNombre())
                .cicloEducativoId(a.getSeccion().getGrado().getCicloEducativo().getId())
                .cicloEducativoNombre(a.getSeccion().getGrado().getCicloEducativo().getNombre())
                .cicloLectivo(a.getSeccion().getCicloLectivo())
                .build();
    }











}
