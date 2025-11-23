import { Component } from '@angular/core';
import { EscuelaPublicBusquedaComponent } from "../escuela.public.busqueda.component/escuela.public.busqueda.component";
import { EscuelaPublicTablaComponent } from "../escuela.public.tabla.component/escuela.public.tabla.component";

@Component({
  selector: 'app-escuelas-public-listado',
  imports: [EscuelaPublicBusquedaComponent, EscuelaPublicTablaComponent],
  templateUrl: './escuelas.listado.component.html',
  styleUrl: './escuelas.listado.component.css',
})
export class EscuelasListadoComponent {

}
