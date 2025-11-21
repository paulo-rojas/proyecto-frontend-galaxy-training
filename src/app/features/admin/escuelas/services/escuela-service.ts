import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedEscuelasResponse, EscuelaConductorResponseDto, EmbeddedEscuelas, EscuelaConductorRequestDto } from '../models/gestion.models';

@Injectable({
  providedIn: 'root',
})
export class EscuelaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/gestion/escuelas';

  public getEscuelas(page: number = 0, size: number = 10): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  public getEscuelaById(id: number): Observable<EscuelaConductorResponseDto> {
    return this.http.get<EscuelaConductorResponseDto>(`${this.baseUrl}/${id}`);
  }

  public getEscuelaByRuc(ruc: string): Observable<EscuelaConductorResponseDto> {
    return this.http.get<EscuelaConductorResponseDto>(`${this.baseUrl}/ruc/${ruc}`);
  }

  public getEscuelaByNombre(nombre: string): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}/nombre?nombre=${nombre}`);
  }

  public getEscuelaByDistrito(distritoId: number): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}/distrito/${distritoId}`);
  }

  public getEscuelaByProvincia(provinciaId: number): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}/provincia/${provinciaId}`);
  }

  public getEscuelaByDepartamento(departamentoId: number): Observable<PagedEscuelasResponse> {
    return this.http.get<PagedEscuelasResponse>(`${this.baseUrl}/departamento/${departamentoId}`);
  }

  public crearEscuela(escuela: EscuelaConductorRequestDto) {
    return this.http.post<EscuelaConductorResponseDto>(this.baseUrl, escuela);
  }

  public actualizarEscuela(id: number, escuela: EscuelaConductorRequestDto) {
    return this.http.put<EscuelaConductorResponseDto>(`${this.baseUrl}/${id}/update`, escuela);
  }

  public actualizarEstadoEscuela(id: number, estado: number) {
    return this.http.patch<void>(`${this.baseUrl}/${id}/updateEstado/${estado}`, {});
  }
  public eliminarEscuela(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}/delete`);
  }
}
