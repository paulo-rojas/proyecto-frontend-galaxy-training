import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url = `${environment.API_BASE}/v1/auth`;
  private httpClient = inject(HttpClient);

  login(LoginRequest:LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.url}/login`,LoginRequest);
  }

}
