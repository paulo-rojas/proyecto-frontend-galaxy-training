import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { PublicNavbarComponent } from "../../../features/public/layout/public.navbar.component/public.navbar.component";
import { FooterComponent } from "../footer.component/footer.component";

@Component({
  selector: 'app-login-component',
  imports: [
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    PublicNavbarComponent,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  hidePassword = true;

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  private fb = inject(FormBuilder);
  loginForm = this.fb.group({
    username: [''],
    password: ['']
  });

}
