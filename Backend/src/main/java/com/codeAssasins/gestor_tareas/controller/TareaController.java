package com.codeAssasins.gestor_tareas.controller;

import com.codeAssasins.gestor_tareas.model.Proyecto;
import com.codeAssasins.gestor_tareas.model.Tarea;
import com.codeAssasins.gestor_tareas.repository.ProyectoRepository;
import com.codeAssasins.gestor_tareas.repository.TareaRepository;
import com.codeAssasins.gestor_tareas.service.TareaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tareas") // Esta es la ruta base exacta
@CrossOrigin(origins = "*")
public class TareaController {

    private final TareaRepository repository;
    private final ProyectoRepository proyectoRepository;
    private final TareaService tareaService;

    public TareaController(TareaRepository repository, ProyectoRepository proyectoRepository, TareaService tareaService) {
        this.repository = repository;
        this.proyectoRepository = proyectoRepository;
        this.tareaService = tareaService;
    }

    @GetMapping
    public List<Tarea> listarTodas() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> obtenerPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> body) {
        try {
            // Conversión segura de ID
            Long proyectoId = Long.valueOf(body.get("proyectoId").toString());
            Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
            
            Tarea tarea = new Tarea();
            tarea.setTitulo(body.get("titulo").toString());
            tarea.setDescripcion(body.getOrDefault("descripcion", "").toString());
            tarea.setEstado(body.getOrDefault("estado", "PENDIENTE").toString());
            tarea.setPrioridad(body.getOrDefault("prioridad", "MEDIA").toString());
            tarea.setProyecto(proyecto);
            
            return ResponseEntity.ok(tareaService.crearTarea(tarea));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al crear tarea: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Tarea detalles) {
        return ResponseEntity.ok(tareaService.actualizarTarea(id, detalles));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        tareaService.eliminarTarea(id);
        return ResponseEntity.ok(Map.of("mensaje", "Tarea eliminada"));
    }
}