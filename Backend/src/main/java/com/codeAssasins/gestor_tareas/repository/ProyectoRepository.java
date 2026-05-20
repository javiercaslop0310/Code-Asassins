package com.codeAssasins.gestor_tareas.repository;

import com.codeAssasins.gestor_tareas.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
}