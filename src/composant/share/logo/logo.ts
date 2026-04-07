import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './logo.html',
  styleUrls: ['./logo.css']
})
export class Logo {

  constructor(public themeService: ThemeService) {}

}