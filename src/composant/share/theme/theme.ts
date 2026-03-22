import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/Services/theme.service';


@Component({
  selector: 'app-theme',
  standalone: true,
  templateUrl: './theme.html',
  styleUrls: ['./theme.css'],
  imports: [CommonModule]
})
export class Theme {
  hover = false;

  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}