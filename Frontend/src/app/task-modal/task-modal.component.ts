import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Proyecto, Tarea } from '../models/interfaces';
import { TareaService } from '../services/tarea';
import { ProyectoService } from '../services/proyecto';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent implements OnInit {
  // Callbacks inyectados desde el padre
  onClose: () => void = () => {};
  onTaskCreated: (task: Tarea) => void = () => {};
  tareaService!: TareaService;
  proyectoService!: ProyectoService;
  proyectosDisponibles: Proyecto[] = [];

  protected readonly isSaving = signal(false);
  protected readonly saveError = signal('');
  protected readonly loadingProyectos = signal(true);

  protected titulo = '';
  protected descripcion = '';
  protected estado = 'PENDIENTE';
  protected prioridad = 'MEDIA';
  protected fechaLimite = '';
  protected proyectoId = '';

  ngOnInit(): void {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectosDisponibles = Array.isArray(data) ? data : [];
        if (this.proyectosDisponibles.length > 0) {
          this.proyectoId = String(this.proyectosDisponibles[0].id ?? '');
        }
        this.loadingProyectos.set(false);
      },
      error: () => {
        this.proyectosDisponibles = [];
        this.loadingProyectos.set(false);
      }
    });
  }

  protected close(): void {
    if (this.isSaving()) return;
    this.onClose();
  }

  protected submit(): void {
    if (!this.titulo.trim()) {
      this.saveError.set('El título es obligatorio.');
      return;
    }
    if (!this.proyectoId) {
      this.saveError.set('Debes seleccionar un proyecto.');
      return;
    }

    this.isSaving.set(true);
    this.saveError.set('');

    // El backend espera proyectoId en el body como Map<String,Object>
    const payload: any = {
      titulo: this.titulo.trim(),
      descripcion: this.descripcion.trim() || '',
      estado: this.estado,
      prioridad: this.prioridad,
      proyectoId: Number(this.proyectoId),
      ...(this.fechaLimite ? { fechaLimite: this.fechaLimite } : {}),
    };

    this.tareaService.crearTarea(payload).subscribe({
      next: (created) => {
        this.isSaving.set(false);
        this.onTaskCreated(created);
      },
      error: (err) => {
        console.error('Error al crear tarea:', err);
        this.saveError.set(
          err?.status === 404
            ? 'Ruta no encontrada. ¿Está el servidor arrancado?'
            : `Error ${err?.status ?? ''}: No se pudo guardar la tarea.`
        );
        this.isSaving.set(false);
      },
    });
  }
}
