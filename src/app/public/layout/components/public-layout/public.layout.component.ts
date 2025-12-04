import { Component } from '@angular/core';
import { EscuelasListadoComponent } from "../../../escuelas/components/escuelas-listado/escuelas.listado.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { PublicNavbarComponent } from "../navbar-public/public.navbar.component";

@Component({
  selector: 'app-public-layout',
  imports: [EscuelasListadoComponent, FooterComponent, PublicNavbarComponent],
  templateUrl: './public.layout.component.html',
  styleUrl: './public.layout.component.css',
})
export class PublicLayoutComponent {

}
