import { Component } from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-page-not-found-component',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButtonModule,
    RouterLink,
    MatIcon
  ],
  templateUrl: './page-not-found-component.html',
  styleUrl: './page-not-found-component.css',
})
export class PageNotFoundComponent {

}
