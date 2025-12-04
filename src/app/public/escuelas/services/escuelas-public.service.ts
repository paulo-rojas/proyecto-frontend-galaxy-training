import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../../../environments/environment.development';
import {PublicPage} from '../models/page.model';


@Injectable({
  providedIn: 'root',
})
export class EscuelasPublicService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.API_BASE}`;
  private baseUrl = `${this.apiUrl}/api/public/escuelas`;

  getAllEscuelasPaged(page: number = 0, size: number = 10): Observable<PublicPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<PublicPage>(this.baseUrl, { params });
  }

  getEscuelaByRuc(ruc: string): Observable<PublicPage> {
    return this.httpClient.get<PublicPage>(`${this.baseUrl}/ruc/${ruc}`);
  }

  getEscuelasByNombrePaged(nombre: string, page: number = 0, size: number = 10): Observable<PublicPage> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<PublicPage>(`${this.baseUrl}/nombre`, { params });
  }

  getEscuelaByDistritoPaged(distritoId: number, page: number = 0, size: number = 10): Observable<PublicPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<PublicPage>(`${this.baseUrl}/distrito/${distritoId}`, { params });
  }

  getEscuelasByProvinciaPaged(provinciaId: number, page: number = 0, size: number = 10): Observable<PublicPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<PublicPage>(`${this.baseUrl}/provincia/${provinciaId}`, { params });
  }

  getEscuelasByDepartamentoPaged(departamentoId: number, page: number = 0, size: number = 10): Observable<PublicPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<PublicPage>(`${this.baseUrl}/departamento/${departamentoId}`, { params });
  }
}
