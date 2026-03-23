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

  isLoaded: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private titleService: Title,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('MY ASDAM | Accueil');

    const utilisateurString = localStorage.getItem('utilisateur');
    if (utilisateurString) this.isLoggedIn = true;

    // ✅ S'abonner au thème et mettre à jour scrollbar
    this.themeService.themeChange$.subscribe(isDark => {
      document.documentElement.classList.toggle('dark', isDark);
      this.updateScrollbarColors(isDark);
      console.log('Thème actif:', isDark ? 'Sombre' : 'Clair');
    });

    // ⚡ Scrollbar au chargement
    this.updateScrollbarColors(this.themeService.isDarkMode);

    // ⏳ Loader
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