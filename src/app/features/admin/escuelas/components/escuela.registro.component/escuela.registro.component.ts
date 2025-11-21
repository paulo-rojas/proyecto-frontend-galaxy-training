import { Component, inject, OnInit, signal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DireccionService } from '../../../../../shared/services/direccion.service';
import { DepartamentoDto } from '../../../../../shared/models/Departamento.model';
import { ProvinciaDto } from '../../../../../shared/models/Provincia.model';
import { DistritoDto } from '../../../../../shared/models/Distrito.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../../shared/components/dialog.component/dialog.component';

import { EscuelaService } from '../../services/escuela-service';
import { ErrorDto } from '../../../../../shared/models/error.model';
import { EscuelaConductorRequestDto } from '../../models/gestion.models';
import { ErrorDialogComponent } from '../../../../../shared/components/error.dialog.component/error.dialog.component';

@Component({
  selector: 'app-escuela-registro',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './escuela.registro.component.html',
  styleUrls: ['./escuela.registro.component.css'],
})
export class EscuelaRegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected registroForm!: FormGroup;
  private errorDto!: ErrorDto;
  private escuelaService = inject(EscuelaService);
  private direccionService = inject(DireccionService);
  public departamentos = signal<DepartamentoDto[]>([]);
  public provincias = signal<ProvinciaDto[]>([]);
  public distritos = signal<DistritoDto[]>([]);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private escuelaConductorRequestDto!: EscuelaConductorRequestDto;

  ngOnInit(): void {
    this.initForm();
    this.loadDepartamentos();
  }

  initForm(): void {
    this.registroForm = this.fb.group({
      nombre: [, { validators: [Validators.required] }],
      ruc: [
        ,
        {
          validators: [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern('^[0-9]+$'),
          ],
        },
      ],
      estado: [, { validators: [Validators.required] }],
      direccion: this.fb.group({
        detalle: [, { validators: [Validators.required] }],
        departamento: [{ value: '', disabled: false }, { validators: [Validators.required] }],
        provincia: [{ value: '', disabled: true }, { validators: [Validators.required] }],
        distrito: [{ value: '', disabled: true }, { validators: [Validators.required] }],
      }),
    });
  }

  loadDepartamentos(): void {
    this.distritos.set([]);
    this.provincias.set([]);
    this.registroForm.get('direccion')?.get('provincia')?.setValue('');
    this.registroForm.get('direccion')?.get('provincia')?.disable();
    this.registroForm.get('direccion')?.get('distrito')?.setValue('');
    this.registroForm.get('direccion')?.get('distrito')?.disable();
    this.direccionService.getDepartamentos().subscribe({
      next: (departamentos) => {
        this.departamentos.set(departamentos);
      },
      error: (error) => {
        console.error('Error loading departamentos:', error);
      },
    });
  }

  loadProvincias(departamentoId: number): void {
    this.registroForm.get('direccion')?.get('provincia')?.enable();
    this.distritos.set([]);
    this.registroForm.get('direccion')?.get('distrito')?.disable();
    this.direccionService.getProvincias(departamentoId).subscribe({
      next: (provincias) => {
        this.provincias.set(provincias);
      },
      error: (error) => {
        console.error('Error loading provincias:', error);
      },
    });
  }

  loadDistritos(provinciaId: number): void {
    this.registroForm.get('direccion')?.get('distrito')?.enable();
    this.direccionService.getDistritos(provinciaId).subscribe({
      next: (distritos) => {
        this.distritos.set(distritos);
      },
      error: (error) => {
        console.error('Error loading distritos:', error);
      },
    });
  }

  registrarEscuela(): void {
    if (this.registroForm.valid) {
      const formValue = this.registroForm.value;
      this.escuelaConductorRequestDto = {
        nombreEstablecimiento: formValue.nombre,
        ruc: formValue.ruc,
        estado: formValue.estado,
        detalleDireccion: formValue.direccion.detalle,
        distritoId: formValue.direccion.distrito,
      };
      console.log('Escuela a registrar:', this.escuelaConductorRequestDto);
      this.escuelaService.crearEscuela(this.escuelaConductorRequestDto).subscribe({
        next: (response) => {
          console.log('Escuela registrada con éxito:', response);
          this.router.navigate(['/admin/escuelas']);
        },
        error: (error) => {
          this.errorDto = error.error;
          this.openErrorDialog(this.errorDto);
        },
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  openErrorDialog(error: ErrorDto): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '400px',
      data: error,
    });
  }
  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar acción',
        mensaje: '¿Desea agregar esta escuela?',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.registrarEscuela();
        this.router.navigate(['/admin/escuelas']);
      } else {
        alert('Usuario canceló');
      }
    });
  }

  openCancelDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar acción',
        mensaje: '¿Desea cancelar el proceso de registro?',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        // USUARIO CONFIRMÓ LA CANCELACIÓN
        this.router.navigate(['/admin/escuelas']);
      } else {
        alert('Usuario canceló');
      }
    });
  }
}
