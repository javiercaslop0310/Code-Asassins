package com.codeAssasins.gestor_tareas.repository;

import com.codeAssasins.gestor_tareas.model.Proyecto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    // Cambiamos List por Page y añadimos Pageable al final de cada método
    Page<Proyecto> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    Page<Proyecto> findByEstado(String estado, Pageable pageable);
    Page<Proyecto> findByNombreContainingIgnoreCaseAndEstado(String nombre, String estado, Pageable pageable);
}