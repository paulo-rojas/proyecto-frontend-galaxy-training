import { Component } from '@angular/core';
import { NavbarAdminComponent } from "../navbar-admin/navbar.admin.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-layout-admin',
  imports: [NavbarAdminComponent, RouterOutlet, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class AdminLayoutComponent {

}
