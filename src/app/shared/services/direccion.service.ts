import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DepartamentoDto } from '../models/Departamento.model';
import { Observable } from 'rxjs';
import { ProvinciaDto } from '../models/Provincia.model';
import { DistritoDto } from '../models/Distrito.model';
import { PosibleDireccion } from '../models/posibleDireccion.model';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/direcciones';

  public getDepartamentos(): Observable<DepartamentoDto[]> {
    return this.httpClient.get<DepartamentoDto[]>(`${this.apiUrl}/departamentos`);
  }

  public getProvincias(departamentoId: number): Observable<ProvinciaDto[]> {
    return this.httpClient.get<ProvinciaDto[]>(`${this.apiUrl}/provincias?departamentoId=${departamentoId}`);

  }

  public getDistritos(provinciaId: number): Observable<DistritoDto[]> {
    return this.httpClient.get<DistritoDto[]>(`${this.apiUrl}/distritos?provinciaId=${provinciaId}`);
  }


  public getPosiblesDirecciones(texto: string): Observable<PosibleDireccion[]> {
    return this.httpClient.get<PosibleDireccion[]>(`${this.apiUrl}/find-by-nombre?nombre=${texto}`);
  }
}
