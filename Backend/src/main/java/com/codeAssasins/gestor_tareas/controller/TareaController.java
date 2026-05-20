package com.codeAssasins.gestor_tareas.controller;

import com.codeAssasins.gestor_tareas.model.Tarea;
import com.codeAssasins.gestor_tareas.repository.TareaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareaController {

    private final TareaRepository repository;

    public TareaController(TareaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Tarea> listarTodas() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Tarea obtenerPorId(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public Tarea crear(@RequestBody Tarea tarea) {
        return repository.save(tarea);
    }
}