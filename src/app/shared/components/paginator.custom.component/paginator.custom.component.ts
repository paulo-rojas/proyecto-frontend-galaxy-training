import { Component } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-paginator.custom.component',
  imports: [],
  templateUrl: './paginator.custom.component.html',
  styleUrl: './paginator.custom.component.css',
})
export class PaginatorCustomComponent implements MatPaginatorIntl {
  changes: Subject<void> = new Subject<void>();
  itemsPerPageLabel: string = 'Elementos por página';
  nextPageLabel: string = 'Página siguiente';
  previousPageLabel: string = 'Página anterior';
  firstPageLabel: string = 'Primera página';
  lastPageLabel: string = 'Última página';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Página 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  }
}

/*

REFERENCIA:
https://material.angular.dev/components/paginator/examples

*/
