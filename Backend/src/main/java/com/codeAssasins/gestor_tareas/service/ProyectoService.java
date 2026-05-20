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

    public List<Proyecto> listarTodos() {
        return repository.findAll();
    }

    public Proyecto obtenerPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    public Proyecto crearProyecto(Proyecto proyecto) {

        proyecto.setCreadoEn(LocalDateTime.now());
        proyecto.setActualizadoEn(LocalDateTime.now());
        
        // Si el estado viene vacío, le ponemos activo por defecto
        if (proyecto.getEstado() == null || proyecto.getEstado().isEmpty()) {
            proyecto.setEstado("ACTIVO");
        }
        
        return repository.save(proyecto);
    }
}