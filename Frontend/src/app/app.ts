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

  // --- LÓGICA DE FILTRADO Y ESTADÍSTICAS ---
  protected readonly filteredTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.tasks().filter((task) => {
      // Forzamos que sea un texto para evitar errores si llega null o números
      const taskStatus = String(task.estado || 'PENDIENTE').trim();
      const matchesStatus = status === 'Todas' || taskStatus.toUpperCase() === status.toUpperCase();
      
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

  protected getStatusClass(status?: string): string {
    if (!status) return 'status-pendiente';
    // Reemplaza múltiples espacios por guiones si los hubiera
    return `status-${String(status).toLowerCase().trim().replace(/\s+/g, '-')}`;
  }
}