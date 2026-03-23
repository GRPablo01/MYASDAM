import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode = new BehaviorSubject<boolean>(false);
  themeChange$ = this.darkMode.asObservable();

  // 🎨 Couleurs globales et UI
  Backgroundprincipal = '';
  Backgroundcards = '';
  Textprincipal = '';
  Textsecondaire = '';
  Border = '';
  Shadow = '';
  primary = '';
  primaryHover = '';
  primarySoft = '';
  secondary = '';
  secondaryHover = '';
  secondarySoft = '';
  accent = '';
  accentHover = '';
  accentSoft = '';
  Bordernormal = '';
  Borderfocus = '';
  Borderhover = '';
  Iconnormal = '';
  Iconhover = '';
  Iconactive = '';
  Fondboutonprincipal = '';
  Fondboutonsecondaire = '';
  Cardhover = '';
  Sidebarlienhover = '';
  ThemeImage: string = '';

  constructor() {
    // Lire le thème stocké dans localStorage
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
    console.log('ThemeService initial:', isDark ? 'Sombre' : 'Clair');
  }

  // 🔄 Toggle thème via bouton
  toggleTheme() {
    const newMode = !this.darkMode.value;
    this.darkMode.next(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    this.applyTheme(newMode);
    console.log('ThemeService toggled:', newMode ? 'Sombre' : 'Clair');
  }

  // Appliquer la classe et couleurs
  applyTheme(isDark: boolean) {
    document.documentElement.classList.toggle('dark', isDark);
    this.setThemeColors(isDark);
  }

  setThemeColors(isDark: boolean): void {
    if (isDark) {
      // 🌙 DARK
      this.Backgroundprincipal = '#121212';
      this.Backgroundcards = '#1E1E1E';
      this.Textprincipal = '#F5F5F5';
      this.Textsecondaire = '#B3B3B3';
      this.primary = '#C1121F';
      this.primaryHover = '#FF4D4D';
      this.primarySoft = '#2A0F12';
      this.secondary = '#1E1E1E';
      this.secondaryHover = '#242424';
      this.secondarySoft = '#2A0F12';
      this.accent = '#C1121F';
      this.accentHover = '#FF4D4D';
      this.accentSoft = '#2A0F12';
      this.Bordernormal = '1px solid #E5E7EB';
      this.Borderfocus = `1px solid ${this.primary}`;
      this.Borderhover = '1px solid #3A3A3A';
      this.Iconnormal = '#CFCFCF';
      this.Iconhover = '#FF4D4D';
      this.Iconactive = '#C1121F';
      this.Fondboutonprincipal = '#FF4D4D';
      this.Fondboutonsecondaire = '#2A0F12';
      this.Cardhover = '#242424';
      this.Sidebarlienhover = '#2A0F12';
      this.ThemeImage = 'assets/LOGO.png';
    } else {
      // ☀️ LIGHT
      this.Backgroundprincipal = '#F4F6F8';
      this.Backgroundcards = '#FFFFFF';
      this.Textprincipal = '#1A1A1A';
      this.Textsecondaire = '#555555';
      this.primary = '#C1121F';
      this.primaryHover = '#E5383B';
      this.primarySoft = '#FDEBEC';
      this.secondary = '#FFFFFF';
      this.secondaryHover = '#F9FAFB';
      this.secondarySoft = '#FDEBEC';
      this.accent = '#C1121F';
      this.accentHover = '#E5383B';
      this.accentSoft = '#FDEBEC';
      this.Bordernormal = '1px solid #2A2A2A ';
      this.Borderfocus = `1px solid ${this.primary}`;
      this.Borderhover = '1px solid #D1D5DB';
      this.Iconnormal = '#444444';
      this.Iconhover = '#C1121F';
      this.Iconactive = '#C1121F';
      this.Fondboutonprincipal = '#E5383B';
      this.Fondboutonsecondaire = '#FDEBEC';
      this.Cardhover = '#F9FAFB';
      this.Sidebarlienhover = '#FDEBEC';
      this.ThemeImage = 'assets/LOGO.png';
    }
  }

  get isDarkMode() {
    return this.darkMode.value;
  }

  // Pour reset thème à la déconnexion
  resetTheme() {
    this.darkMode.next(false);
    localStorage.removeItem('theme');
    this.applyTheme(false);
  }
}