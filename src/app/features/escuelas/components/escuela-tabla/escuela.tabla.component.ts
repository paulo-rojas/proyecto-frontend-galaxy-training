import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorCustomComponent } from '../../../../shared/components/paginator-custom/paginator.custom.component';
import { PageInfo } from '../../../../shared/models/page.info.model';
import {EscuelaConductorResponse} from '../../../../shared/models/escuela-conductor-response-model';

export interface EscuelaAction {
  type: 'edit' | 'delete' | 'updateStatus';
  escuela: EscuelaConductorResponse;
}

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-escuela-tabla',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './escuela.tabla.component.html',
  styleUrls: ['./escuela.tabla.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorCustomComponent}]
})
export class EscuelaTablaComponent {
  // Inputs
  escuelas = input.required<EscuelaConductorResponse[]>();
  pageInfo = input.required<PageInfo>();

  // Outputs
  action = output<EscuelaAction>();
  pageChange = output<PageEvent>();

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

  public getRowNumber(index: number): number {
    return this.pageInfo().number * this.pageInfo().size + index + 1;
  }

  public getDisplayRange(): string {
    const currentPage = this.pageInfo().number;
    const pageSize = this.pageInfo().size;
    const totalElements = this.pageInfo().totalElements;

    if (totalElements === 0) {
      return '0';
    }

    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalElements);

    return `${start}-${end}`;
  }

  public editar(escuela: EscuelaConductorResponse): void {
    this.action.emit({
      type: 'edit',
      escuela,
    });
  }

  public eliminar(escuela: EscuelaConductorResponse): void {
    this.action.emit({
      type: 'delete',
      escuela,
    });
  }

  public actualizarEstado(escuela: EscuelaConductorResponse): void {
    this.action.emit({
      type: 'updateStatus',
      escuela,
    });
  }

  public onPaginatorChange(event: any): void {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
