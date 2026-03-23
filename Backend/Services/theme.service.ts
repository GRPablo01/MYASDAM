import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkMode.asObservable();

  // Observable public pour que les composants puissent s'abonner
  themeChange$ = this.darkMode.asObservable();

  
  // 🎨 Couleurs globales
  Backgroundprincipal = '';
  Backgroundcards = '';
  Textprincipal = '';
  Textsecondaire = '';
  Border = '';
  Shadow = '';

  // 🎨 Couleurs principales (PRO)
  primary = '';
  primaryHover = '';
  primarySoft = '';

  secondary = '';
  secondaryHover = '';
  secondarySoft = '';

  accent = '';
  accentHover = '';
  accentSoft = '';

  // 🎨 UI
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
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
  }

  toggleTheme() {
    const newMode = !this.darkMode.value;
    this.darkMode.next(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    this.applyTheme(newMode);
  }

  applyTheme(isDark: boolean) {
    const html = document.documentElement;

    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    this.setThemeColors(isDark);
  }

  setThemeColors(isDark: boolean): void {
    if (isDark) {
      // 🌙 DARK MODE
      this.Backgroundprincipal = '#121212';
      this.Backgroundcards = '#1E1E1E';
      this.Textprincipal = '#F5F5F5';
      this.Textsecondaire = '#B3B3B3';
  
      // 🟢 PRIMARY (rouge)
      this.primary = '#C1121F';           // ancien Rougeprincipal
      this.primaryHover = '#FF4D4D';      // ancien Rougehover
      this.primarySoft = '#2A0F12';       // ancien Rougesoftbackground
  
      // 🔵 SECONDARY (cartes / hover)
      this.secondary = '#1E1E1E';
      this.secondaryHover = '#242424';    // ancien Cardhover
      this.secondarySoft = '#2A0F12';     // ancien Sidebarlienhover
  
      // 🔵 ACCENT (optionnel pour UI)
      this.accent = '#C1121F';            // Rouge principal aussi pour accent
      this.accentHover = '#FF4D4D';       // Hover accent
      this.accentSoft = '#2A0F12';        // Soft accent
  
      // UI
      this.Bordernormal = '1px solid #2A2A2A';
      this.Borderfocus = `1px solid ${this.primary}`;  // ancien Borderfocusrouge
      this.Borderhover = '1px solid #3A3A3A';         // ancien Borderhoverdouce
  
      this.Iconnormal = '#CFCFCF';
      this.Iconhover = '#FF4D4D';
      this.Iconactive = '#C1121F';
  
      this.Fondboutonprincipal = '#FF4D4D';
      this.Fondboutonsecondaire = '#2A0F12';
  
      this.Cardhover = '#242424';
      this.Sidebarlienhover = '#2A0F12';
  
      this.ThemeImage = 'assets/LOGO.png';
  
    } else {
      // ☀️ LIGHT MODE
      this.Backgroundprincipal = '#F4F6F8';
      this.Backgroundcards = '#FFFFFF';
      this.Textprincipal = '#1A1A1A';
      this.Textsecondaire = '#555555';
  
      // 🟢 PRIMARY (rouge)
      this.primary = '#C1121F';
      this.primaryHover = '#E5383B';
      this.primarySoft = '#FDEBEC';
  
      // 🔵 SECONDARY
      this.secondary = '#FFFFFF';
      this.secondaryHover = '#F9FAFB';    // ancien Cardhover
      this.secondarySoft = '#FDEBEC';     // ancien Sidebarlienhover
  
      // 🔵 ACCENT
      this.accent = '#C1121F';
      this.accentHover = '#E5383B';
      this.accentSoft = '#FDEBEC';
  
      // UI
      this.Bordernormal = '1px solid #E5E7EB';
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
}