import { DialogFactory } from '../../../../features/escuelas/factories/dialog.factory';
import {Component, inject, OnInit, signal} from '@angular/core';
import { EscuelasPublicService } from '../../services/escuelas-public.service';
import { EscuelaPublicTablaComponent } from '../escuela-tabla/escuela.public.tabla.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorDto } from '../../../../shared/models/error.model';
import {EscuelaConductorResponse} from '../../../../shared/models/escuela-conductor-response-model';
import {CriterioBusqueda} from '../../../../shared/models/criterio.busqueda.model';
import {Observable} from 'rxjs';
import {PublicPage} from '../../models/page.model';
import {
  EscuelaBusquedaComponent
} from '../../../../shared/components/escuela-busqueda/escuela.busqueda.component';

@Component({
  selector: 'app-escuelas-public-listado',
  imports: [
    EscuelaPublicTablaComponent,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    EscuelaBusquedaComponent,
  ],
  templateUrl: './escuelas.listado.component.html',
  styleUrls: ['./escuelas.listado.component.css'],
})
export class EscuelasListadoComponent implements OnInit{

  private escuelaService = inject(EscuelasPublicService);
  private dialogFactory = inject(DialogFactory);
  private error!: ErrorDto;
  public isEscuelasLoading = signal<boolean>(false);
  public isEscuelasError = signal<boolean>(false);
  public escuelas = signal<EscuelaConductorResponse[]>([]);
  public pageInfo = signal<{ size: number; totalElements: number; totalPages: number; number: number }>({
    size: 10,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  });

  private criterioBusquedaActual: CriterioBusqueda | null = null;

  ngOnInit(): void {
    this.criterioBusquedaActual = {
      type: 'all',
      value: '',
    }
    this.cargarEscuelas(0, this.pageInfo().size);
  }

  public buscar(criterio: CriterioBusqueda): void {
    this.criterioBusquedaActual = criterio;
    this.cargarEscuelas(0, this.pageInfo().size);
  }


  private cargarEscuelas(page: number, size: number): void {
    if (!this.criterioBusquedaActual) return;

    const criteria = this.criterioBusquedaActual;

    const busquedas: Record<string, () => Observable<any>> = {
      nombre:       () => this.escuelaService.getEscuelasByNombrePaged(criteria.value, page, size),
      ruc:          () => this.escuelaService.getEscuelaByRuc(criteria.value),
      all:          () => this.escuelaService.getAllEscuelasPaged(page, size),
      departamento: () => this.escuelaService.getEscuelasByDepartamentoPaged(criteria.value, page, size),
      provincia:    () => this.escuelaService.getEscuelasByProvinciaPaged(criteria.value, page, size),
      distrito:     () => this.escuelaService.getEscuelaByDistritoPaged(criteria.value, page, size),
    };

    this.ejecutarBusqueda(busquedas[criteria.type]());

  }

  private ejecutarBusqueda(observable: Observable<PublicPage>): void {
    this.isEscuelasLoading.set(true);
    this.isEscuelasError.set(false);

    observable.subscribe({
      next: (res) => {
        this.escuelas.set(res.content || []);
        this.isEscuelasLoading.set(false);
        this.pageInfo.set({
          size: res.size,
          totalElements: res.totalElements,
          totalPages: res.totalPages,
          number: res.number
        });
      },
      error: (error) => {
        this.error = error.error;
        this.dialogFactory.openErrorDialog(this.error);
        this.isEscuelasError.set(true);
        this.isEscuelasLoading.set(false);
      },
    });
  }

  public onPageChange(event: { pageIndex: number; pageSize: number }): void {
    if (this.criterioBusquedaActual) {
      this.cargarEscuelas(event.pageIndex, event.pageSize);
    }
  }

  public limpiarFiltro(): void {
    this.criterioBusquedaActual = null;
    this.escuelas.set([]);
    this.pageInfo.set({
      size: 10,
      totalElements: 0,
      totalPages: 0,
      number: 0,
    });
  }

}
