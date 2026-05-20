package com.codeAssasins.gestor_tareas.service;

import com.codeAssasins.gestor_tareas.model.Proyecto;
import com.codeAssasins.gestor_tareas.repository.ProyectoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProyectoService {

    private final ProyectoRepository repository;

    public ProyectoService(ProyectoRepository repository) {
        this.repository = repository;
    }

    // Devuelve una página
    public Page<Proyecto> buscarYFiltrar(String nombre, String estado, int page, int size) {
        // Creamos la petición de página (Spring empieza a contar desde la página 0)
        Pageable pageable = PageRequest.of(page, size);

        if (nombre != null && !nombre.isEmpty() && estado != null && !estado.isEmpty()) {
            return repository.findByNombreContainingIgnoreCaseAndEstado(nombre, estado, pageable);
        } else if (nombre != null && !nombre.isEmpty()) {
            return repository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else if (estado != null && !estado.isEmpty()) {
            return repository.findByEstado(estado, pageable);
        }
        return repository.findAll(pageable);
    }

    public Proyecto obtenerPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    public Proyecto crearProyecto(Proyecto proyecto) {
        proyecto.setCreadoEn(LocalDateTime.now());
        proyecto.setActualizadoEn(LocalDateTime.now());
        if (proyecto.getEstado() == null || proyecto.getEstado().isEmpty()) {
            proyecto.setEstado("ACTIVO");
        }
        return repository.save(proyecto);
    }

    public Proyecto actualizarProyecto(Long id, Proyecto detalles) {
        Proyecto proyecto = obtenerPorId(id);
        proyecto.setNombre(detalles.getNombre());
        proyecto.setDescripcion(detalles.getDescripcion());
        proyecto.setEstado(detalles.getEstado());
        proyecto.setFechaFin(detalles.getFechaFin());
        proyecto.setActualizadoEn(LocalDateTime.now());
        return repository.save(proyecto);
    }

    public void eliminarProyecto(Long id) {
        Proyecto proyecto = obtenerPorId(id);
        repository.delete(proyecto);
    }
}