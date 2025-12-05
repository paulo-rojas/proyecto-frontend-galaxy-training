import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-navbar',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './public.navbar.component.html',
  styleUrl: './public.navbar.component.css',
})
export class PublicNavbarComponent {

  showLoginButton = input<boolean>(true);

}
