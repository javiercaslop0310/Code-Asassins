package com.codeAssasins.gestor_tareas.service;

import com.codeAssasins.gestor_tareas.model.Tarea;
import com.codeAssasins.gestor_tareas.repository.TareaRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class TareaService {

    private final TareaRepository repository;

    public TareaService(TareaRepository repository) {
        this.repository = repository;
    }

    public Tarea crearTarea(Tarea tarea) {
        tarea.setCreadoEn(LocalDateTime.now());
        tarea.setActualizadoEn(LocalDateTime.now());
        if (tarea.getEstado() == null) {
            tarea.setEstado("PENDIENTE");
        }
        return repository.save(tarea);
    }


    public Tarea actualizarTarea(Long id, Tarea detalles) {
        Tarea tarea = repository.findById(id).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        tarea.setTitulo(detalles.getTitulo());
        tarea.setDescripcion(detalles.getDescripcion());
        tarea.setEstado(detalles.getEstado());
        tarea.setPrioridad(detalles.getPrioridad());
        tarea.setFechaLimite(detalles.getFechaLimite());
        tarea.setActualizadoEn(LocalDateTime.now());
        
        //Si pasa a completada, guardamos la fecha exacta del fin
        if ("COMPLETADA".equalsIgnoreCase(detalles.getEstado())) {
            tarea.setCompletadaEn(LocalDateTime.now());
        } else {
            tarea.setCompletadaEn(null);
        }
        
        return repository.save(tarea);
    }

    //Borrado
    public void eliminarTarea(Long id) {
        Tarea tarea = repository.findById(id).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        repository.delete(tarea);
    }
}