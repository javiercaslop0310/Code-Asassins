package com.codeAssasins.gestor_tareas.controller;

import com.codeAssasins.gestor_tareas.model.Proyecto;
import com.codeAssasins.gestor_tareas.repository.ProyectoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")
public class ProyectoController {

    private final ProyectoRepository repository;

    public ProyectoController(ProyectoRepository repository) {
        this.repository = repository;
    }

    // Listar todos los proyectos
    @GetMapping
    public List<Proyecto> listarTodos() {
        return repository.findAll();
    }

    // Ver detalle de un proyecto
    @GetMapping("/{id}")
    public Proyecto obtenerPorId(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // Crear un nuevo proyecto
    @PostMapping
    public Proyecto crear(@RequestBody Proyecto proyecto) {
        return repository.save(proyecto);
    }
}