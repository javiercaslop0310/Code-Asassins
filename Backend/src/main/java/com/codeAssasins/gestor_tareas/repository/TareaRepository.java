package com.codeAssasins.gestor_tareas.repository;

import com.codeAssasins.gestor_tareas.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
}