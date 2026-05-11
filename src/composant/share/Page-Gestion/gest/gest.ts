import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-gest',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gest.html',
  styleUrl: './gest.css',
})
export class Gest {
  constructor(
    public themeService: ThemeService
  ) {}
}
