import { Component, inject } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { Router } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-admin-sidebar',
  imports: [MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebarComponent {
  readonly options = ['1.- Centros médicos', '2.- Escuelas de conductores', '3.- Centros de evaluación']

  private router = inject(Router);

  onChipSelected(option: string): void {
    if (option.includes('Inicio')) {
      this.router.navigate(['/admin/inicio']);
    } else if (option.includes('2')) {
      this.router.navigate(['/admin/escuelas']);
    } else if (option.includes('1')) {
      this.router.navigate(['/admin/centros-medicos']);
    } else if (option.includes('3')) {
      this.router.navigate(['/admin/centros-evaluacion']);
    }
  }
}
