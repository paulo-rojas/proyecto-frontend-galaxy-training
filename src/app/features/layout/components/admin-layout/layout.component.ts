import { Component, effect, HostListener, OnInit, signal } from '@angular/core';
import { NavbarAdminComponent } from "../navbar-admin/navbar.admin.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-layout-admin',
  imports: [NavbarAdminComponent, RouterOutlet, FooterComponent, MatSidenavModule, MatIconModule, MatButton, AdminSidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class AdminLayoutComponent implements OnInit {
  protected isSidenavOpened = signal<boolean>(true);
  protected sidenavMode = signal<'over' | 'side'>('side');
  
  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (window.innerWidth <= 1000) {
      this.sidenavMode.set('over');
      this.isSidenavOpened.set(false);
    } else {
      this.sidenavMode.set('side'); 
      this.isSidenavOpened.set(true);
    }
  }

  onSidenavChange(opened: boolean): void {
    // Solo actualizar el estado si está en modo 'over'
    if (this.sidenavMode() === 'over') {
      this.isSidenavOpened.set(opened);
    }
  }
}
