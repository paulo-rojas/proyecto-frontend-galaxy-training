import { Component, inject } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PublicNavbarComponent } from '../../layout/components/navbar-public/public.navbar.component';
import { MatCardModule, MatCardContent } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    PublicNavbarComponent,
    MatCardModule,
    MatCardContent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatIconButton,
    FooterComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  public hidePassword: boolean = true;
  private loginService = inject(LoginService);
  private router = inject(Router);

  private fb = inject(FormBuilder);
  loginForm = this.fb.group({
    username: [''],
    password: ['']
  });

  login() {

    console.log('login...')

    const loginRequest: LoginRequest = new LoginRequest(
      this.loginForm.controls['username'].value || '',
      this.loginForm.controls['password'].value || ''
    )

    console.log(loginRequest)

    this.loginService.login(loginRequest).subscribe({
      next: (res: LoginResponse) => {
        console.log(res)
        this.router.navigate(['admin'])
        sessionStorage.setItem('access_token', res.access_token)
        sessionStorage.setItem('refresh_token', res.refresh_token)
      },
      error(err) {

      },
    })


  }

}
