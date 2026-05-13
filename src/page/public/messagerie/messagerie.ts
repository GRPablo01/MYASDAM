import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Header } from "../../../composant/public/header/header";
import { FormsModule } from '@angular/forms';
import { Footer } from "../../../composant/share/footer/footer";
import { Cookie } from '../../../composant/priver/cookie/cookie';
import { Barre } from '../../../composant/share/barre/barre';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Mobile } from "../../../composant/share/mobile/mobile";
import { BarreScroll } from '../../../composant/share/barre-scroll/barre-scroll';
import { Fonctionalite } from '../../../composant/share/Page-Accueil/fonctionalite/fonctionalite';
import { SectionDate1 } from '../../../composant/share/Page-Accueil/section-date1/section-date1';
import { Welcome } from '../../../composant/share/Page-Accueil/welcome/welcome';
import { Message } from '../../../composant/share/Page-Message/message/message';



@Component({
  selector: 'app-messagerie',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Header,
    FormsModule,
    Footer,
    Mobile,
    Message
],
  templateUrl: './messagerie.html',
  styleUrls: ['./messagerie.css'],
})
export class Messagerie implements OnInit {

  isLoaded: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private titleService: Title,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // 🧠 Titre de la page
    this.titleService.setTitle('ASDAM | Messagerie');

    // 👤 Vérification de la connexion utilisateur
    const utilisateurString = localStorage.getItem('utilisateur');
    if (utilisateurString) this.isLoggedIn = true;

    // 🎨 Appliquer le thème depuis le ThemeService (lecture localStorage)
    this.themeService.applyTheme(this.themeService.isDarkMode);

    // 🎯 Initialisation de la scrollbar
    this.initScrollbar();

    // ⏳ Loader
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  /**
   * 🎯 Initialise la scrollbar dynamique et écoute les changements de thème
   */
  private initScrollbar(): void {
    // Couleurs initiales
    this.updateScrollbarColors(this.themeService.isDarkMode);

    // Abonnement aux changements de thème
    this.themeService.themeChange$.subscribe(isDark => {
      this.updateScrollbarColors(isDark);
    });
  }

  /**
   * 🎨 Met à jour les couleurs de la scrollbar
   */
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