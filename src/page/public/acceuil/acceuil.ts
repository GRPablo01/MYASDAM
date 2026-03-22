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
    Mobile
],
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css',
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

    // 🎯 Scrollbar dynamique
    this.updateScrollbarColors();

    // ⏳ Loader
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  /**
   * 🎯 Scrollbar dynamique avec ThemeService
   */
  updateScrollbarColors(): void {

    const root = document.documentElement;

    if (this.themeService.isDarkMode) {

      root.style.setProperty('--scroll-track', this.themeService.Backgroundprincipal);
      root.style.setProperty('--scroll-thumb', this.themeService.primary);
      root.style.setProperty('--scroll-thumb-hover', this.themeService.primaryHover);

    } else {

      root.style.setProperty('--scroll-track','');
      root.style.setProperty('--scroll-thumb', this.themeService.primary);
      root.style.setProperty('--scroll-thumb-hover', this.themeService.primaryHover);
    }
  }

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