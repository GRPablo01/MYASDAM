import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/Services/theme.service'; // adapte le chemin

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrls: ['./news.css'],
})
export class News {

  hoverNews = false;
  constructor(public themeService: ThemeService) {}

}