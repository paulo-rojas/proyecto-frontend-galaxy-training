import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-admin-home',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHomeComponent {

}
