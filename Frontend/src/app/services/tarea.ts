import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'http://localhost:8080/api/tareas';

  constructor(private http: HttpClient) { }

  obtenerTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  obtenerTareaPorId(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  crearTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  actualizarTarea(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  eliminarTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}