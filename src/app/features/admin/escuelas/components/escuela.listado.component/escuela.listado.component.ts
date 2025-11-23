import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscuelaService } from '../../services/escuela-service';
import {
  EscuelaConductorResponseDto,
  PageInfo,
  PagedEscuelasResponse,
} from '../../models/gestion.models';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PosibleDireccion } from '../../../../../shared/models/posibleDireccion.model';
import { Router } from '@angular/router';
import { DialogResult } from '../../../dialog/actualizar.dialog.component/actualizar.dialog.component';
import { DialogFactory } from '../../factories/dialog.factory';
import { EscuelaBusquedaComponent, SearchCriteria } from '../escuela.busqueda.component/escuela.busqueda.component';
import { EscuelaTablaComponent, EscuelaAction } from '../escuela.tabla.component/escuela.tabla.component';
import { ErrorDto } from '../../../../../shared/models/error.model';

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
  private escuelaService = inject(EscuelaService);
  private router = inject(Router);
  private dialogFactory = inject(DialogFactory);
  private error!: ErrorDto;

  public isLoading = signal<boolean>(false);
  public isError = signal<boolean>(false);
  public escuelas = signal<EscuelaConductorResponseDto[]>([]);
  public pageInfo = signal<PageInfo>({
    size: 10,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  });

  // Guardar criterios de búsqueda actuales
  private currentSearchCriteria: SearchCriteria | null = null;

  ngOnInit(): void {
    // Cargar todas las escuelas al iniciar el componente
    this.currentSearchCriteria = { type: 'all', value: '' };
    this.executeSearch(0, this.pageInfo().size);
  }

  public onSearch(criteria: SearchCriteria): void {
    // Guardar criterios de búsqueda y resetear a la primera página
    this.currentSearchCriteria = criteria;
    this.executeSearch(0, this.pageInfo().size);
  }

  private executeSearch(page: number, size: number): void {
    if (!this.currentSearchCriteria) return;

    const criteria = this.currentSearchCriteria;

    switch (criteria.type) {
      case 'nombre':
        this.ejecutarBusqueda(this.escuelaService.getEscuelaByNombre(criteria.value, page, size));
        break;
      case 'ruc':
        this.buscarPorRuc(criteria.value);
        break;
      case 'all':
        this.ejecutarBusqueda(this.escuelaService.getEscuelas(page, size));
        break;
      case 'departamento':
        this.ejecutarBusqueda(this.escuelaService.getEscuelaByDepartamento(criteria.value, page, size));
        break;
      case 'provincia':
        this.ejecutarBusqueda(this.escuelaService.getEscuelaByProvincia(criteria.value, page, size));
        break;
      case 'distrito':
        this.ejecutarBusqueda(this.escuelaService.getEscuelaByDistrito(criteria.value, page, size));
        break;
      case 'direccion':
        this.onDireccionSeleccionada(criteria.value, page, size);
        break;
    }
  }

  private buscarPorRuc(ruc: string): void {
    this.isLoading.set(true);
    this.isError.set(false);

    this.escuelaService.getEscuelaByRuc(ruc).subscribe({
      next: (escuela) => {
        this.escuelas.set([escuela]);
        this.isLoading.set(false);
        this.pageInfo.set({
          size: 1,
          totalElements: 1,
          totalPages: 1,
          number: 0,
        });
      },
      error: (error) => {
        this.dialogFactory.openErrorDialog(error.error);
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  private ejecutarBusqueda(observable: Observable<PagedEscuelasResponse>): void {
    this.isLoading.set(true);
    this.isError.set(false);

    observable.subscribe({
      next: (res) => {
        this.escuelas.set(res._embedded?.escuelaConductorResponseDtoList || []);
        this.isLoading.set(false);
        this.pageInfo.set(res.page);
        console.log('Escuelas cargadas:', res.page);
      },
      error: (error) => {
        this.error = error.error;
        this.error.descripcion = 'Error de conexión a la base de datos';
        this.dialogFactory.openErrorDialog(this.error);
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  public onClear(): void {
    this.currentSearchCriteria = null;
    this.escuelas.set([]);
    this.pageInfo.set({
      size: 10,
      totalElements: 0,
      totalPages: 0,
      number: 0,
    });
  }

  public onPageChange(event: { pageIndex: number; pageSize: number }): void {
    if (this.currentSearchCriteria) {
      this.executeSearch(event.pageIndex, event.pageSize);
    }
  }

  public onTableAction(action: EscuelaAction): void {
    switch (action.type) {
      case 'edit':
        this.editar(action.escuela);
        break;
      case 'delete':
        this.eliminar(action.escuela);
        break;
      case 'updateStatus':
        this.actualizarEstado(action.escuela);
        break;
    }
  }

  private editar(escuela: EscuelaConductorResponseDto): void {
    this.router.navigate(['/admin/escuelas/editar', escuela.id]);
  }

  private eliminar(escuela: EscuelaConductorResponseDto): void {
    const dialogRef = this.dialogFactory.openDeleteEscuelaDialog(escuela.nombreEstablecimiento);

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.escuelaService.eliminarEscuela(escuela.id).subscribe({
          next: () => {
            alert('Escuela eliminada con éxito.');
            this.escuelas.set(this.escuelas().filter((e) => e.id !== escuela.id));
          },
          error: (error) => {
            this.dialogFactory.openErrorDialog(error.error);
          },
        });
      }
    });
  }

  private actualizarEstado(escuela: EscuelaConductorResponseDto): void {
    const dialogRef = this.dialogFactory.openUpdateEstadoDialog(escuela);

    dialogRef.afterClosed().subscribe((result: DialogResult | undefined) => {
      if (result) {
        this.openConfirmUpdateDialog(escuela.id, result.tipoAutorizacion);
      }
    });
  }

  private onDireccionSeleccionada(direccion: PosibleDireccion, page: number = 0, size: number = 10): void {
    this.isLoading.set(true);
    this.escuelaService
      .getEscuelaByDistrito(direccion.distritoId, page, size)
      .pipe(
        catchError((error) => {
          console.error('Error al cargar datos:', error);
          this.dialogFactory.openErrorDialog(error.error);
          this.isError.set(true);
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.escuelas.set(res._embedded?.escuelaConductorResponseDtoList || []);
            this.pageInfo.set(res.page);
            this.isLoading.set(false);
          }
        },
      });
  }

  private openConfirmUpdateDialog(id: number, nuevoEstado: number): void {
    const dialogRef = this.dialogFactory.openConfirmUpdateDialog();

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        const estadoDescripcion = nuevoEstado === 1 ? 'Con autorización' : 'Sin autorización';
        this.escuelaService.actualizarEstadoEscuela(id, nuevoEstado).subscribe({
          next: () => {
            this.escuelas.set(
              this.escuelas().map((e) => (e.id === id ? { ...e, estado: estadoDescripcion } : e))
            );
          },
          error: (error) => {
            this.dialogFactory.openErrorDialog(error.error);
          },
        });
      }
    });
  }
}
