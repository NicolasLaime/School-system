package backend_escuela.reporte.service;


import backend_escuela.alumno.dto.AlumnoResponseDto;
import backend_escuela.alumno.service.AlumnoService;
import backend_escuela.notas.dto.ResumenAlumnoDto;
import backend_escuela.notas.service.NotaService;
import backend_escuela.shared.exception.ApiException;
import backend_escuela.usuario.entity.Usuario;
import backend_escuela.usuario.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReporteService {


    private final NotaService notaService;
    private final AlumnoService alumnoService;
    private final UsuarioRepository usuarioRepository;
    private final BoletaBuilder    boletaBuilder;

    // Nombre del colegio configurable desde application.yml
    @Value("${colegio.nombre:Institución Educativa}")
    private String nombreColegio;

    // ─── Generar boleta PDF ───────────────────────────────────────────────
    @Transactional
    public byte[] generarBoleta(Long alumnoId, String cicloLectivo, Long usuarioId) {

        // 1. Verificar que el alumno existe
        alumnoService.obtenerOFallar(alumnoId);

        // 2. Verificar que el usuario que genera existe
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ApiException.notFound(
                        "Usuario con id " + usuarioId + " no encontrado"
                ));

        // 3. Obtener el resumen ponderado del alumno
        ResumenAlumnoDto resumen = notaService.obtenerResumen(alumnoId, cicloLectivo);

        // Validar que el alumno tiene notas cargadas
        if (resumen.getAsignaturas().isEmpty()) {
            throw ApiException.badRequest(
                    "El alumno no tiene notas cargadas para el ciclo " + cicloLectivo
            );
        }

        // 4. Generar el PDF
        log.info("Generando boleta para alumno {} ciclo {} por usuario {}",
                alumnoId, cicloLectivo, usuarioId);

        byte[] pdf = boletaBuilder.generar(resumen, nombreColegio);

        log.info("Boleta generada exitosamente. Tamaño: {} bytes", pdf.length);

        return pdf;
    }

    // ─── Generar boletas de toda una sección ─────────────────────────────
    // Devuelve un mapa alumnoId → bytes del PDF
    @Transactional
    public java.util.Map<Long, byte[]> generarBoletasSeccion(
            Long seccionId, String cicloLectivo, Long usuarioId) {

        // Obtener todos los alumnos de la sección
        java.util.List<AlumnoResponseDto> alumnos =
                alumnoService.listarPorSeccion(seccionId);

        if (alumnos.isEmpty()) {
            throw ApiException.badRequest(
                    "La sección no tiene alumnos registrados"
            );
        }

        java.util.Map<Long, byte[]> boletas = new java.util.LinkedHashMap<>();

        for (var alumno : alumnos) {
            try {
                byte[] pdf = generarBoleta(alumno.getId(), cicloLectivo, usuarioId);
                boletas.put(alumno.getId(), pdf);
            } catch (Exception e) {
                // Si un alumno no tiene notas, lo saltamos y seguimos
                log.warn("No se pudo generar boleta para alumno {}: {}",
                        alumno.getId(), e.getMessage());
            }
        }

        return boletas;
    }


























}
