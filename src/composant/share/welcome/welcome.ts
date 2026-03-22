// welcome.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatchService, Match } from '../../../../Backend/Services/match.service';
import { Icon } from '../../priver/icon/icon';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon3 } from '../../public/icon3/icon3';




interface Utilisateur {
  nom?: string;
  prenom?: string;
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, Icon,Icon3],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome implements OnInit {

  constructor(
    private matchService: MatchService,
    public themeService: ThemeService
  ) {}

  // 🔐 Utilisateur
  utilisateur: Utilisateur | null = null;
  isLoggedIn = false;

  hoverBtn = false;
  currentTime: string = '';

  nom = '';
  prenom = '';
  initiales = '';

  // 📱 Responsive
  isMobile = false;

  // 🎠 Carrousel
  matchs: Match[] = [];
  currentMatch = 0;
  totalMatches = 0;

  ngOnInit(): void {
    this.detectMobile();
    this.loadUserInfo();
    this.loadMatchs();
  }

  detectMobile(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');

    if (storedUser) {
      try {
        this.utilisateur = JSON.parse(storedUser);
        this.isLoggedIn = true;

        this.nom = this.utilisateur?.nom || '';
        this.prenom = this.utilisateur?.prenom || '';
        this.initiales = this.getInitiales(this.nom, this.prenom);

      } catch (error) {
        console.error('Erreur parsing utilisateur :', error);
        this.utilisateur = null;
        this.isLoggedIn = false;
      }
    }
  }

  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }
  


  private loadMatchs(): void {
    this.matchService.getMatchs().subscribe({
      next: (data) => {
        this.matchs = data;
        this.totalMatches = data.length;
      },
      error: (err) => {
        console.error('Erreur récupération matchs :', err);
      }
    });
  }

  nextMatch(): void {
    if (!this.totalMatches) return;
    this.currentMatch = (this.currentMatch + 1) % this.totalMatches;
  }

  prevMatch(): void {
    if (!this.totalMatches) return;
    this.currentMatch =
      (this.currentMatch - 1 + this.totalMatches) % this.totalMatches;
  }

  goToMatch(index: number): void {
    this.currentMatch = index;
  }
}