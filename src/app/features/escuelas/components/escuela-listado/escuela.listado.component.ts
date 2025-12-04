import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscuelaGestionService } from '../../services/escuela-gestion.service';

import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { DialogResult } from '../actualizar-dialog/actualizar.dialog.component';
import { DialogFactory } from '../../factories/dialog.factory';
import { EscuelaBusquedaComponent } from '../../../../shared/components/escuela-busqueda/escuela.busqueda.component';
import { EscuelaTablaComponent, EscuelaAction } from '../escuela-tabla/escuela.tabla.component';
import { ErrorDto } from '../../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { PageInfo } from '../../../../shared/models/page.info.model';
import { CriterioBusqueda } from '../../../../shared/models/criterio.busqueda.model';
import {EscuelaConductorResponse} from '../../../../shared/models/escuela-conductor-response-model';
import {PagedEscuelasResponse} from '../../models/page-hateoas.model';

@Component({
  selector: 'app-escuela-listado',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    EscuelaBusquedaComponent,
    EscuelaTablaComponent,
  ],
  templateUrl: './escuela.listado.component.html',
  styleUrls: ['./escuela.listado.component.css'],
})
export class EscuelaListadoComponent implements OnInit {
  private escuelaService = inject(EscuelaGestionService);
  private router = inject(Router);
  private dialogFactory = inject(DialogFactory);
  private error!: ErrorDto;
  private toastr = inject(ToastrService);
  protected isError = signal<boolean>(false);
  protected isLoading = signal<boolean>(false);

  public isEscuelasLoading = signal<boolean>(false);
  public isEscuelasError = signal<boolean>(false);
  public escuelas = signal<EscuelaConductorResponse[]>([]);
  public pageInfo = signal<PageInfo>({
    size: 10,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  });

  private criterioBusquedaActual: CriterioBusqueda | null = null;

  ngOnInit(): void {
    this.criterioBusquedaActual = { type: 'all', value: '' };
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
      nombre:       () => this.escuelaService.getEscuelaByNombre(criteria.value, page, size),
      ruc:          () => this.escuelaService.getEscuelaByRuc(criteria.value),
      all:          () => this.escuelaService.getEscuelas(page, size),
      departamento: () => this.escuelaService.getEscuelaByDepartamento(criteria.value, page, size),
      provincia:    () => this.escuelaService.getEscuelaByProvincia(criteria.value, page, size),
      distrito:     () => this.escuelaService.getEscuelaByDistrito(criteria.value, page, size),
    };

    this.ejecutarBusqueda(busquedas[criteria.type]());

  }

  private ejecutarBusqueda(observable: Observable<PagedEscuelasResponse>): void {
    this.isEscuelasLoading.set(true);
    this.isEscuelasError.set(false);

    observable.subscribe({
      next: (res) => {
        this.escuelas.set(res._embedded?.escuelaConductorResponseDtoList || []);
        this.isEscuelasLoading.set(false);
        this.pageInfo.set(res.page);
      },
      error: (error) => {
        console.error(error)
        this.error = error.error;
        this.dialogFactory.openErrorDialog(this.error);
        this.isEscuelasError.set(true);
        this.isEscuelasLoading.set(false);
      },
    });
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

  public onPageChange(event: { pageIndex: number; pageSize: number }): void {
    if (this.criterioBusquedaActual) {
      this.cargarEscuelas(event.pageIndex, event.pageSize);
    }
  }

  public onTableAction(action: EscuelaAction): void {
    const acciones = {
      edit: () => this.editar(action.escuela),
      delete: () => this.eliminar(action.escuela),
      updateStatus: () => this.actualizarEstado(action.escuela),
    }
    acciones[action.type]();
  }

  private editar(escuela: EscuelaConductorResponse): void {
    this.router.navigate(['/admin/escuelas/editar', escuela.id]);
  }

  private eliminar(escuela: EscuelaConductorResponse): void {
    const dialogRef = this.dialogFactory.openDeleteEscuelaDialog(escuela.nombreEstablecimiento);

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.escuelaService.eliminarEscuela(escuela.id).subscribe({
          next: () => {

            this.toastr.warning('Escuela eliminada con éxito.');
            this.escuelas.set(this.escuelas().filter((e) => e.id !== escuela.id));
          },
          error: (error) => {
            this.dialogFactory.openErrorDialog(error.error);
          },
        });
      }
    });
  }

  private actualizarEstado(escuela: EscuelaConductorResponse): void {
    const dialogRef = this.dialogFactory.openUpdateEstadoDialog(escuela);

    dialogRef.afterClosed().subscribe((result: DialogResult | undefined) => {
      if (result) {
        this.openConfirmUpdateDialog(escuela, result.tipoAutorizacion);
      }
    });
  }

  private openConfirmUpdateDialog(escuela: EscuelaConductorResponse, nuevoEstado: number): void {
    const dialogRef = this.dialogFactory.openConfirmUpdateDialog();
    const estadoDescripcion = {
      1: 'Con autorización',
      0: 'Sin autorización'
    }
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.escuelaService.actualizarEstadoEscuela(escuela.id, nuevoEstado).subscribe({
          next: () => {
            escuela.estado =  estadoDescripcion[nuevoEstado as keyof typeof estadoDescripcion];
            this.escuelas.set([...this.escuelas()]);
            this.toastr.success('Estado de la escuela actualizado con éxito.');
          },
          error: (error) => {
            this.dialogFactory.openErrorDialog(error.error);
          },
        });
      }
    });
  }


}
