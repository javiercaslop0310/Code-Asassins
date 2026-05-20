import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tarea } from '../models/interfaces';
import { TareaService } from '../services/tarea';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent {
  // Callbacks inyectados desde el padre
  onClose: () => void = () => {};
  onTaskCreated: (task: Tarea) => void = () => {};
  tareaService!: TareaService;

  protected readonly isSaving = signal(false);
  protected readonly saveError = signal('');

  protected readonly newTask = signal<Partial<Tarea>>({
    titulo: '',
    descripcion: '',
    estado: 'PENDIENTE',
    prioridad: 'MEDIA',
    fechaLimite: '',
  });

  protected updateField(field: keyof Tarea, value: string): void {
    this.newTask.update((t) => ({ ...t, [field]: value }));
  }

  protected close(): void {
    if (this.isSaving()) return;
    this.onClose();
  }

  protected submit(): void {
    const task = this.newTask();
    if (!task.titulo?.trim()) {
      this.saveError.set('El título es obligatorio.');
      return;
    }
    this.isSaving.set(true);
    this.saveError.set('');

    const payload: Tarea = {
      titulo: task.titulo!.trim(),
      descripcion: task.descripcion?.trim() || undefined,
      estado: task.estado || 'PENDIENTE',
      prioridad: task.prioridad || 'MEDIA',
      fechaLimite: task.fechaLimite || undefined,
    };

    this.tareaService.crearTarea(payload).subscribe({
      next: (created) => {
        this.isSaving.set(false);
        this.onTaskCreated(created);
      },
      error: (err) => {
        console.error('Error al crear tarea:', err);
        this.saveError.set('No se pudo guardar. ¿Está el servidor activo?');
        this.isSaving.set(false);
      },
    });
  }
}
