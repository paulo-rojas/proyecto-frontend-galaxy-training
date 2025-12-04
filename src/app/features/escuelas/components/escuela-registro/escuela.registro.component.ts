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
import { DireccionService } from '../../../../shared/services/direccion.service';
import { DepartamentoDto } from '../../../../shared/models/departamento.model';
import { ProvinciaDto } from '../../../../shared/models/provincia.model';
import { DistritoDto } from '../../../../shared/models/distrito.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';

import { EscuelaGestionService } from '../../services/escuela-gestion.service';
import { ErrorDto } from '../../../../shared/models/error.model';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error.dialog.component';
import { MatRadioModule } from "@angular/material/radio";
import {EscuelaConductorRequest} from '../../models/escuela-request.model';

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
    MatRadioModule
],
  templateUrl: './escuela.registro.component.html',
  styleUrls: ['./escuela.registro.component.css'],
})
export class EscuelaRegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected registroForm!: FormGroup;
  private errorDto!: ErrorDto;
  private escuelaService = inject(EscuelaGestionService);
  private direccionService = inject(DireccionService);
  public departamentos = signal<DepartamentoDto[]>([]);
  public provincias = signal<ProvinciaDto[]>([]);
  public distritos = signal<DistritoDto[]>([]);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private escuelaConductorRequestDto!: EscuelaConductorRequest;

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
    console.log('=== INICIANDO REGISTRO DE ESCUELA ===');
    console.log('Formulario válido?', this.registroForm.valid);

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
      console.log('Llamando al servicio...');

      this.escuelaService.crearEscuela(this.escuelaConductorRequestDto).subscribe({
        next: (response) => {
          console.log('✅ Escuela registrada con éxito:', response);
          this.router.navigate(['/admin/escuelas']);
        },
        error: (error) => {
          console.error('❌ Error al registrar escuela:', error);
          console.error('Error completo:', JSON.stringify(error, null, 2));
          this.errorDto = error.error;
          this.openErrorDialog(this.errorDto);
        },
        complete: () => {
          console.log('=== SUBSCRIPTION COMPLETED ===');
        }
      });

      console.log('Suscripción creada');
    } else {
      console.log('❌ Formulario inválido');
      console.log('Errores del formulario:', this.registroForm.errors);
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        if (control && control.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
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
