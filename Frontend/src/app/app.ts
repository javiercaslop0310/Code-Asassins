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

  // Inicializamos los signals vacíos
  protected readonly projects = signal<Proyecto[]>([]);
  protected readonly tasks = signal<Tarea[]>([]);

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    // 1. Obtener los proyectos reales
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Error al cargar proyectos:', err)
    });

    // 2. Obtener las tareas reales
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
      // Escudo 1: Aseguramos que el estado sea un texto válido
      const taskStatus = String(task.estado || 'PENDIENTE');
      const matchesStatus = status === 'Todas' || taskStatus.toUpperCase() === status.toUpperCase();
      
      // Escudo 2: Convertimos a String por si desde el backend llega un número o algo raro
      const taskTitle = task.titulo ? String(task.titulo).toLowerCase() : '';
      const matchesTerm = !term || taskTitle.includes(term);

      return matchesStatus && matchesTerm;
    });
  });

  protected readonly completedTasks = computed(
    () => this.tasks().filter((task) => task.estado === 'COMPLETADA').length
  );

  protected readonly inProgressTasks = computed(
    () => this.tasks().filter((task) => task.estado === 'EN PROGRESO').length
  );

  protected readonly pendingTasks = computed(
    () => this.tasks().filter((task) => !task.estado || task.estado === 'PENDIENTE').length
  );

  protected updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  protected updateStatus(value: string): void {
    this.selectedStatus.set(value);
  }

  protected getPriorityClass(priority?: string): string {
    if (!priority) return 'priority-baja';
    return `priority-${priority.toLowerCase()}`;
  }

  protected getStatusClass(status?: string): string {
    if (!status) return 'status-pendiente';
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }
}