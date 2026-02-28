import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Header } from "../../../composant/public/header/header";
import { FormsModule } from '@angular/forms';
import { Footer } from "../../../composant/share/footer/footer";
import { Welcome } from '../../../composant/share/welcome/welcome';
import { Fonctionalite } from "../../../composant/share/fonctionalite/fonctionalite";
import { SectionDate1 } from '../../../composant/share/section-date1/section-date1';
import { Cookie } from '../../../composant/priver/cookie/cookie';
import { Actus } from '../../../composant/share/actus/actus';

@Component({
  selector: 'app-actualite',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Header,
    FormsModule,
    Footer,
    Actus
    
  ],
  templateUrl: './actualite.html',
  styleUrl: './actualite.css',
})
export class Actualite implements OnInit {

  // ✅ Chargement
  isLoaded: boolean = false;

  // ✅ Connexion
  isLoggedIn: boolean = false;

  // 🎨 Thème
  theme: 'clair' | 'sombre' = 'sombre';

  // 🎨 Couleurs dynamiques
  Background = '';
  Background1 = '';
  Background2 = '';
  Background3 = '';
  Background4 = '';
  Background5 = '';
  Background6 = '';
  Background7 = '';
  Background8 = '';
  Background9 = '';
  Background10 = '';
  Background11 = '';
  Background12 = '';
  BorderHeader = '';
  BorderHeader1 = '';
  BorderHeader2 = '';
  BorderHeader3 = '';
  Text = '';
  Text1 = '';
  Text2 = '';

  constructor(
    private titleService: Title,
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    // 🧠 Titre onglet
    this.titleService.setTitle('MY ASDAM | Actualité');

    const utilisateurString = localStorage.getItem('utilisateur');

    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);

      this.isLoggedIn = true;

      if (utilisateur.theme) {
        this.theme = utilisateur.theme;
      }
    }

    // 🎨 Appliquer couleurs
    this.setThemeColors();
    this.updateScrollbarColors();

    // ⏳ Loader
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  // 🎯 Scrollbar dynamique
  updateScrollbarColors(): void {

    const root = document.documentElement;

    if (this.theme === 'sombre') {

      root.style.setProperty('--scroll-track', '#1E293B');
      root.style.setProperty('--scroll-thumb', '#6978b8');
      root.style.setProperty('--scroll-thumb-hover', '#ec4899');

    } else {

      root.style.setProperty('--scroll-track', '#FFFFFF');
      root.style.setProperty('--scroll-thumb', '#F43F5E');
      root.style.setProperty('--scroll-thumb-hover', '#f59e0b');

    }
  }
  /**
   * 🎨 Gestion des thèmes
   */
  private setThemeColors(): void {

    // 🔴 NON CONNECTÉ
    if (!this.isLoggedIn) {

      this.Background  = '#1E293B';
      this.Background1 = '#6978b8';

      return;
    }

    // 🌙 CONNECTÉ + SOMBRE
    if (this.theme === 'sombre') {

      this.Background  = '#1E293B';
      this.Background1 = '#6978b8';
      

      return;
    }

    // ☀️ CONNECTÉ + CLAIR

    this.Background  = '#FFFFFF';
    this.Background1 = '#DC2626';

  }
}
