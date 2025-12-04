import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {PagedEscuelasResponse} from '../models/page-hateoas.model';
import {EscuelaConductorResponse} from '../../../shared/models/escuela-conductor-response-model';
import {environment} from '../../../../environments/environment.development';
import {EscuelaConductorRequest} from '../models/escuela-request.model';

@Injectable({
  providedIn: 'root',
})
export class EscuelaGestionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE}`;
  private baseUrl = `${this.apiUrl}/api/gestion/escuelas`;

  public getEscuelas(page: number = 0, size: number = 10): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  public getEscuelaById(id: number): Observable<EscuelaConductorResponse> {
    return this.http.get<EscuelaConductorResponse>(`${this.baseUrl}/${id}`);
  }

  public getEscuelaByRuc(ruc: string): Observable<EscuelaConductorResponse> {
    return this.http.get<EscuelaConductorResponse>(`${this.baseUrl}/ruc/${ruc}`);
  }

  public getEscuelaByNombre(nombre: string, page: number = 0, size: number = 10): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}/nombre?nombre=${nombre}&page=${page}&size=${size}`);
  }

  public getEscuelaByDistrito(distritoId: number, page: number = 0, size: number = 10): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}/distrito/${distritoId}?page=${page}&size=${size}`);
  }

  public getEscuelaByProvincia(provinciaId: number, page: number = 0, size: number = 10): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}/provincia/${provinciaId}?page=${page}&size=${size}`);
  }

  public getEscuelaByDepartamento(departamentoId: number, page: number = 0, size: number = 10): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}/departamento/${departamentoId}?page=${page}&size=${size}`);
  }

  public crearEscuela(escuela: EscuelaConductorRequest): Observable<EscuelaConductorResponse> {
    console.log('📤 SERVICE: Enviando POST a:', this.baseUrl);
    console.log('📤 SERVICE: Datos:', escuela);
    return this.http.post<EscuelaConductorResponse>(this.baseUrl, escuela);
  }

  public actualizarEscuela(id: number, escuela: EscuelaConductorRequest) {
    return this.http.put<EscuelaConductorResponse>(`${this.baseUrl}/${id}/update`, escuela);
  }

  public actualizarEstadoEscuela(id: number, estado: number) {
    return this.http.patch<void>(`${this.baseUrl}/${id}/updateEstado/${estado}`, {});
  }
  public eliminarEscuela(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}/delete`);
  }
}
