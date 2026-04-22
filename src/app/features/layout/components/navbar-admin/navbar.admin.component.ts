import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-admin',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './navbar.admin.component.html',
  styleUrl: './navbar.admin.component.css',
})
export class NavbarAdminComponent implements OnInit {
  
  private router = inject(Router);
  protected nombre!: string;

  ngOnInit(): void {
    this.nombre = sessionStorage.getItem('nombre') || '';
  }

  logout(): void {
    sessionStorage.removeItem('auth_credentials');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('nombre');

    this.router.navigate(['/login']);
  }
}
