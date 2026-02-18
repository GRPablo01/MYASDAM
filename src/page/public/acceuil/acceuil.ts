import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Welcome } from "../../../composant/share/welcome/welcome";
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { Header } from "../../../composant/public/header/header";
import { FormsModule } from '@angular/forms';
import { Footer } from "../../../composant/share/footer/footer";

@Component({
  selector: 'app-acceuil',
  standalone:true,
  imports: [CommonModule, Welcome, HttpClientModule, Header, FormsModule, Footer],
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css',
})
export class Acceuil {

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
