import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from '../../../composant/public/header/header';
import { Footer } from '../../../composant/share/footer/footer';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Dash } from '../../../composant/share/dash/dash';


@Component({
  selector: 'app-dashboard',
  imports: [Header, Footer, CommonModule, Dash,HttpClientModule],
  standalone:true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  // 🎨 Thème
  theme: 'clair' | 'sombre' = 'sombre';

  constructor(
    private titleService: Title,
    private renderer: Renderer2,
    private http: HttpClient
    
  ) {}

  // ✅ Chargement
  isLoaded: boolean = false;

  ngOnInit(): void {

    // 🧠 titre onglet
    this.titleService.setTitle('MY ASDAM | Accueil');

    // 🔐 récupération thème utilisateur
    const utilisateurString = localStorage.getItem('utilisateur');

    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);
      if (utilisateur.theme) {
        this.theme = utilisateur.theme;
      }
    }

    // 🎨 appliquer couleurs
    // this.setThemeColors();
    // this.appliquerTheme();
    // this.updateScrollbarColors();

    // ⏳ effet chargement
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }

}
