import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ErrorDto } from '../../models/error.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-error-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './error.dialog.component.html',
  styleUrl: './error.dialog.component.css',
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDto
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
