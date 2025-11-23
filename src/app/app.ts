import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EscuelaListadoComponent } from "./features/admin/escuelas/components/escuela.listado.component/escuela.listado.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
