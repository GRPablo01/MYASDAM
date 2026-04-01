import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Composants
import { Header } from "../../../composant/public/header/header";
import { Footer } from "../../../composant/share/footer/footer";
import { Mobile } from "../../../composant/share/mobile/mobile";
import { CardsMatch } from '../../../composant/share/cards-match/cards-match';
import { ThemeService } from '../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Header,
    FormsModule,
    Footer,
    CardsMatch,
    Mobile,
  ],
  templateUrl: './match.html',
  styleUrls: ['./match.css'],
})
export class Match implements OnInit {

  isLoaded: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private titleService: Title,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Titre page
    this.titleService.setTitle('MY ASDAM | Match');

    // Vérification connexion
    const utilisateurString = localStorage.getItem('utilisateur');
    if (utilisateurString) this.isLoggedIn = true;

    // Abonnement au thème (clair / sombre)
    this.themeService.themeChange$.subscribe(isDark => {
      document.documentElement.classList.toggle('dark', isDark);
      this.updateScrollbarColors(isDark);
      console.log('Thème actif:', isDark ? 'Sombre' : 'Clair');
    });

    // Scrollbars au chargement
    this.updateScrollbarColors(this.themeService.isDarkMode);

    // Loader 300ms
    setTimeout(() => this.isLoaded = true, 300);
  }

  private updateScrollbarColors(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--scroll-track', '#1E1E1E');
      root.style.setProperty('--scroll-thumb', '#C1121F');
      root.style.setProperty('--scroll-thumb-hover', '#FF4D4D');
    } else {
      root.style.setProperty('--scroll-track', '#FFFFFF');
      root.style.setProperty('--scroll-thumb', '#C1121F');
      root.style.setProperty('--scroll-thumb-hover', '#E5383B');
    }
  }
}