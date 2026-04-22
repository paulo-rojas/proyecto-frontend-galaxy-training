import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-page-not-found-component',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './page-not-found-component.html',
  styleUrl: './page-not-found-component.css',
})
export class PageNotFoundComponent {

}
