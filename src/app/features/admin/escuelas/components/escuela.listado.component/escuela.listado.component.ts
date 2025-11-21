import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscuelaService } from '../../services/escuela-service';
import {
  EscuelaConductorResponseDto,
  PageInfo,
  PagedEscuelasResponse,
} from '../../models/gestion.models';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DireccionService } from '../../../../../shared/services/direccion.service';
import { DepartamentoDto } from '../../../../../shared/models/Departamento.model';
import { MatSelectModule } from '@angular/material/select';
import { DistritoDto } from '../../../../../shared/models/Distrito.model';
import { ProvinciaDto } from '../../../../../shared/models/Provincia.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, switchMap, startWith, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PosibleDireccion } from '../../../../../shared/models/posibleDireccion.model';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  ActualizarDialogComponent,
  DialogResult,
} from '../../../dialog/actualizar.dialog.component/actualizar.dialog.component';
import { DialogComponent } from '../../../../../shared/components/dialog.component/dialog.component';
import { ErrorDto } from '../../../../../shared/models/error.model';
import { ErrorDialogComponent } from '../../../../../shared/components/error.dialog.component/error.dialog.component';

@Component({
  selector: 'app-escuela-listado',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  templateUrl: './escuela.listado.component.html',
  styleUrls: ['./escuela.listado.component.css'],
})
export class EscuelaListadoComponent implements OnInit {
  private escuelaService = inject(EscuelaService);
  private direccionService = inject(DireccionService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  public error!: ErrorDto;
  public selectDireccionForm!: FormGroup;
  public manualDireccionForm!: FormGroup;
  public otrosFiltrosForm!: FormGroup;
  public isLoading = signal<boolean>(false);
  public isError = signal<boolean>(false);
  public escuelas = signal<EscuelaConductorResponseDto[]>([]);
  public pageInfo = signal<PageInfo>({
    size: 10,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  });
  public displayedColumns: string[] = [
    'numero',
    'nombreEstablecimiento',
    'ruc',
    'estado',
    'detalleDireccion',
    'distrito',
    'provincia',
    'departamento',
    'acciones',
  ];
  public departamentos = signal<DepartamentoDto[]>([]);
  public provincias = signal<ProvinciaDto[]>([]);
  public distritos = signal<DistritoDto[]>([]);
  public pageSizeOptions: number[] = [5, 10, 25, 50];
  public direccionesFiltradas = signal<PosibleDireccion[]>([]);

  ngOnInit(): void {
    this.initForm();
    this.loadDepartamentos();
    this.setupAutocomplete();
  }

  private initForm(): void {
    this.selectDireccionForm = this.fb.group({
      departamento: [-1], // Valor inicial -1 para "Todos"
      provincia: [{ value: null, disabled: true }],
      distrito: [{ value: null, disabled: true }],
    });
    this.manualDireccionForm = this.fb.group({
      direccion: [''],
    });
    this.otrosFiltrosForm = this.fb.group({
      tipoFiltro: [0],
      valorFiltro: [''],
    });
  }

  private setupAutocomplete(): void {
    this.manualDireccionForm
      .get('direccion')!
      .valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        switchMap((valor) => {
          if (typeof valor === 'string' && valor.length >= 2) {
            return this.direccionService.getPosiblesDirecciones(valor);
          }
          this.direccionesFiltradas.set([]);
          return [];
        })
      )
      .subscribe({
        next: (direcciones) => {
          this.direccionesFiltradas.set(direcciones);
        },
        error: (error) => {
          console.error('Error al buscar direcciones:', error);
          this.direccionesFiltradas.set([]);
        },
      });
  }

  //
  // <mat-option value="0">Nombre de Escuela</mat-option>
  // <mat-option value="1">RUC</mat-option>
  // <mat-option value="2">Estado</mat-option>

  public buscar(): void {
    if (this.otrosFiltrosForm.get('tipoFiltro')?.value) {
      console.log(this.otrosFiltrosForm.get('tipoFiltro')?.value);
      if (this.otrosFiltrosForm.get('tipoFiltro')?.value == 0) {
        const nombreEscuela = this.otrosFiltrosForm.get('valorFiltro')?.value;
        this.ejecutarBusqueda(this.escuelaService.getEscuelaByNombre(nombreEscuela));
        console.log('Buscando por nombre de escuela:', nombreEscuela);
        return;
      }

      if (this.otrosFiltrosForm.get('tipoFiltro')?.value == 1) {
        const rucEscuela = this.otrosFiltrosForm.get('valorFiltro')?.value;
        this.isLoading.set(true);
        this.isError.set(false);

        this.escuelaService.getEscuelaByRuc(rucEscuela).subscribe({
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
            console.error('Error al buscar escuela por RUC:', error);
            this.isError.set(true);
            this.isLoading.set(false);
          },
        });
        return;
      }
    }
    const departamentoId = this.selectDireccionForm.get('departamento')?.value;
    const provinciaId = this.selectDireccionForm.get('provincia')?.value;
    const distritoId = this.selectDireccionForm.get('distrito')?.value;

    if (departamentoId === -1) {
      this.ejecutarBusqueda(this.escuelaService.getEscuelas());
      return;
    }

    if (provinciaId === -1) {
      this.ejecutarBusqueda(this.escuelaService.getEscuelaByDepartamento(departamentoId));
      return;
    }

    if (distritoId === -1) {
      this.ejecutarBusqueda(this.escuelaService.getEscuelaByProvincia(provinciaId));
      return;
    }

