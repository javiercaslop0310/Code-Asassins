package com.codeAssasins.gestor_tareas.controller;

import com.codeAssasins.gestor_tareas.model.Tarea;
import com.codeAssasins.gestor_tareas.repository.TareaRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareaController {

    private final TareaRepository repository;

    public TareaController(TareaRepository repository) {
        this.repository = repository;
    }

    // Crear una nueva tarea asignada a un proyecto
    @PostMapping
    public Tarea crear(@RequestBody Tarea tarea) {
        return repository.save(tarea);
    }
}