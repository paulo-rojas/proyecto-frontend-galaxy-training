import { DialogFactory } from './../../../features/escuelas/factories/dialog.factory';
import { Component, inject } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicNavbarComponent } from '../../layout/components/public-navbar/public.navbar.component';
import { MatCardModule, MatCardContent } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ErrorDto } from '../../../shared/models/error.model';
import { UserResponse } from '../models/user.response';

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
  private errorDto!: ErrorDto;
  private dialogFactory = inject(DialogFactory);
  private user!: UserResponse

  private fb = inject(FormBuilder);
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  login() {
    const username = this.loginForm.controls['username'].value || '';
    const password = this.loginForm.controls['password'].value || '';
    
    const credentials = btoa(`${username}:${password}`);
    
    this.loginService.authenticateBasic(credentials).subscribe({
      next: (response) => {
        sessionStorage.setItem('auth_credentials', credentials);
        sessionStorage.setItem('username', username);
        this.user = response as UserResponse;
        sessionStorage.setItem('nombre', this.user.nombre);
        console.log('Usuario autenticado:', this.user);
        this.router.navigate(['admin']);
      },
      error: (err) => {
        this.errorDto = {
          estado: err.status,
          nombre: 'Error de Autenticación',
          descripcion: 'Las credenciales proporcionadas son incorrectas. Por favor, inténtelo de nuevo.'
        };
        this.dialogFactory.openErrorDialog(this.errorDto);

      }
    });
  }

}
