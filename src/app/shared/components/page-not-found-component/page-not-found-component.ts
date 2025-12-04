import { Component } from '@angular/core';
import {FooterComponent} from '../footer/footer.component';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {Header} from '../header/header';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-page-not-found-component',
  imports: [
    FooterComponent,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    Header,
    MatButton,
    RouterLink
  ],
  templateUrl: './page-not-found-component.html',
  styleUrl: './page-not-found-component.css',
})
export class PageNotFoundComponent {

}
