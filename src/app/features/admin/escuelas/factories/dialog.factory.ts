import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../../../shared/components/dialog.component/dialog.component';
import { ErrorDialogComponent } from '../../../../shared/components/error.dialog.component/error.dialog.component';
import {
  ActualizarDialogComponent,
  DialogResult,
} from '../../dialog/actualizar.dialog.component/actualizar.dialog.component';
import { ErrorDto } from '../../../../shared/models/error.model';
import { EscuelaConductorResponseDto } from '../models/gestion.models';

export interface DialogConfig {
  width?: string;
  data?: any;
}

export interface ConfirmDialogData {
  titulo: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogFactory {
  private dialog = inject(MatDialog);

  openConfirmDialog(
    titulo: string,
    mensaje: string,
    width: string = '400px'
  ): MatDialogRef<DialogComponent, boolean> {
    return this.dialog.open(DialogComponent, {
      width,
      data: {
        titulo,
        mensaje,
      } as ConfirmDialogData,
    });
  }

  openErrorDialog(
    error: ErrorDto,
    width: string = '400px'
  ): MatDialogRef<ErrorDialogComponent> {
    return this.dialog.open(ErrorDialogComponent, {
      width,
      data: error,
    });
  }

  openDeleteEscuelaDialog(
    nombreEscuela: string
  ): MatDialogRef<DialogComponent, boolean> {
    return this.openConfirmDialog(
      'Confirmar eliminación',
      `¿Está seguro de que desea eliminar la escuela "${nombreEscuela}"? Esta acción no se puede deshacer.`
    );
  }

  openUpdateEstadoDialog(
    escuela: EscuelaConductorResponseDto,
    width: string = '500px'
  ): MatDialogRef<ActualizarDialogComponent, DialogResult | undefined> {
    return this.dialog.open(ActualizarDialogComponent, {
      width,
      data: { escuela },
    });
  }


  openConfirmUpdateDialog(): MatDialogRef<DialogComponent, boolean> {
    return this.openConfirmDialog(
      'Confirmar acción',
      '¿Desea realizar esta acción de actualización?'
    );
  }
}
