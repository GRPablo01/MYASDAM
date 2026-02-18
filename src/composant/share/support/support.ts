import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Icon } from '../../priver/icon/icon';



interface Utilisateur {
  _id: string;
  nom: string;
  role: string;
  theme: 'clair' | 'sombre';
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './support.html',
  styleUrls: ['./support.css'],
})
export class Support implements OnInit {

  // Couleurs et thème
  text: string = '';
  rouge: string = '';
  background: string = '';
  theme: 'clair' | 'sombre' = 'clair';
  Logo: string = '';
  Forme: string = '';

  Header: string = '';
  Header2: string = '';
  Background: string = '';
  BoutonP: string = '';
  BoutonS: string = '';
  Titre: string = '';
  Texte: string = '';
  Cartes: string = '';
  Bordures: string = '';
  Succes: string = '';
  Erreur: string = '';
  Info: string = '';

  // Hover
  hoverSupport: boolean = false;

  ngOnInit() {
    this.loadUserInfo();
  }

  /**
   * Récupère l'utilisateur depuis le localStorage
   */
  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');

    if (!storedUser) {
      // console.log('Pas d’utilisateur trouvé dans le localStorage. Thème par défaut : clair');
      this.theme = 'clair';
      this.setThemeColors();
      return;
    }

    try {
      const userObj: Utilisateur = JSON.parse(storedUser);

      if (userObj.theme === 'clair' || userObj.theme === 'sombre') {
        this.theme = userObj.theme;
      } else {
        this.theme = 'clair';
      }

      // console.log('Utilisateur récupéré depuis le localStorage :', userObj);
      // console.log('Theme appliqué :', this.theme);

    } catch (error) {
      console.error('Erreur parsing utilisateur depuis localStorage :', error);
      this.theme = 'clair';
    }

    this.setThemeColors();
  }

  /** Définit les couleurs selon le thème */
  private setThemeColors(): void {
    if (this.theme === 'sombre') {
      this.Header = '#020617';
      this.Header2 = '#6978b8';
      this.Texte = '#FFFFFF';
      this.Logo = 'assets/IconBlanc.svg';
    } else {
      this.Header = '#F43F5E';
      this.Header2 = '#BE123C';
      this.Texte = '#000000';
      this.Logo = 'assets/IconBlack.svg';
    }
  }
  /**
   * Change le thème et met à jour le localStorage
   */
  toggleTheme() {
    this.theme = this.theme === 'clair' ? 'sombre' : 'clair';
    this.setThemeColors();
    this.updateUserLocalStorage();
    // console.log('Thème après toggle :', this.theme);
  }

  /**
   * Met à jour le thème dans le localStorage
   */
  private updateUserLocalStorage(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const userObj = JSON.parse(storedUser);
      userObj.theme = this.theme;
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (error) {
      console.error('Erreur mise à jour thème dans localStorage :', error);
    }
  }

  /**
   * Gestion du hover
   */
  onHover(etat: boolean) {
    this.hoverSupport = etat;
    this.text = etat ? '#FFF' : (this.theme === 'sombre' ? '#FFF' : '#000');
  }
}
