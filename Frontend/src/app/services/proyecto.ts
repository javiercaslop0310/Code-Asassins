import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// ESTA ES LA LÍNEA QUE DEBES CAMBIAR:
import { Proyecto } from '../models/interfaces'; 

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private apiUrl = 'http://localhost:8080/api/proyectos';

  constructor(private http: HttpClient) { }

  obtenerProyectos(nombre?: string, estado?: string): Observable<Proyecto[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (estado) params = params.set('estado', estado);

    return this.http.get<Proyecto[]>(this.apiUrl, { params });
  }

  crearProyecto(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.apiUrl, proyecto);
  }
}