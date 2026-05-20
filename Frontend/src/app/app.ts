import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

type TaskStatus = 'Pendiente' | 'En progreso' | 'Completada';
type Priority = 'Baja' | 'Media' | 'Alta' | 'Urgente';

interface Task {
  id: number;
  title: string;
  project: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  priority: Priority;
  progress: number;
}

interface Project {
  name: string;
  description: string;
  status: 'Activo' | 'Pausado' | 'Finalizado';
  progress: number;
  tasks: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly searchTerm = signal('');
  protected readonly selectedStatus = signal<'Todas' | TaskStatus>('Todas');

  protected readonly projects = signal<Project[]>([
    {
      name: 'Desarrollo Web Fullstack',
      description: 'Backend Spring Boot + frontend Angular para la gestión completa de proyectos y tareas.',
      status: 'Activo',
      progress: 68,
      tasks: 5,
    },
    {
      name: 'Organización Personal',
      description: 'Agenda visual para tareas personales, recordatorios y prioridades semanales.',
      status: 'Activo',
      progress: 42,
      tasks: 2,
    },
    {
      name: 'Campaña de Marketing',
      description: 'Planificación de entregables, revisiones creativas y fechas clave.',
      status: 'Pausado',
      progress: 76,
      tasks: 2,
    },
  ]);

  protected readonly tasks = signal<Task[]>([
    {
      id: 1,
      title: 'Crear entidades JPA',
      project: 'Desarrollo Web Fullstack',
      owner: 'Backend',
      dueDate: '22 may',
      status: 'Completada',
      priority: 'Alta',
      progress: 100,
    },
    {
      id: 2,
      title: 'Configurar H2 modo PostgreSQL',
      project: 'Desarrollo Web Fullstack',
      owner: 'Backend',
      dueDate: '24 may',
      status: 'En progreso',
      priority: 'Alta',
      progress: 65,
    },
    {
      id: 3,
      title: 'Crear ProyectoController',
      project: 'Desarrollo Web Fullstack',
      owner: 'API',
      dueDate: '27 may',
      status: 'Pendiente',
      priority: 'Media',
      progress: 12,
    },
    {
      id: 4,
      title: 'Crear TareaController',
      project: 'Desarrollo Web Fullstack',
      owner: 'API',
      dueDate: '28 may',
      status: 'Pendiente',
      priority: 'Media',
      progress: 8,
    },
    {
      id: 5,
      title: 'Revisar agenda semanal',
      project: 'Organización Personal',
      owner: 'Jazmin',
      dueDate: '26 may',
      status: 'En progreso',
      priority: 'Media',
      progress: 54,
    },
    {
      id: 6,
      title: 'Revisar piezas gráficas',
      project: 'Campaña de Marketing',
      owner: 'Diseño',
      dueDate: '5 jun',
      status: 'Pendiente',
      priority: 'Alta',
      progress: 24,
    },
  ]);

  protected readonly filteredTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.tasks().filter((task) => {
      const matchesStatus = status === 'Todas' || task.status === status;
      const matchesTerm =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.project.toLowerCase().includes(term) ||
        task.owner.toLowerCase().includes(term);

      return matchesStatus && matchesTerm;
    });
  });

  protected readonly completedTasks = computed(
    () => this.tasks().filter((task) => task.status === 'Completada').length,
  );

  protected readonly inProgressTasks = computed(
    () => this.tasks().filter((task) => task.status === 'En progreso').length,
  );

  protected readonly pendingTasks = computed(
    () => this.tasks().filter((task) => task.status === 'Pendiente').length,
  );

  protected updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  protected updateStatus(value: string): void {
    this.selectedStatus.set(value as 'Todas' | TaskStatus);
  }

  protected getPriorityClass(priority: Priority): string {
    return `priority-${priority.toLowerCase()}`;
  }

  protected getStatusClass(status: TaskStatus | Project['status']): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }
}
