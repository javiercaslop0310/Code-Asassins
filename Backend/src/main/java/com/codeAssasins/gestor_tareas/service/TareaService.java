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
}