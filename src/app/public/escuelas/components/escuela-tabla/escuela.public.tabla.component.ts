import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { PaginatorCustomComponent } from '../../../../shared/components/paginator-custom/paginator.custom.component';
import {PageInfo} from '../../../../shared/models/page.info.model';
import {EscuelaConductorResponse} from '../../../../shared/models/escuela-conductor-response-model';

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-escuela-public-tabla',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './escuela.public.tabla.component.html',
  styleUrl: './escuela.public.tabla.component.css',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorCustomComponent}]
})
export class EscuelaPublicTablaComponent {
  // Inputs
  escuelas = input.required<EscuelaConductorResponse[]>();
  pageInfo = input.required<PageInfo>();

  // Outputs
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

  public onPaginatorChange(event: any): void {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
