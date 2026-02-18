import { Component, OnInit } from '@angular/core';
import { Nav } from "../../share/nav/nav";
import { Profil } from '../../share/profil/profil';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Utilisateur {
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Nav, Profil, FormsModule, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {

  utilisateur: Utilisateur | null = null;

  // 🔹 Même logique que Profil
  userTheme: 'clair' | 'sombre' | null = null;
  theme: 'clair' | 'sombre' = 'clair';

  // 🎨 Couleurs dynamiques
  Texte = '';
  Background = '';
  Background2 = '';
  Logo = '';
  borderligne = '';

  constructor() {}

  ngOnInit(): void {
    this.loadUser();
    this.setThemeColors();
  }

  /** 🔹 Chargement utilisateur */
  private loadUser(): void {

    const utilisateurJSON = localStorage.getItem('utilisateur');

    // 🔴 NON CONNECTÉ
    if (!utilisateurJSON) {
      this.utilisateur = null;
      this.userTheme = null;
      return;
    }

    // 🟢 CONNECTÉ
    try {
      const utilisateur: Utilisateur = JSON.parse(utilisateurJSON);
      this.utilisateur = utilisateur;

      this.userTheme = utilisateur.theme || null;

      if (this.userTheme === 'clair' || this.userTheme === 'sombre') {
        this.theme = this.userTheme;
      }

    } catch (e) {
      console.error('Impossible de parser le JSON utilisateur', e);
      this.utilisateur = null;
      this.userTheme = null;
    }
  }

  /** 🎨 Gestion des thèmes */
  private setThemeColors(): void {

    // 🔴 1️⃣ NON CONNECTÉ
    if (!this.userTheme) {
      this.Background = '#1E293B';
      this.Background2 = '#334155';
      this.Texte = '#FFF';
      this.Logo = 'assets/IconGris.svg';
      this.borderligne = '#475569';
      return;
    }

    // 🌙 2️⃣ CONNECTÉ + SOMBRE
    if (this.userTheme === 'sombre') {
      this.Background = '#1E293B';
      this.Background2 = '#0F172A';
      this.Texte = '#FFF';
      this.Logo = 'assets/IconBlanc.svg';
      this.borderligne = '#334155';
    }

    // ☀️ 3️⃣ CONNECTÉ + CLAIR
    else {
      this.Background = '#FFF';
      this.Background2 = '#F1F5F9';
      this.Texte = '#1E293B';
      this.Logo = 'assets/IconBlack.svg';
      this.borderligne = '#CBD5E1';
    }
  }
}
