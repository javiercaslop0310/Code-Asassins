package com.codeAssasins.gestor_tareas.controller;

import com.codeAssasins.gestor_tareas.model.Proyecto;
import com.codeAssasins.gestor_tareas.service.ProyectoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")
public class ProyectoController {

    private final ProyectoService service;

    public ProyectoController(ProyectoService service) {
        this.service = service;
    }

    // Mapeo GET actualizado para soportar filtros opcionales: /api/proyectos?nombre=web&estado=ACTIVO
    @GetMapping
    public List<Proyecto> listarOFiltrar(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String estado) {
        return service.buscarYFiltrar(nombre, estado);
    }

    @GetMapping("/{id}")
    public Proyecto obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PostMapping
    public Proyecto crear(@RequestBody Proyecto proyecto) {
        return service.crearProyecto(proyecto);
    }

    @PutMapping("/{id}")
    public Proyecto actualizar(@PathVariable Long id, @RequestBody Proyecto proyecto) {
        return service.actualizarProyecto(id, proyecto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminarProyecto(id);
    }
}