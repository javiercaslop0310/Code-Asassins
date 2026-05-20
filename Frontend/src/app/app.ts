import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit, Component, ComponentRef, computed,
  EnvironmentInjector, inject, OnDestroy, OnInit,
  signal, createComponent,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Proyecto, Tarea } from './models/interfaces';
import { ProyectoService } from './services/proyecto';
import { TareaService } from './services/tarea';
import { TaskModalComponent } from './task-modal/task-modal.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private proyectoService = inject(ProyectoService);
  private tareaService = inject(TareaService);
  private document = inject(DOCUMENT);
  private injector = inject(EnvironmentInjector);

  protected readonly searchTerm = signal('');
  protected readonly selectedStatus = signal<string>('Todas');
  protected readonly projects = signal<Proyecto[]>([]);
  protected readonly tasks = signal<Tarea[]>([]);

  private modalRef: ComponentRef<TaskModalComponent> | null = null;

  ngOnInit(): void { this.cargarDatos(); }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void { this.destroyModal(); }

  private cargarDatos(): void {
    this.proyectoService.obtenerProyectos().subscribe({
      // Defensa: el backend podría devolver objeto paginado en lugar de array
      next: (data: any) => this.projects.set(Array.isArray(data) ? data : (data?.content ?? [])),
      error: (err) => console.error('Error al cargar proyectos:', err),
    });
    this.tareaService.obtenerTareas().subscribe({
      next: (data: any) => this.tasks.set(Array.isArray(data) ? data : (data?.content ?? [])),
      error: (err) => console.error('Error al cargar tareas:', err),
    });
  }

  protected openModal(): void {
    this.destroyModal();
    this.modalRef = createComponent(TaskModalComponent, {
      environmentInjector: this.injector,
    });
    this.modalRef.instance.onClose = () => this.destroyModal();
    this.modalRef.instance.onTaskCreated = (task: Tarea) => {
      this.tasks.update((ts) => [task, ...ts]);
      this.destroyModal();
    };
    this.modalRef.instance.tareaService = this.tareaService;
    this.modalRef.instance.proyectoService = this.proyectoService;

    this.document.body.appendChild(this.modalRef.location.nativeElement);
    this.modalRef.changeDetectorRef.detectChanges();
    // Disparar ngOnInit manualmente tras detectChanges
    this.modalRef.instance.ngOnInit();
  }

  private destroyModal(): void {
    if (this.modalRef) {
      this.modalRef.location.nativeElement.remove();
      this.modalRef.destroy();
      this.modalRef = null;
    }
  }

  protected readonly filteredTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    return this.tasks().filter((task) => {
      const taskStatus = String(task.estado || 'PENDIENTE');
      const matchesStatus = status === 'Todas' || taskStatus.toUpperCase() === status.toUpperCase();
      const taskTitle = task.titulo ? String(task.titulo).toLowerCase() : '';
      const matchesTerm = !term || taskTitle.includes(term);
      return matchesStatus && matchesTerm;
    });
  });

  protected readonly completedTasks = computed(
    () => this.tasks().filter((t) => String(t.estado).toUpperCase() === 'COMPLETADA').length
  );
  protected readonly inProgressTasks = computed(
    () => this.tasks().filter((t) =>
      String(t.estado).toUpperCase() === 'EN PROGRESO' ||
      String(t.estado).toUpperCase() === 'EN_PROGRESO'
    ).length
  );
  protected readonly pendingTasks = computed(
    () => this.tasks().filter((t) => !t.estado || String(t.estado).toUpperCase() === 'PENDIENTE').length
  );

  protected updateSearch(v: string): void { this.searchTerm.set(v); }
  protected updateStatus(v: string): void { this.selectedStatus.set(v); }
  protected getIcon(titulo?: string): string {
    return titulo ? String(titulo).charAt(0).toUpperCase() : 'T';
  }
  protected getPriorityClass(p?: string): string {
    return p ? `priority-${String(p).toLowerCase().trim()}` : 'priority-baja';
  }
  protected getStatusClass(s?: string): string {
    return s ? `status-${s.toLowerCase().replace(/\s+/g, '-')}` : 'status-pendiente';
  }
}
