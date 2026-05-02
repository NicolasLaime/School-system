package backend_escuela.seccion.service;


import backend_escuela.grado.entity.Grado;
import backend_escuela.grado.service.GradoService;
import backend_escuela.seccion.dto.SeccionRequestDto;
import backend_escuela.seccion.dto.SeccionResponseDto;
import backend_escuela.seccion.entity.Seccion;
import backend_escuela.seccion.repository.SeccionRepository;
import backend_escuela.shared.exception.ApiException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeccionService {


    private final SeccionRepository seccionRepository;

    private final GradoService gradoService;


    // ─── Crear ───────────────────────────────────────────────────────────
    @Transactional
    public SeccionResponseDto crear(SeccionRequestDto request) {

        Grado grado = gradoService.obtenerOFallar(request.getGradoId());

        // No puede haber dos secciones "A" en el mismo grado y ciclo lectivo
        if (seccionRepository.existsByNombreAndGradoIdAndCicloLectivo(
                request.getNombre(), request.getGradoId(), request.getCicloLectivo())) {
            throw ApiException.conflict(
                    "Ya existe la sección '" + request.getNombre() +
                            "' en ese grado para el ciclo " + request.getCicloLectivo()
            );
        }

        Seccion seccion = Seccion.builder()
                .nombre(request.getNombre())
                .grado(grado)
                .cicloLectivo(request.getCicloLectivo())
                .build();

        return toResponse(seccionRepository.save(seccion));
    }

    // ─── Listar todos ────────────────────────────────────────────────────
    @Transactional
    public List<SeccionResponseDto> listarTodos() {
        return seccionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Listar por grado ─────────────────────────────────────────────────
    @Transactional
    public List<SeccionResponseDto> listarPorGrado(Long gradoId) {
        gradoService.obtenerOFallar(gradoId);
        return seccionRepository.findByGradoId(gradoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Listar por ciclo lectivo ─────────────────────────────────────────
    @Transactional
    public List<SeccionResponseDto> listarPorCicloLectivo(String cicloLectivo) {
        return seccionRepository.findByCicloLectivo(cicloLectivo)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Buscar por ID ───────────────────────────────────────────────────
    @Transactional
    public SeccionResponseDto buscarPorId(Long id) {
        return toResponse(obtenerOFallar(id));
    }

    // ─── Actualizar ──────────────────────────────────────────────────────
    @Transactional
    public SeccionResponseDto actualizar(Long id, SeccionRequestDto request) {

        Seccion seccion = obtenerOFallar(id);
        Grado   grado   = gradoService.obtenerOFallar(request.getGradoId());

        boolean cambio = !seccion.getNombre().equals(request.getNombre())
                || !seccion.getGrado().getId().equals(request.getGradoId())
                || !seccion.getCicloLectivo().equals(request.getCicloLectivo());

        if (cambio && seccionRepository.existsByNombreAndGradoIdAndCicloLectivo(
                request.getNombre(), request.getGradoId(), request.getCicloLectivo())) {
            throw ApiException.conflict(
                    "Ya existe la sección '" + request.getNombre() +
                            "' en ese grado para el ciclo " + request.getCicloLectivo()
            );
        }

        seccion.setNombre(request.getNombre());
        seccion.setGrado(grado);
        seccion.setCicloLectivo(request.getCicloLectivo());

        return toResponse(seccionRepository.save(seccion));
    }

    // ─── Eliminar ────────────────────────────────────────────────────────
    @Transactional
    public void eliminar(Long id) {
        seccionRepository.delete(obtenerOFallar(id));
    }

    // ─── Helpers ─────────────────────────────────────────────────────────

    public Seccion obtenerOFallar(Long id) {
        return seccionRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Sección con id " + id + " no encontrada"
                ));
    }

    private SeccionResponseDto toResponse(Seccion s) {
        return SeccionResponseDto.builder()
                .id(s.getId())
                .nombre(s.getNombre())
                .cicloLectivo(s.getCicloLectivo())
                .gradoId(s.getGrado().getId())
                .gradoNombre(s.getGrado().getNombre())
                .cicloEducativoId(s.getGrado().getCicloEducativo().getId())
                .cicloEducativoNombre(s.getGrado().getCicloEducativo().getNombre())
                .build();
    }














}
