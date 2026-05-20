package com.codeAssasins.gestor_tareas.controller;

import com.codeAssasins.gestor_tareas.model.Tarea;
import com.codeAssasins.gestor_tareas.service.TareaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareaController {

    private final TareaService service;

    public TareaController(TareaService service) {
        this.service = service;
    }

    @PostMapping
    public Tarea crear(@RequestBody Tarea tarea) {
        return service.crearTarea(tarea);
    }
}