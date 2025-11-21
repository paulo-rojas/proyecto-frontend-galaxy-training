import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { EscuelaConductorResponseDto } from '../../escuelas/models/gestion.models';

export interface DialogData {
  escuela: EscuelaConductorResponseDto;
}

export interface DialogResult {
  tipoAutorizacion: 1 | 0;
}

@Component({
  selector: 'app-actualizar.dialog.component',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    FormsModule
  ],
  templateUrl: './actualizar.dialog.component.html',
  styleUrl: './actualizar.dialog.component.css',
})
export class ActualizarDialogComponent {
  private dialogRef = inject(MatDialogRef<ActualizarDialogComponent>);
  public data = inject<DialogData>(MAT_DIALOG_DATA);

  public tipoAutorizacion: 1 | 0 | null = null;

  public cancelar(): void {
    this.dialogRef.close();
  }

  public confirmar(): void {
    if (this.tipoAutorizacion !== null) {
      const result: DialogResult = {
        tipoAutorizacion: this.tipoAutorizacion
      };
      this.dialogRef.close(result);
    }
  }
}
