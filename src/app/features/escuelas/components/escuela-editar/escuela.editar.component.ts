import { Component, OnInit, inject, signal } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, ActivatedRoute } from "@angular/router";
import { DialogComponent } from "../../../../shared/components/dialog/dialog.component";
import { DepartamentoDto } from "../../../../shared/models/departamento.model";
import { DistritoDto } from "../../../../shared/models/distrito.model";
import { ProvinciaDto } from "../../../../shared/models/provincia.model";
import { DireccionService } from "../../../../shared/services/direccion.service";
import { EscuelaGestionService } from "../../services/escuela-gestion.service";
import { ToastrService } from "ngx-toastr";
import { ErrorDto } from "../../../../shared/models/error.model";
import {EscuelaConductorRequest} from '../../models/escuela-request.model';
import {EscuelaConductorResponse} from '../../../../shared/models/escuela-conductor-response-model';

@Component({
  selector: 'app-escuela-editar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  templateUrl: './escuela.editar.component.html',
  styleUrl: './escuela.editar.component.css',
})
export class EscuelaEditarComponent implements OnInit {
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  protected registroForm!: FormGroup;
  private escuelaService = inject(EscuelaGestionService);
  private direccionService = inject(DireccionService);
  private route = inject(ActivatedRoute);
  public departamentos = signal<DepartamentoDto[]>([]);
  public provincias = signal<ProvinciaDto[]>([]);
  public distritos = signal<DistritoDto[]>([]);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private escuelaConductorRequestDto!: EscuelaConductorRequest;
  private escuelaId!: number;
  public isLoading = signal<boolean>(false);
  private error!: ErrorDto;
  private escuelaResponse!: EscuelaConductorResponse;


  ngOnInit(): void {
    this.initForm();
    this.loadDepartamentos();
    this.obtenerIdYCargarEscuela();
  }

  private obtenerIdYCargarEscuela(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.escuelaId = +id; // número
      this.cargarEscuela(this.escuelaId);
    }
  }

  private cargarEscuela(id: number): void {
    this.isLoading.set(true);
    this.escuelaService.getEscuelaById(id).subscribe({
      next: (escuela: EscuelaConductorResponse) => {
        this.escuelaResponse = escuela;
        this.cargarDatosEnFormulario(escuela);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar la escuela:', error);
        this.isLoading.set(false);
      }
    });
  }

  initForm(): void {
    this.registroForm = this.fb.group({
      nombre: [, { validators: [Validators.required] }],
      ruc: [{ value: '', disabled: true }
        ,
        { validators: [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]+$')] }
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
        console.error('Error cargando departamentos:', error);
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

  private cargarDatosEnFormulario(escuela: EscuelaConductorResponse): void {
    const estadoValue = escuela.estado == "Con autorización"? "1" : "0";
    console.log('Estado Value: ' + estadoValue);
    this.registroForm.patchValue({
      nombre: escuela.nombreEstablecimiento,
      ruc: escuela.ruc,
      estado: estadoValue,
      direccion: {
        detalle: escuela.detalleDireccion
      }
    });

    this.cargarUbicacionPorNombres(escuela);
  }

  private cargarUbicacionPorNombres(escuela: EscuelaConductorResponse): void {
    // Buscar el departamento por nombre
    const departamento = this.departamentos().find(
      d => d.nombre.toLowerCase() === escuela.departamento.toLowerCase()
    );

    if (departamento) {
      this.registroForm.get('direccion')?.get('departamento')?.setValue(departamento.id);

      // Cargar provincias y buscar la provincia
      this.direccionService.getProvincias(departamento.id).subscribe({
        next: (provincias) => {
          this.provincias.set(provincias);
          this.registroForm.get('direccion')?.get('provincia')?.enable();

          const provincia = provincias.find(
            p => p.nombre.toLowerCase() === escuela.provincia.toLowerCase()
          );

          if (provincia) {
            this.registroForm.get('direccion')?.get('provincia')?.setValue(provincia.id);

            // Cargar distritos y buscar el distrito
            this.direccionService.getDistritos(provincia.id).subscribe({
              next: (distritos) => {
                this.distritos.set(distritos);
                this.registroForm.get('direccion')?.get('distrito')?.enable();

                const distrito = distritos.find(
                  d => d.nombre.toLowerCase() === escuela.distrito.toLowerCase()
                );

                if (distrito) {
                  this.registroForm.get('direccion')?.get('distrito')?.setValue(distrito.id);
                }
              },
              error: (error) => {
                console.error('Error loading distritos:', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error loading provincias:', error);
        }
      });
    }
  }

  actualizarEscuela():void{
    if (this.registroForm.valid) {
      const formValue = this.registroForm.value;
      this.escuelaConductorRequestDto = {
        nombreEstablecimiento: formValue.nombre,
        ruc: this.escuelaResponse.ruc,
        estado: formValue.estado,
        detalleDireccion: formValue.direccion.detalle,
        distritoId: formValue.direccion.distrito,
      };
      console.log(this.escuelaConductorRequestDto)
      this.escuelaService.actualizarEscuela(this.escuelaId, this.escuelaConductorRequestDto).subscribe({
        next: (response) => {
          this.toastr.success('Escuela actualizada exitosamente.');
          this.router.navigate(['/admin/escuelas']);
        },
        error: (error) => {
          this.toastr.error('Error al actualizar la escuela.');
        },
      });
    }
  }

  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar acción',
        mensaje: '¿Desea actualizar esta escuela?'
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.actualizarEscuela();
      }
    });
  }

    openCancelDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar acción',
        mensaje: '¿Desea cancelar el proceso de edición?'
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.router.navigate(['/admin/escuelas']);
      }
    });
  }
}

