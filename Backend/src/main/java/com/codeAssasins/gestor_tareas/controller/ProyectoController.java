package com.codeAssasins.gestor_tareas.controller;

import com.codeAssasins.gestor_tareas.model.Proyecto;
import com.codeAssasins.gestor_tareas.service.ProyectoService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")
public class ProyectoController {

    private final ProyectoService service;

    public ProyectoController(ProyectoService service) {
        this.service = service;
    }

    // AÑADIMOS PARÁMETROS DE PAGINACIÓN AL GET
    @GetMapping
    public Page<Proyecto> listarOFiltrar(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        return service.buscarYFiltrar(nombre, estado, page, size);
    }

    @GetMapping("/{id}")
    public Proyecto obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PostMapping
    public Proyecto crear(@Valid @RequestBody Proyecto proyecto) {
        return service.crearProyecto(proyecto);
    }

    @PutMapping("/{id}")
    public Proyecto actualizar(@PathVariable Long id, @Valid @RequestBody Proyecto proyecto) {
        return service.actualizarProyecto(id, proyecto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminarProyecto(id);
    }
}