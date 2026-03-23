import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Header } from "../../../composant/public/header/header";
import { FormsModule } from '@angular/forms';
import { Footer } from "../../../composant/share/footer/footer";
import { Fonctionalite } from "../../../composant/share/fonctionalite/fonctionalite";
import { SectionDate1 } from '../../../composant/share/section-date1/section-date1';
import { Cookie } from '../../../composant/priver/cookie/cookie';
import { Welcome } from '../../../composant/share/welcome/welcome';
import { Barre } from '../../../composant/share/barre/barre';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Mobile } from "../../../composant/share/mobile/mobile";
import { BarreScroll } from '../../../composant/share/barre-scroll/barre-scroll';

@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Header,
    FormsModule,
    Footer,
    Fonctionalite,
    SectionDate1,
    Cookie,
    Welcome,
    Barre,
    Mobile,
    BarreScroll
  ],
  templateUrl: './acceuil.html',
  styleUrls: ['./acceuil.css'],
})
export class Acceuil implements OnInit {

  // ✅ Loader
  isLoaded: boolean = false;
  userRole: string = '';

  // ✅ Connexion
  isLoggedIn: boolean = false;

  constructor(
    private titleService: Title,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // 🧠 Titre
    this.titleService.setTitle('MY ASDAM | Accueil');

    // 👤 Vérif utilisateur
    const utilisateurString = localStorage.getItem('utilisateur');
    if (utilisateurString) {
      this.isLoggedIn = true;
    }

    // 🎨 Appliquer thème depuis localStorage
    this.themeService.applyTheme(this.themeService.isDarkMode);

    // 🎯 Scrollbar dynamique inversée
    this.initScrollbar();

    // ⏳ Loader
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  /**
   * 🎯 Initialisation scrollbar dynamique avec ThemeService
   */
  private initScrollbar(): void {
    // Mettre à jour au chargement
    this.updateScrollbarColors(this.themeService.isDarkMode);

    // S'abonner aux changements de thème
    this.themeService.themeChange$.subscribe(isDark => {
      this.updateScrollbarColors(isDark);
    });
  }

  /**
   * 🎨 Met à jour les couleurs de la scrollbar (inversées)
   */
  private updateScrollbarColors(isDark: boolean): void {
    const root = document.documentElement;

    if (isDark) {

      // Mode LIGHT → appliquer les couleurs du DARK
      root.style.setProperty('--scroll-track', '#121212');       // Dark track
      root.style.setProperty('--scroll-thumb', '#C1121F');       // Dark thumb
      root.style.setProperty('--scroll-thumb-hover', '#FF4D4D'); // Dark hover
    } else {
      // Mode DARK → appliquer les couleurs du LIGHT
      root.style.setProperty('--scroll-track', '#F4F6F8');       // Light track
      root.style.setProperty('--scroll-thumb', '#C1121F');       // Light thumb
      root.style.setProperty('--scroll-thumb-hover', '#E5383B'); // Light hover
    }
  }

  /**
   * 🔹 Retourne la couleur associée à un rôle
   */
  getRoleColor(roleId: string): string {
    switch (roleId) {
      case 'admin':
        return '#F43F5E'; // rouge
      case 'user':
        return '#3B82F6'; // bleu
      case 'coach':
        return '#10B981'; // vert
      default:
        return '#6B7280'; // gris
    }
  }
}