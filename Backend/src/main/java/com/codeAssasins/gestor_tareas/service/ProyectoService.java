package com.codeAssasins.gestor_tareas.service;

import com.codeAssasins.gestor_tareas.model.Proyecto;
import com.codeAssasins.gestor_tareas.repository.ProyectoRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProyectoService {

    private final ProyectoRepository repository;

    public ProyectoService(ProyectoRepository repository) {
        this.repository = repository;
    }

    // LISTAR O FILTRAR: Si vienen parámetros busca por ellos, si no, devuelve todo
    public List<Proyecto> buscarYFiltrar(String nombre, String estado) {
        if (nombre != null && !nombre.isEmpty() && estado != null && !estado.isEmpty()) {
            return repository.findByNombreContainingIgnoreCaseAndEstado(nombre, estado);
        } else if (nombre != null && !nombre.isEmpty()) {
            return repository.findByNombreContainingIgnoreCase(nombre);
        } else if (estado != null && !estado.isEmpty()) {
            return repository.findByEstado(estado);
        }
        return repository.findAll();
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

    // EDICIÓN (PUT)
    public Proyecto actualizarProyecto(Long id, Proyecto detalles) {
        Proyecto proyecto = obtenerPorId(id);
        proyecto.setNombre(detalles.getNombre());
        proyecto.setDescripcion(detalles.getDescripcion());
        proyecto.setEstado(detalles.getEstado());
        proyecto.setFechaFin(detalles.getFechaFin());
        proyecto.setActualizadoEn(LocalDateTime.now());
        return repository.save(proyecto);
    }

    // BORRADO (DELETE)
    public void eliminarProyecto(Long id) {
        Proyecto proyecto = obtenerPorId(id);
        repository.delete(proyecto);
    }
}