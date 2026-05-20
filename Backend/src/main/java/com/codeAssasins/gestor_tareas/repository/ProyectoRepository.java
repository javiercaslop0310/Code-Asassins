package com.codeAssasins.gestor_tareas.repository;

import com.codeAssasins.gestor_tareas.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    // Filtros personalizados automáticos de Spring Data JPA
    List<Proyecto> findByNombreContainingIgnoreCase(String nombre);
    List<Proyecto> findByEstado(String estado);
    List<Proyecto> findByNombreContainingIgnoreCaseAndEstado(String nombre, String estado);
}