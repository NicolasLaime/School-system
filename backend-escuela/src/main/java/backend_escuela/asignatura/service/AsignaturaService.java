package backend_escuela.asignatura.service;


import backend_escuela.asignatura.dto.AsignaturaRequestDto;
import backend_escuela.asignatura.dto.AsignaturaResponseDto;
import backend_escuela.asignatura.dto.DocenteAsignaturaRequestDto;
import backend_escuela.asignatura.dto.DocenteAsignaturaResponseDto;
import backend_escuela.asignatura.entity.Asignatura;
import backend_escuela.asignatura.entity.DocenteAsignaturaSeccion;
import backend_escuela.asignatura.repository.AsignaturaRepository;
import backend_escuela.asignatura.repository.DocenteAsignaturaRepository;
import backend_escuela.grado.entity.Grado;
import backend_escuela.grado.service.GradoService;
import backend_escuela.seccion.entity.Seccion;
import backend_escuela.seccion.service.SeccionService;
import backend_escuela.shared.exception.ApiException;
import backend_escuela.usuario.entity.RolNombre;
import backend_escuela.usuario.entity.Usuario;
import backend_escuela.usuario.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsignaturaService {


    private final AsignaturaRepository asignaturaRepository;
    private final DocenteAsignaturaRepository dasRepository;
    private final GradoService gradoService;
    private final SeccionService seccionService;
    private final UsuarioRepository usuarioRepository;

    // ─── Crear asignatura ─────────────────────────────────────────────────
    @Transactional
    public AsignaturaResponseDto crear(AsignaturaRequestDto request) {

        if (asignaturaRepository.existsByCodigo(request.getCodigo())) {
            throw ApiException.conflict(
                    "Ya existe una asignatura con el código: " + request.getCodigo()
            );
        }

        Grado grado = gradoService.obtenerOFallar(request.getGradoId());

        Asignatura asignatura = Asignatura.builder()
                .nombre(request.getNombre())
                .codigo(request.getCodigo())
                .grado(grado)
                .build();

        return toResponse(asignaturaRepository.save(asignatura));
    }

    // ─── Listar todas ─────────────────────────────────────────────────────
    @Transactional
    public List<AsignaturaResponseDto> listarTodas() {
        return asignaturaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Listar por grado ─────────────────────────────────────────────────
    @Transactional
    public List<AsignaturaResponseDto> listarPorGrado(Long gradoId) {
        gradoService.obtenerOFallar(gradoId);
        return asignaturaRepository.findByGradoId(gradoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Buscar por ID ────────────────────────────────────────────────────
    @Transactional
    public AsignaturaResponseDto buscarPorId(Long id) {
        return toResponse(obtenerOFallar(id));
    }

    // ─── Actualizar ───────────────────────────────────────────────────────
    @Transactional
    public AsignaturaResponseDto actualizar(Long id, AsignaturaRequestDto request) {

        Asignatura asignatura = obtenerOFallar(id);
        Grado      grado      = gradoService.obtenerOFallar(request.getGradoId());

        if (!asignatura.getCodigo().equals(request.getCodigo())
                && asignaturaRepository.existsByCodigo(request.getCodigo())) {
            throw ApiException.conflict(
                    "Ya existe una asignatura con el código: " + request.getCodigo()
            );
        }

        asignatura.setNombre(request.getNombre());
        asignatura.setCodigo(request.getCodigo());
        asignatura.setGrado(grado);

        return toResponse(asignaturaRepository.save(asignatura));
    }

    //Eliminar
    @Transactional
    public void eliminar(Long id) {
        asignaturaRepository.delete(obtenerOFallar(id));
    }

    // ─── Asignar docente a asignatura + sección ───────────────────────────
    @Transactional
    public DocenteAsignaturaResponseDto asignarDocente(DocenteAsignaturaRequestDto request) {

        // Verificar que el usuario existe y es docente
        Usuario docente = usuarioRepository.findById(request.getDocenteId())
                .orElseThrow(() -> ApiException.notFound(
                        "Docente con id " + request.getDocenteId() + " no encontrado"
                ));

        if (docente.getRol() != RolNombre.DOCENTE) {
            throw ApiException.badRequest(
                    "El usuario con id " + request.getDocenteId() + " no tiene rol DOCENTE"
            );
        }

        Asignatura asignatura = obtenerOFallar(request.getAsignaturaId());
        Seccion seccion    = seccionService.obtenerOFallar(request.getSeccionId());

        // Verificar que no exista ya la asignación
        if (dasRepository.existsByDocenteIdAndAsignaturaIdAndSeccionId(
                request.getDocenteId(), request.getAsignaturaId(), request.getSeccionId())) {
            throw ApiException.conflict(
                    "El docente ya tiene asignada esa asignatura en esa sección"
            );
        }

        DocenteAsignaturaSeccion das = DocenteAsignaturaSeccion.builder()
                .docente(docente)
                .asignatura(asignatura)
                .seccion(seccion)
                .build();

        return toDasResponse(dasRepository.save(das));
    }

    // ─── Listar asignaciones de un docente ────────────────────────────────
    @Transactional
    public List<DocenteAsignaturaResponseDto> listarAsignacionesPorDocente(Long docenteId) {
        return dasRepository.findAsignacionesConDetalleByDocente(docenteId)
                .stream()
                .map(this::toDasResponse)
                .collect(Collectors.toList());
    }

    // ─── Eliminar asignación docente ──────────────────────────────────────
    @Transactional
    public void eliminarAsignacion(DocenteAsignaturaRequestDto request) {
        if (!dasRepository.existsByDocenteIdAndAsignaturaIdAndSeccionId(
                request.getDocenteId(), request.getAsignaturaId(), request.getSeccionId())) {
            throw ApiException.notFound("La asignación no existe");
        }
        dasRepository.deleteByDocenteIdAndAsignaturaIdAndSeccionId(
                request.getDocenteId(), request.getAsignaturaId(), request.getSeccionId()
        );
    }



    @Transactional
    public AsignaturaResponseDto buscarPorCodigo(String codigo) {
        Asignatura asignatura = asignaturaRepository.findByCodigo(codigo)
                .orElseThrow(() -> ApiException.notFound("Asignatura con código " + codigo + " no encontrada"));
        return toResponse(asignatura);
    }


    @Transactional
    public List<AsignaturaResponseDto> listarConDocenteAsociado() {
        return asignaturaRepository.findConDocenteAsociado()
                .stream()
                .map(a -> {
                    List<DocenteAsignaturaSeccion> dasList = dasRepository.findByAsignaturaId(a.getId());
                    Long   docenteId = null;
                    String docenteNombre = "";
                    String docenteApellido = "";
                    if (!dasList.isEmpty()) {
                        docenteId = dasList.get(0).getDocente().getId();
                        docenteNombre = dasList.get(0).getDocente().getNombre();
                        docenteApellido = dasList.get(0).getDocente().getApellido();
                    }
                    return AsignaturaResponseDto.builder()
                            .id(a.getId())
                            .nombre(a.getNombre())
                            .codigo(a.getCodigo())
                            .gradoId(a.getGrado().getId())
                            .gradoNombre(a.getGrado().getNombre())
                            .cicloEducativoId(a.getGrado().getCicloEducativo().getId())
                            .cicloEducativoNombre(a.getGrado().getCicloEducativo().getNombre())
                            .docenteId(docenteId)
                            .docenteNombre(docenteNombre)
                            .docenteApellido(docenteApellido)
                            .build();
                })
                .collect(Collectors.toList());
    }




    // ─── Helpers ──────────────────────────────────────────────────────────

    public Asignatura obtenerOFallar(Long id) {
        return asignaturaRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Asignatura con id " + id + " no encontrada"
                ));
    }

    private AsignaturaResponseDto toResponse(Asignatura a) {
        return AsignaturaResponseDto.builder()
                .id(a.getId())
                .nombre(a.getNombre())
                .codigo(a.getCodigo())
                .gradoId(a.getGrado().getId())
                .gradoNombre(a.getGrado().getNombre())
                .cicloEducativoId(a.getGrado().getCicloEducativo().getId())
                .cicloEducativoNombre(a.getGrado().getCicloEducativo().getNombre())
                .build();
    }

    private DocenteAsignaturaResponseDto toDasResponse(DocenteAsignaturaSeccion das) {
        return DocenteAsignaturaResponseDto.builder()
                .id(das.getId())
                .docenteId(das.getDocente().getId())
                .docenteNombre(das.getDocente().getNombre())
                .docenteApellido(das.getDocente().getApellido())
                .asignaturaId(das.getAsignatura().getId())
                .asignaturaNombre(das.getAsignatura().getNombre())
                .seccionId(das.getSeccion().getId())
                .seccionNombre(das.getSeccion().getNombre())
                .gradoNombre(das.getSeccion().getGrado().getNombre())
                .build();
    }

    private AsignaturaResponseDto toResponseConDocentes(
            Asignatura a, List<DocenteAsignaturaResponseDto> docentes) {
        return AsignaturaResponseDto.builder()
                .id(a.getId())
                .nombre(a.getNombre())
                .codigo(a.getCodigo())
                .gradoId(a.getGrado().getId())
                .gradoNombre(a.getGrado().getNombre())
                .cicloEducativoId(a.getGrado().getCicloEducativo().getId())
                .cicloEducativoNombre(a.getGrado().getCicloEducativo().getNombre())
                .docentes(docentes)
                .build();
    }












}
