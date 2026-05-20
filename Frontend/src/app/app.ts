import { CommonModule } from '@angular/common';
import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Proyecto, Tarea } from './models/interfaces';
import { ProyectoService } from './services/proyecto';
import { TareaService } from './services/tarea';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private proyectoService = inject(ProyectoService);
  private tareaService = inject(TareaService);

  protected readonly searchTerm = signal('');
  protected readonly selectedStatus = signal<string>('Todas');

  protected readonly projects = signal<Proyecto[]>([]);
  protected readonly tasks = signal<Tarea[]>([]);

  // --- MODAL STATE ---
  protected readonly showModal = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly saveError = signal('');

  protected readonly newTask = signal<Partial<Tarea>>({
    titulo: '',
    descripcion: '',
    estado: 'PENDIENTE',
    prioridad: 'MEDIA',
    fechaLimite: '',
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Error al cargar proyectos:', err)
    });

    this.tareaService.obtenerTareas().subscribe({
      next: (data) => this.tasks.set(data),
      error: (err) => console.error('Error al cargar tareas:', err)
    });
  }

  // --- MODAL ACTIONS ---
  protected openModal(): void {
    this.newTask.set({ titulo: '', descripcion: '', estado: 'PENDIENTE', prioridad: 'MEDIA', fechaLimite: '' });
    this.saveError.set('');
    this.showModal.set(true);
  }

  protected closeModal(): void {
    if (this.isSaving()) return;
    this.showModal.set(false);
  }

  protected updateNewTask(field: keyof Tarea, value: string): void {
    this.newTask.update(t => ({ ...t, [field]: value }));
  }

  protected submitTask(): void {
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
        this.tasks.update(ts => [created, ...ts]);
        this.isSaving.set(false);
        this.showModal.set(false);
      },
      error: (err) => {
        console.error('Error al crear tarea:', err);
        this.saveError.set('No se pudo guardar la tarea. ¿El servidor está activo?');
        this.isSaving.set(false);
      }
    });
  }

  // --- FILTRADO Y ESTADÍSTICAS ---
  protected readonly filteredTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.tasks().filter((task) => {
<<<<<<< Updated upstream
      // Forzamos que sea un texto para evitar errores si llega null o números
      const taskStatus = String(task.estado || 'PENDIENTE').trim();
      const matchesStatus = status === 'Todas' || taskStatus.toUpperCase() === status.toUpperCase();
      
=======
      const taskStatus = String(task.estado || 'PENDIENTE');
      const matchesStatus = status === 'Todas' || taskStatus.toUpperCase() === status.toUpperCase();
>>>>>>> Stashed changes
      const taskTitle = task.titulo ? String(task.titulo).toLowerCase() : '';
      const matchesTerm = !term || taskTitle.includes(term);
      return matchesStatus && matchesTerm;
    });
  });

  protected readonly completedTasks = computed(
    () => this.tasks().filter((task) => String(task.estado).toUpperCase() === 'COMPLETADA').length
  );

  protected readonly inProgressTasks = computed(
    () => this.tasks().filter((task) => String(task.estado).toUpperCase() === 'EN_PROGRESO').length
  );

  protected readonly pendingTasks = computed(
    () => this.tasks().filter((task) => !task.estado || String(task.estado).toUpperCase() === 'PENDIENTE').length
  );

  protected updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  protected updateStatus(value: string): void {
    this.selectedStatus.set(value);
  }

  // --- ESCUDOS DE RENDERIZADO PARA EL HTML ---
  
  protected getIcon(titulo?: string): string {
    if (!titulo) return 'T';
    return String(titulo).charAt(0).toUpperCase();
  }

  protected getPriorityClass(priority?: string): string {
    if (!priority) return 'priority-baja';
    return `priority-${String(priority).toLowerCase().trim()}`;
  }

  // FIX: reemplaza espacios por guiones para que coincida con las clases CSS
  protected getStatusClass(status?: string): string {
    if (!status) return 'status-pendiente';
<<<<<<< Updated upstream
    // Reemplaza múltiples espacios por guiones si los hubiera
    return `status-${String(status).toLowerCase().trim().replace(/\s+/g, '-')}`;
=======
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
>>>>>>> Stashed changes
  }
}
