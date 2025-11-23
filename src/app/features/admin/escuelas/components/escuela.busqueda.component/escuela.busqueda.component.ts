import { Component, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DireccionService } from '../../../../../shared/services/direccion.service';
import { DepartamentoDto } from '../../../../../shared/models/Departamento.model';
import { ProvinciaDto } from '../../../../../shared/models/Provincia.model';
import { DistritoDto } from '../../../../../shared/models/Distrito.model';
import { PosibleDireccion } from '../../../../../shared/models/posibleDireccion.model';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { DialogFactory } from '../../factories/dialog.factory';
import { ErrorDto } from '../../../../../shared/models/error.model';

export interface SearchCriteria {
  type: 'departamento' | 'provincia' | 'distrito' | 'nombre' | 'ruc' | 'all' | 'direccion';
  value: any;
}

@Component({
  selector: 'app-escuela-busqueda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './escuela.busqueda.component.html',
  styleUrls: ['./escuela.busqueda.component.css'],
})
export class EscuelaBusquedaComponent implements OnInit {
  private direccionService = inject(DireccionService);
  private fb = inject(FormBuilder);
  private dialogFactory = inject(DialogFactory);
  private error!: ErrorDto;

  // Outputs
  search = output<SearchCriteria>();
  clear = output<void>();

  // Forms
  public selectDireccionForm!: FormGroup;
  public manualDireccionForm!: FormGroup;
  public otrosFiltrosForm!: FormGroup;

  // Signals
  public departamentos = signal<DepartamentoDto[]>([]);
  public provincias = signal<ProvinciaDto[]>([]);
  public distritos = signal<DistritoDto[]>([]);
  public direccionesFiltradas = signal<PosibleDireccion[]>([]);

  ngOnInit(): void {
    this.initForm();
    this.loadDepartamentos();
    this.setupAutocomplete();
  }

  private initForm(): void {
    this.selectDireccionForm = this.fb.group({
      departamento: [-1],
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
          this.error = error.error;
          this.error.descripcion = 'Error de conexión a la base de datos';
          this.dialogFactory.openErrorDialog(this.error);
          this.direccionesFiltradas.set([]);
        },
      });
  }

  public loadDepartamentos(): void {
    this.direccionService.getDepartamentos().subscribe({
      next: (res) => {
        this.departamentos.set(res);
      },
      error: (error) => {
        this.error = error.error;
        this.error.descripcion = 'Error de conexión a la base de datos';
        this.dialogFactory.openErrorDialog(this.error);
      }
    });
  }

  public onDepartamentoChange(departamentoId: number): void {
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

  public onProvinciaChange(provinciaId: number): void {
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

  public onDireccionSeleccionada(direccion: PosibleDireccion): void {
    this.search.emit({
      type: 'direccion',
      value: direccion,
    });
  }

  public displayFn(direccion: PosibleDireccion): string {
    return direccion ? direccion.posibleDireccion : '';
  }

  public buscar(): void {
    const tipoFiltro = this.otrosFiltrosForm.get('tipoFiltro')?.value;
    const valorFiltro = this.otrosFiltrosForm.get('valorFiltro')?.value;

    // Buscar por nombre
    if (tipoFiltro == 0 && valorFiltro) {
      this.search.emit({
        type: 'nombre',
        value: valorFiltro,
      });
      return;
    }

    // Buscar por RUC
    if (tipoFiltro == 1 && valorFiltro) {
      this.search.emit({
        type: 'ruc',
        value: valorFiltro,
      });
      return;
    }

    const departamentoId = this.selectDireccionForm.get('departamento')?.value;
    const provinciaId = this.selectDireccionForm.get('provincia')?.value;
    const distritoId = this.selectDireccionForm.get('distrito')?.value;

    if (departamentoId === -1) {
      this.search.emit({
        type: 'all',
        value: null,
      });
      return;
    }

    if (provinciaId === -1) {
      this.search.emit({
        type: 'departamento',
        value: departamentoId,
      });
      return;
    }

    if (distritoId === -1) {
      this.search.emit({
        type: 'provincia',
        value: provinciaId,
      });
      return;
    }

    if (distritoId) {
      this.search.emit({
        type: 'distrito',
        value: distritoId,
      });
      return;
    }

    if (provinciaId) {
      this.search.emit({
        type: 'provincia',
        value: provinciaId,
      });
      return;
    }

    this.search.emit({
      type: 'departamento',
      value: departamentoId,
    });
  }

  public limpiar(): void {
    this.manualDireccionForm.reset();
    this.selectDireccionForm.reset();
    this.otrosFiltrosForm.reset();
    this.provincias.set([]);
    this.distritos.set([]);
    this.selectDireccionForm.get('departamento')?.setValue(-1);
    this.selectDireccionForm.get('provincia')?.disable();
    this.selectDireccionForm.get('distrito')?.disable();
    this.clear.emit();
  }
}
