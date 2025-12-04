import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DepartamentoDto } from '../models/departamento.model';
import { Observable } from 'rxjs';
import { ProvinciaDto } from '../models/provincia.model';
import { DistritoDto } from '../models/distrito.model';
import { PosibleDireccion } from '../models/posible-direccion.model';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.API_BASE}`;
  private baseUrl = `${this.apiUrl}/api/direcciones`;


  public getDepartamentos(): Observable<DepartamentoDto[]> {
    return this.httpClient.get<DepartamentoDto[]>(`${this.baseUrl}/departamentos`);
  }

  public getProvincias(departamentoId: number): Observable<ProvinciaDto[]> {
    return this.httpClient.get<ProvinciaDto[]>(`${this.baseUrl}/provincias?departamentoId=${departamentoId}`);
  }
  public getDistritos(provinciaId: number): Observable<DistritoDto[]> {
    return this.httpClient.get<DistritoDto[]>(`${this.baseUrl}/distritos?provinciaId=${provinciaId}`);
  }


  public getPosiblesDirecciones(texto: string): Observable<PosibleDireccion[]> {
    return this.httpClient.get<PosibleDireccion[]>(`${this.baseUrl}/find-by-nombre?nombre=${texto}`);
  }
}
