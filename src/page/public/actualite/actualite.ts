import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-actualite',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './actualite.html',
  styleUrl: './actualite.css',
})
export class Actualite {

  // ✅ Chargement
  isLoaded: boolean = false;

  // 🎨 Thème
  theme: 'clair' | 'sombre' = 'sombre';
  background: string = '';
  background2!: string;
  text!: string;
  Image!: string;

  constructor(
    private titleService: Title,
    private renderer: Renderer2,
    private http: HttpClient
    
  ) {}


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
