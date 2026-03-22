import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../../../Backend/Services/theme.service'; // adapte le chemin

@Component({
  selector: 'app-notif',
  standalone: true,
  templateUrl: './notif.html',
  styleUrls: ['./notif.css'],
  imports: [CommonModule]
})
export class Notif {
  hoverNotif = false;

  constructor(public themeService: ThemeService) {}

}