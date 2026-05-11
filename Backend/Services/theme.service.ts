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
  Backgroundcards1 = '';
  Backgroundcards2 = '';
  Backgroundcards = '';

  dashboardPrimary = '';
  dashboardPrimaryHover = '';
  dashboardPrimarySoft = '';

  // =======================================
  // 👥 EQUIPE / MEMORY
  // =======================================
  teamPrimary = '';
  teamPrimaryHover = '';
  teamPrimarySoft = '';

  // =======================================
  // 📋 CONVOCATION / QCM
  // =======================================
  convocationPrimary = '';
  convocationPrimaryHover = '';
  convocationPrimarySoft = '';

  // =======================================
  // 🎉 EVENT / MATCH
  // =======================================
  eventPrimary = '';
  eventPrimaryHover = '';
  eventPrimarySoft = '';

  GlassBackground = '';
  GlassBorder = '';
  GlassShadow = '';

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
  BackgroundImage: string = '';

  BgOui: string = '';
  BgNon: string = '';
  BorderOui: string = '';
  BorderNon: string = '';
  BgBleu: string = '';
  BorderBleu: string = '';
  BgBleuText: string = '';
  BgNonText: string = '';
  BgOuiText: string = '';

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
      // 🌙 DARK MODE (premium UI)
      this.Backgroundprincipal = '#0F111A';   // fond plus profond (moins bleu, plus moderne)
      this.Backgroundcards = '#1B1E2B';   // carte principale
      this.Backgroundcards1 = '#23273A';   // carte secondaire
      this.Backgroundcards2 = '#2D324A';   // carte tertiaire

      // 🌙 DARK MODE - GLASS amélioré
      this.GlassBackground = 'rgba(46, 49, 80, 0.45)'; // un peu moins opaque
      this.GlassBorder = 'rgba(255,255,255,0.15)';
      this.GlassShadow = '0 10px 40px rgba(0,0,0,0.35)';


      // =======================================
      // 🎯 DASHBOARD
      // =======================================
      this.dashboardPrimary = '#F97316';
      this.dashboardPrimaryHover = '#EA580C';
      this.dashboardPrimarySoft = '#FFEDD5';

      // =======================================
      // 👥 EQUIPE / MEMORY
      // =======================================
      this.teamPrimary = '#7C3AED';
      this.teamPrimaryHover = '#6D28D9';
      this.teamPrimarySoft = '#EDE9FE';

      // =======================================
      // 📋 CONVOCATION / QCM
      // =======================================
      this.convocationPrimary = '#16A34A';
      this.convocationPrimaryHover = '#15803D';
      this.convocationPrimarySoft = '#DCFCE7';

      // =======================================
      // 🎉 EVENT / MATCH
      // =======================================
      this.eventPrimary = '#EC4899';
      this.eventPrimaryHover = '#DB2777';
      this.eventPrimarySoft = '#FCE7F3';


      // 🔵 SECONDARY
      this.secondary = '#2563EB';
      this.secondaryHover = '#1D4ED8';
      this.secondarySoft = '#DBEAFE';


      // DARK Texte
      this.Textprincipal = '#F5F5F5';
      this.Textsecondaire = '#B3B3B3';

      // Icon
      this.Iconnormal = '#CFCFCF';
      this.Iconhover = '#FF4D4D';
      this.Iconactive = '#C1121F';

      this.BgOui = '#14532d'; // vert foncé
      this.BorderOui = '#22c55e'; // vert vif
      this.BgOuiText = '#ffffff'; // blanc (lisible sur vert foncé)

      this.BgNon = '#7f1d1d'; // rouge foncé
      this.BgNonText = '#ffffff'; // blanc (lisible sur rouge foncé)
      this.BorderNon = '#ef4444'; // rouge vif

      this.BgBleu = '#1e3a8a'; // bleu foncé (corrigé)
      this.BgBleuText = '#ffffff'; // blanc (lisible sur bleu foncé)
      this.BorderBleu = '#3b82f6'; // bleu vif (corrigé)

      // 🟢 PRIMARY (rouge)
      this.primary = '#C1121F';           // ancien Rougeprincipal
      this.primaryHover = '#FF4D4D';      // ancien Rougehover
      this.primarySoft = '#2A0F12';       // ancien Rougesoftbackground

      // // 🔵 SECONDARY (cartes / hover)
      // this.secondary = '#1E1E1E';
      // this.secondaryHover = '#242424';    // ancien Cardhover
      // this.secondarySoft = '#2A0F12';     // ancien Sidebarlienhover

      // // 🔵 ACCENT (optionnel pour UI)
      // this.accent = '#C1121F';            // Rouge principal aussi pour accent
      // this.accentHover = '#FF4D4D';       // Hover accent
      // this.accentSoft = '#2A0F12';        // Soft accent

      // UI
      // this.Bordernormal = '1px solid #E5E7EB';
      // this.Borderfocus = `1px solid ${this.primary}`;  // ancien Borderfocusrouge
      // this.Borderhover = '1px solid #3A3A3A';         // ancien Borderhoverdouce

      // this.Iconnormal = '#CFCFCF';
      // this.Iconhover = '#FF4D4D';
      // this.Iconactive = '#C1121F';

      // this.BgOui      = '#14532d'; // vert foncé
      // this.BorderOui  = '#22c55e'; // vert vif
      // this.BgOuiText  = '#ffffff'; // blanc (lisible sur vert foncé)

      // this.BgNon      = '#7f1d1d'; // rouge foncé
      // this.BgNonText  = '#ffffff'; // blanc (lisible sur rouge foncé)
      // this.BorderNon  = '#ef4444'; // rouge vif

      // this.BgBleu     = '#1e3a8a'; // bleu foncé (corrigé)
      // this.BgBleuText = '#ffffff'; // blanc (lisible sur bleu foncé)
      // this.BorderBleu = '#3b82f6'; // bleu vif (corrigé)

      // this.Fondboutonprincipal = '#FF4D4D';
      // this.Fondboutonsecondaire = '#2A0F12';

      // this.Cardhover = '#242424';
      // this.Sidebarlienhover = '#2A0F12';

      this.ThemeImage = 'assets/LOGO.png';
      this.BackgroundImage = 'assets/fondfeuillematch.png';

    } else {
      // ☀️ LIGHT MODE (premium UI)
      this.Backgroundprincipal = '#F7F8FC';   // fond blanc cassé (pas blanc pur)
      this.Backgroundcards = '#FFFFFF';   // carte principale
      this.Backgroundcards1 = '#F1F3F7';   // carte secondaire
      this.Backgroundcards2 = '#E9ECF2';   // carte tertiaire

      // ☀️ LIGHT MODE - GLASS amélioré
      this.GlassBackground = 'rgba(255, 255, 255, 0.35)';
      this.GlassBorder = 'rgba(255, 255, 255, 0.6)';
      this.GlassShadow = '0 8px 32px rgba(0,0,0,0.12)';

      // =======================================
      // 🎯 DASHBOARD
      // =======================================
      this.dashboardPrimary = '#F97316';
      this.dashboardPrimaryHover = '#EA580C';
      this.dashboardPrimarySoft = '#FFEDD5';

      // =======================================
      // 👥 EQUIPE / MEMORY
      // =======================================
      this.teamPrimary = '#7C3AED';
      this.teamPrimaryHover = '#6D28D9';
      this.teamPrimarySoft = '#EDE9FE';

      // =======================================
      // 📋 CONVOCATION / QCM
      // =======================================
      this.convocationPrimary = '#16A34A';
      this.convocationPrimaryHover = '#15803D';
      this.convocationPrimarySoft = '#DCFCE7';

      // =======================================
      // 🎉 EVENT / MATCH
      // =======================================
      this.eventPrimary = '#EC4899';
      this.eventPrimaryHover = '#DB2777';
      this.eventPrimarySoft = '#FCE7F3';


      // ☀️ LIGHT TEXTE
      this.Textprincipal = '#1A1A1A';
      this.Textsecondaire = '#555555';


      // Icon
      this.Iconnormal = '#444444';
      this.Iconhover = '#C1121F';
      this.Iconactive = '#C1121F';


      // 🔵 Validation Convo
      this.BgOui = '#dcfce7';     // vert très clair
      this.BgNon = '#fee2e2';     // rouge très clair
      this.BorderOui = '#22c55e';     // vert vif
      this.BorderNon = '#ef4444';     // rouge vif

      this.BgOuiText = '#14532d';     // vert foncé (lisible sur vert très clair)
      this.BgNonText = '#7f1d1d';     // rouge foncé (lisible sur rouge très clair)

      this.BgBleu = '#dbeafe';     // bleu très clair (cohérent avec les autres)
      this.BgBleuText = '#1e3a8a';     // bleu foncé (lisible sur bleu très clair)
      this.BorderBleu = '#3b82f6';     // bleu vif


      // 🟢 PRIMARY (rouge)
      this.primary = '#C1121F';
      this.primaryHover = '#E5383B';
      this.primarySoft = '#FDEBEC';

      // 🔵 SECONDARY
      this.secondary = '#dbeafe';
      this.secondaryHover = '#1e3a8a';    // ancien Cardhover
      this.secondarySoft = '#3b82f6';     // ancien Sidebarlienhover

      // // 🔵 ACCENT
      // this.accent = '#C1121F';
      // this.accentHover = '#E5383B';
      // this.accentSoft = '#FDEBEC';

      // // 🔵 Validation Convo
      // this.BgOui      = '#dcfce7';     // vert très clair
      // this.BgNon      = '#fee2e2';     // rouge très clair
      // this.BorderOui  = '#22c55e';     // vert vif
      // this.BorderNon  = '#ef4444';     // rouge vif

      // this.BgOuiText  = '#14532d';     // vert foncé (lisible sur vert très clair)
      // this.BgNonText  = '#7f1d1d';     // rouge foncé (lisible sur rouge très clair)

      // this.BgBleu     = '#dbeafe';     // bleu très clair (cohérent avec les autres)
      // this.BgBleuText = '#1e3a8a';     // bleu foncé (lisible sur bleu très clair)
      // this.BorderBleu = '#3b82f6';     // bleu vif


      // // UI
      // this.Bordernormal = '1px solid #2A2A2A ';
      // this.Borderfocus = `1px solid ${this.primary}`;
      // this.Borderhover = '1px solid #D1D5DB';

      // this.Iconnormal = '#444444';
      // this.Iconhover = '#C1121F';
      // this.Iconactive = '#C1121F';

      // this.Fondboutonprincipal = '#E5383B';
      // this.Fondboutonsecondaire = '#FDEBEC';

      // this.Cardhover = '#F9FAFB';
      // this.Sidebarlienhover = '#FDEBEC';

      this.ThemeImage = 'assets/LOGO.png';
      this.BackgroundImage = 'assets/fondfeuillematch.png';
    }
  }

  get isDarkMode() {
    return this.darkMode.value;
  }
}