    // Buscar por distrito (más específico)
    if (distritoId) {
      this.ejecutarBusqueda(this.escuelaService.getEscuelaByDistrito(distritoId));
      return;
    }

    // Buscar por provincia
    if (provinciaId) {
      this.ejecutarBusqueda(this.escuelaService.getEscuelaByProvincia(provinciaId));
      return;
    }

    // Buscar por departamento (menos específico)
    this.ejecutarBusqueda(this.escuelaService.getEscuelaByDepartamento(departamentoId));
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
        console.error('Error al buscar escuelas:', error);
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  public limpiar() {
    // Reset del formulario
    this.manualDireccionForm.reset();
    this.selectDireccionForm.reset();
    this.otrosFiltrosForm.reset();

    // Limpiar las listas de provincias y distritos
    this.provincias.set([]);
    this.distritos.set([]);

    this.escuelas.set([]);

    // Deshabilitar provincia y distrito
    this.selectDireccionForm.get('departamento')?.setValue(-1);
    this.selectDireccionForm.get('provincia')?.disable();
    this.selectDireccionForm.get('distrito')?.disable();
  }

  public loadDepartamentos(): void {
    this.direccionService.getDepartamentos().subscribe({
      next: (res) => {
        this.departamentos.set(res);
      },
    });
  }

  public onDepartamentoChange(departamentoId: number) {
    if (!departamentoId || departamentoId === -1) {
      this.selectDireccionForm.get('provincia')?.disable();
      this.selectDireccionForm.get('distrito')?.disable();
      this.provincias.set([]);
      this.distritos.set([]);
      return;
    }
    this.direccionService.getProvincias(departamentoId).subscribe({
      next: (res) => {
        this.provincias.set(res);
        this.selectDireccionForm.get('provincia')?.enable();
        this.selectDireccionForm.get('provincia')?.setValue(-1);
        this.selectDireccionForm.get('distrito')?.disable();
        this.distritos.set([]);
      },
    });
  }

  public onProvinciaChange(provinciaId: number) {
    if (!provinciaId || provinciaId === -1) {
      this.selectDireccionForm.get('distrito')?.disable();
      this.distritos.set([]);
      return;
    }
    this.direccionService.getDistritos(provinciaId).subscribe({
      next: (res) => {
        this.distritos.set(res);
        this.selectDireccionForm.get('distrito')?.enable();
        this.selectDireccionForm.get('distrito')?.setValue(-1);
      },
    });
  }

  public getRowNumber(index: number): number {
    return this.pageInfo().number * this.pageInfo().size + index + 1;
  }

  public editar(escuela: EscuelaConductorResponseDto): void {
    this.router.navigate(['/admin/escuelas/editar', escuela.id]);
  }

  public eliminar(escuela: EscuelaConductorResponseDto): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar eliminación',
        mensaje: `¿Está seguro de que desea eliminar la escuela "${escuela.nombreEstablecimiento}"? Esta acción no se puede deshacer.`,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.escuelaService.eliminarEscuela(escuela.id).subscribe({
          next: () => {
            alert('Escuela eliminada con éxito.');
            this.escuelas.set(this.escuelas().filter((e) => e.id !== escuela.id));
          },
          error: (error) => {
            this.error = error.error;
            this.openErrorDialog(this.error);
          },
        });
      }
    });
  }

  public actualizarEstado(escuela: EscuelaConductorResponseDto): void {
    const dialogRef = this.dialog.open(ActualizarDialogComponent, {
      width: '500px',
      data: { escuela },
    });

    dialogRef.afterClosed().subscribe((result: DialogResult | undefined) => {
      if (result) {
        this.openConfirmUpdateDialog(escuela.id, result.tipoAutorizacion);
      }
    });
  }

  public displayFn(direccion: PosibleDireccion): string {
    return direccion ? direccion.posibleDireccion : '';
  }

  public onDireccionSeleccionada(direccion: PosibleDireccion): void {
    this.isLoading.set(true);
    this.selectDireccionForm.get('departamento')?.setValue(direccion.departamentoId);
    this.direccionService
      .getProvincias(direccion.departamentoId)
      .pipe(
        tap((provincias) => {
          this.provincias.set(provincias);
          this.selectDireccionForm.get('provincia')?.enable();
          this.selectDireccionForm.get('provincia')?.setValue(direccion.provinciaId);
        }),
        switchMap(() => this.direccionService.getDistritos(direccion.provinciaId)),
        tap((distritos) => {
          this.distritos.set(distritos);
          this.selectDireccionForm.get('distrito')?.enable();
          this.selectDireccionForm.get('distrito')?.setValue(direccion.distritoId);
        }),
        switchMap(() => this.escuelaService.getEscuelaByDistrito(direccion.distritoId)),
        catchError((error) => {
          console.error('Error al cargar datos:', error);
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

  public openConfirmUpdateDialog(id: number, nuevoEstado: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar acción',
        mensaje: '¿Desea realizar esta acción de actualización?',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        const estadoDescripcion = nuevoEstado === 1 ? 'Con autorización' : 'Sin autorización';
        this.escuelaService.actualizarEstadoEscuela(id, nuevoEstado).subscribe({
          next: () => {
            this.escuelas.set(this.escuelas().map(e => e.id === id ? { ...e, estado: estadoDescripcion } : e));
          },
          error: (error) => {
            this.error = error.error;
            this.openErrorDialog(this.error);
          },
        });
      } else {
        alert('Usuario canceló');
      }
    });
  }

  openErrorDialog(error: ErrorDto): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '400px',
      data: error,
    });
  }
}
