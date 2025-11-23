import { Component } from '@angular/core';
import { EscuelaListadoComponent } from "../../../admin/escuelas/components/escuela.listado.component/escuela.listado.component";
import { EscuelasListadoComponent } from "../../escuelas/escuelas.listado.component/escuelas.listado.component";
import { FooterComponent } from "../../../../shared/components/footer.component/footer.component";
import { PublicNavbarComponent } from "../public.navbar.component/public.navbar.component";

@Component({
  selector: 'app-public-layout',
  imports: [EscuelasListadoComponent, FooterComponent, PublicNavbarComponent],
  templateUrl: './public.layout.component.html',
  styleUrl: './public.layout.component.css',
})
export class PublicLayoutComponent {

}
