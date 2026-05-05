package backend_escuela.notas.service;

import backend_escuela.alumno.entity.Alumno;
import backend_escuela.alumno.repository.AlumnoRepository;
import backend_escuela.asignatura.entity.Asignatura;
import backend_escuela.asignatura.service.AsignaturaService;
import backend_escuela.notas.dto.*;
import backend_escuela.notas.entity.Nota;
import backend_escuela.notas.repository.NotaRepository;
import backend_escuela.ponderacion.entity.Ponderacion;
import backend_escuela.ponderacion.service.PonderacionService;
import backend_escuela.seccion.entity.Seccion;
import backend_escuela.seccion.service.SeccionService;
import backend_escuela.shared.enums.Bimestre;
import backend_escuela.shared.exception.ApiException;
import backend_escuela.usuario.entity.Usuario;
import backend_escuela.usuario.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import backend_escuela.usuario.entity.RolNombre;
import backend_escuela.asignatura.repository.DocenteAsignaturaRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotaService {




    private final NotaRepository notaRepository;
    private final AlumnoRepository alumnoRepository;
    private final AsignaturaService asignaturaService;
    private final SeccionService seccionService;
    private final PonderacionService ponderacionService;
    private final UsuarioRepository usuarioRepository;
    private final NotaExcelParser excelParser;
    private final DocenteAsignaturaRepository dasRepository;

    private void validarAccesoDocente(Long asignaturaId, Long seccionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            Usuario usuario = usuarioRepository.findByEmail(auth.getName()).orElse(null);
            if (usuario != null && usuario.getRol() == RolNombre.DOCENTE) {
                if (!dasRepository.existsByDocenteIdAndAsignaturaIdAndSeccionId(usuario.getId(), asignaturaId, seccionId)) {
                    throw ApiException.forbidden("No tiene permisos sobre esta asignatura y sección");
                }
            }
        }
    }

    // ─── Crear nota manual ───────────────────────────────────────────────
    @Transactional
    public NotaResponseDto crear(NotaRequestDto request) {

        Alumno     alumno     = obtenerAlumnoOFallar(request.getAlumnoId());
        Asignatura asignatura = asignaturaService.obtenerOFallar(request.getAsignaturaId());
        Seccion seccion    = seccionService.obtenerOFallar(request.getSeccionId());
        Usuario    docente    = obtenerDocenteOFallar(request.getDocenteId());

        validarAccesoDocente(asignatura.getId(), seccion.getId());

        // Verificar que no exista ya esa nota
        notaRepository.findByAlumnoIdAndAsignaturaIdAndBimestreAndCicloLectivoAndTipoNota(
                request.getAlumnoId(), request.getAsignaturaId(),
                request.getBimestre(), request.getCicloLectivo(), request.getTipoNota()
        ).ifPresent(n -> {
            throw ApiException.conflict(
                    "Ya existe una nota de '" + request.getTipoNota() +
                            "' para ese alumno en bimestre " + request.getBimestre().getNumero()
            );
        });

        Nota nota = Nota.builder()
                .alumno(alumno)
                .asignatura(asignatura)
                .seccion(seccion)
                .bimestre(request.getBimestre())
                .cicloLectivo(request.getCicloLectivo())
                .tipoNota(request.getTipoNota())
                .valor(request.getValor())
                .docente(docente)
                .build();

        return toResponse(notaRepository.save(nota));
    }

    // ─── Actualizar nota ──────────────────────────────────────────────────
    @Transactional
    public NotaResponseDto actualizar(Long id, NotaRequestDto request) {

        Nota nota = obtenerOFallar(id);
        validarAccesoDocente(nota.getAsignatura().getId(), nota.getSeccion().getId());
        nota.setValor(request.getValor());
        nota.setTipoNota(request.getTipoNota());
        nota.setBimestre(request.getBimestre());

        return toResponse(notaRepository.save(nota));
    }

    // ─── Eliminar nota ────────────────────────────────────────────────────
    @Transactional
    public void eliminar(Long id) {
        Nota nota = obtenerOFallar(id);
        validarAccesoDocente(nota.getAsignatura().getId(), nota.getSeccion().getId());
        notaRepository.delete(nota);
    }

    // ─── Buscar por ID ────────────────────────────────────────────────────
    @Transactional
    public NotaResponseDto buscarPorId(Long id) {
        return toResponse(obtenerOFallar(id));
    }

    // ─── Notas de un alumno en una asignatura ─────────────────────────────
    @Transactional
    public List<NotaResponseDto> listarPorAlumnoYAsignatura(
            Long alumnoId, Long asignaturaId, String cicloLectivo) {

        return notaRepository
                .findByAlumnoIdAndAsignaturaIdAndCicloLectivo(
                        alumnoId, asignaturaId, cicloLectivo)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Notas de una sección en una asignatura y bimestre ────────────────
    @Transactional
    public List<NotaResponseDto> listarPorSeccionAsignaturaBimestre(
            Long seccionId, Long asignaturaId, Bimestre bimestre, String cicloLectivo) {

        return notaRepository
                .findBySeccionAsignaturaBimestre(
                        seccionId, asignaturaId, bimestre, cicloLectivo)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Carga masiva por Excel ───────────────────────────────────────────
    @Transactional
    public NotaExcelResultDto cargarDesdeExcel(
            MultipartFile archivo,
            Long seccionId,
            Long asignaturaId,
            String cicloLectivo,
            Long docenteId) {

        // 1. Parsear el archivo
        List<NotaExcelParser.FilaParseada> filas;
        try {
            filas = excelParser.parsear(archivo);
        } catch (Exception e) {
            throw ApiException.badRequest(
                    "No se pudo leer el archivo Excel: " + e.getMessage()
            );
        }

        Seccion    seccion    = seccionService.obtenerOFallar(seccionId);
        Asignatura asignatura = asignaturaService.obtenerOFallar(asignaturaId);
        Usuario    docente    = obtenerDocenteOFallar(docenteId);

        validarAccesoDocente(asignatura.getId(), seccion.getId());

        List<NotaExcelResultDto.FilaErrorDto> errores    = new ArrayList<>();
        List<Nota>                            notasAGuardar = new ArrayList<>();

        // 2. Procesar cada fila
        for (NotaExcelParser.FilaParseada fila : filas) {

            // Si el parser ya detectó un error de formato, lo registramos
            if (fila.tieneError()) {
                errores.add(NotaExcelResultDto.FilaErrorDto.builder()
                        .numeroFila(fila.numeroFila)
                        .codigoAlumno(fila.codigoAlumno)
                        .motivo(fila.error)
                        .build());
                continue;
            }

            // 3. Buscar el alumno por código
            Optional<Alumno> alumnoOpt =
                    alumnoRepository.findByCodigo(fila.codigoAlumno);

            if (alumnoOpt.isEmpty()) {
                errores.add(NotaExcelResultDto.FilaErrorDto.builder()
                        .numeroFila(fila.numeroFila)
                        .codigoAlumno(fila.codigoAlumno)
                        .motivo("Alumno no encontrado con código: " + fila.codigoAlumno)
                        .build());
                continue;
            }

            Alumno   alumno   = alumnoOpt.get();
            Bimestre bimestre = Bimestre.fromNumero(fila.bimestreNumero);

            // 4. Verificar duplicado
            boolean yaExiste = notaRepository
                    .findByAlumnoIdAndAsignaturaIdAndBimestreAndCicloLectivoAndTipoNota(
                            alumno.getId(), asignaturaId,
                            bimestre, cicloLectivo, fila.tipoNota)
                    .isPresent();

            if (yaExiste) {
                errores.add(NotaExcelResultDto.FilaErrorDto.builder()
                        .numeroFila(fila.numeroFila)
                        .codigoAlumno(fila.codigoAlumno)
                        .motivo("Ya existe nota de '" + fila.tipoNota +
                                "' para bimestre " + fila.bimestreNumero)
                        .build());
                continue;
            }

            // 5. Todo ok → agregar a la lista de guardado
            notasAGuardar.add(Nota.builder()
                    .alumno(alumno)
                    .asignatura(asignatura)
                    .seccion(seccion)
                    .bimestre(bimestre)
                    .cicloLectivo(cicloLectivo)
                    .tipoNota(fila.tipoNota)
                    .valor(fila.valor)
                    .docente(docente)
                    .build());
        }

        // 6. Guardar todas las notas válidas de una sola vez
        notaRepository.saveAll(notasAGuardar);

        log.info("Excel procesado: {} filas, {} guardadas, {} errores",
                filas.size(), notasAGuardar.size(), errores.size());

        return NotaExcelResultDto.builder()
                .totalProcesadas(filas.size())
                .guardadas(notasAGuardar.size())
                .errores(errores.size())
                .filasFallidas(errores)
                .build();
    }

    // ─── Resumen ponderado por alumno ─────────────────────────────────────
    @Transactional
    public ResumenAlumnoDto obtenerResumen(Long alumnoId, String cicloLectivo) {

        Alumno alumno = obtenerAlumnoOFallar(alumnoId);

        // Todas las notas del alumno en ese ciclo
        List<Nota> todasLasNotas = notaRepository.findResumenAlumno(alumnoId, cicloLectivo);

        // Obtener las ponderaciones del ciclo educativo del alumno
        Long cicloEducativoId = alumno.getSeccion()
                .getGrado().getCicloEducativo().getId();

        List<Ponderacion> ponderaciones =
                ponderacionService.obtenerEntidadesPorCiclo(cicloEducativoId);

        // Agrupar notas por asignatura
        Map<Long, List<Nota>> notasPorAsignatura = todasLasNotas.stream()
                .collect(Collectors.groupingBy(n -> n.getAsignatura().getId()));

        List<ResumenAlumnoDto.FilaAsignaturaDto> filas = new ArrayList<>();
        List<BigDecimal> promediosFinales = new ArrayList<>();

        for (Map.Entry<Long, List<Nota>> entry : notasPorAsignatura.entrySet()) {

            List<Nota> notasAsignatura = entry.getValue();
            String nombreAsignatura   = notasAsignatura.get(0).getAsignatura().getNombre();

            // Agrupar por bimestre y calcular promedio ponderado de cada uno
            Map<String, BigDecimal> promediosBimestre = new LinkedHashMap<>();

            for (Bimestre bimestre : Bimestre.values()) {

                List<Nota> notasBimestre = notasAsignatura.stream()
                        .filter(n -> n.getBimestre() == bimestre)
                        .collect(Collectors.toList());

                if (!notasBimestre.isEmpty()) {
                    BigDecimal promedioPonderado =
                            calcularPromedioPonderado(notasBimestre, ponderaciones);
                    promediosBimestre.put(
                            "Bimestre " + bimestre.getNumero(),
                            promedioPonderado
                    );
                }
            }

            // Promedio final de la asignatura = promedio de los bimestres
            BigDecimal promedioFinal = BigDecimal.ZERO;
            if (!promediosBimestre.isEmpty()) {
                BigDecimal suma = promediosBimestre.values().stream()
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                promedioFinal = suma.divide(
                        BigDecimal.valueOf(promediosBimestre.size()), 2, RoundingMode.HALF_UP
                );
                promediosFinales.add(promedioFinal);
            }

            filas.add(ResumenAlumnoDto.FilaAsignaturaDto.builder()
                    .asignaturaId(entry.getKey())
                    .asignaturaNombre(nombreAsignatura)
                    .promediosPorBimestre(promediosBimestre)
                    .promedioFinal(promedioFinal)
                    .build());
        }

        // Promedio general del alumno
        BigDecimal promedioGeneral = BigDecimal.ZERO;
        if (!promediosFinales.isEmpty()) {
            BigDecimal suma = promediosFinales.stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            promedioGeneral = suma.divide(
                    BigDecimal.valueOf(promediosFinales.size()), 2, RoundingMode.HALF_UP
            );
        }

        return ResumenAlumnoDto.builder()
                .alumnoId(alumno.getId())
                .alumnoCodigo(alumno.getCodigo())
                .alumnoNombre(alumno.getNombre())
                .alumnoApellido(alumno.getApellido())
                .seccionNombre(alumno.getSeccion().getNombre())
                .gradoNombre(alumno.getSeccion().getGrado().getNombre())
                .cicloLectivo(cicloLectivo)
                .asignaturas(filas)
                .promedioGeneral(promedioGeneral)
                .build();
    }

    // ─── Helpers privados ─────────────────────────────────────────────────

    /**
     * Calcula el promedio ponderado de un conjunto de notas.
     * Ej: Tareas(85) * 30% + Examen(90) * 50% + Participación(80) * 20% = 86.5
     */
    private BigDecimal calcularPromedioPonderado(
            List<Nota> notas, List<Ponderacion> ponderaciones) {

        // Mapa: nombre del tipo → porcentaje
        Map<String, BigDecimal> mapaPorc = ponderaciones.stream()
                .collect(Collectors.toMap(
                        Ponderacion::getNombre,
                        Ponderacion::getPorcentaje
                ));

        BigDecimal acumulado    = BigDecimal.ZERO;
        BigDecimal porcAplicado = BigDecimal.ZERO;

        for (Nota nota : notas) {
            BigDecimal porcentaje = mapaPorc.get(nota.getTipoNota());

            if (porcentaje != null) {
                // valor * (porcentaje / 100)
                BigDecimal aporte = nota.getValor()
                        .multiply(porcentaje)
                        .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);

                acumulado    = acumulado.add(aporte);
                porcAplicado = porcAplicado.add(porcentaje);
            }
        }

        // Si no se aplicó ningún porcentaje, devolver 0
        if (porcAplicado.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        // Normalizar en caso de que falten tipos de nota
        return acumulado
                .multiply(BigDecimal.valueOf(100))
                .divide(porcAplicado, 2, RoundingMode.HALF_UP);
    }

    private Nota obtenerOFallar(Long id) {
        return notaRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Nota con id " + id + " no encontrada"
                ));
    }

    private Alumno obtenerAlumnoOFallar(Long id) {
        return alumnoRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Alumno con id " + id + " no encontrado"
                ));
    }

    private Usuario obtenerDocenteOFallar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Docente con id " + id + " no encontrado"
                ));
    }

    private NotaResponseDto toResponse(Nota n) {
        return NotaResponseDto.builder()
                .id(n.getId())
                .valor(n.getValor())
                .tipoNota(n.getTipoNota())
                .bimestre(n.getBimestre())
                .cicloLectivo(n.getCicloLectivo())
                .fechaRegistro(n.getFechaRegistro())
                .alumnoId(n.getAlumno().getId())
                .alumnoCodigo(n.getAlumno().getCodigo())
                .alumnoNombre(n.getAlumno().getNombre())
                .alumnoApellido(n.getAlumno().getApellido())
                .asignaturaId(n.getAsignatura().getId())
                .asignaturaNombre(n.getAsignatura().getNombre())
                .seccionId(n.getSeccion().getId())
                .seccionNombre(n.getSeccion().getNombre())
                .docenteId(n.getDocente().getId())
                .docenteNombre(n.getDocente().getNombre() + " " +
                        n.getDocente().getApellido())
                .build();
    }



















}
