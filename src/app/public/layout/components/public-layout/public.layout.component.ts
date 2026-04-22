import { Component, effect, HostListener, OnInit, signal, Signal } from '@angular/core';
import { EscuelasListadoComponent } from "../../../escuelas/components/escuelas-listado/escuelas.listado.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { PublicNavbarComponent } from "../public-navbar/public.navbar.component";
import { PublicSidebar } from "../public-sidebar/public-sidebar";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatAnchor } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [FooterComponent, PublicNavbarComponent, PublicSidebar, MatSidenavModule, MatAnchor, MatIconModule, RouterOutlet],
  templateUrl: './public.layout.component.html',
  styleUrls: ['./public.layout.component.css'],
})
export class PublicLayoutComponent implements OnInit {

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
    if (this.sidenavMode() === 'over') {
      this.isSidenavOpened.set(opened);
    }
  }
}
