import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

interface User {
  _id?: string;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: string;
  club: string;
  theme: string;
  codeAcces?: string;
  equipe: string;
  key: string;
  status: string;
  compte: string;
  compteDesactiveTime?: string;
  notification?: any[];
  cookie?: string;
  __v?: number;
  dysListe?: string[];
}

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule,ZXingScannerModule],
  templateUrl: './info.html',
  styleUrls: ['./info.css']
})
export class Info implements OnInit {

  user: User | null = null;
  currentDate: Date = new Date();
  showScanner = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log("🚀 Info component initialisé");
    this.loadUser();
  }

  loadUser(): void {

    console.log("🔎 Vérification du localStorage...");
    console.log("📦 Contenu complet du localStorage :", localStorage);

    const userData = localStorage.getItem('utilisateur');

    console.log("📥 Donnée brute récupérée avec la clé 'utilisateur' :", userData);

    if (!userData) {
      console.warn("⚠️ Aucune donnée 'utilisateur' trouvée dans le localStorage");
      return;
    }

    try {

      const parsedUser = JSON.parse(userData);

      console.log("✅ Objet après JSON.parse :", parsedUser);

      this.user = {
        _id: parsedUser?._id ?? '',
        nom: parsedUser?.nom ?? 'non trouvé',
        prenom: parsedUser?.prenom ?? 'non trouvé',
        email: parsedUser?.email ?? 'non trouvé',
        role: parsedUser?.role ?? 'non trouvé',
        club: parsedUser?.club ?? 'non trouvé',
        theme: parsedUser?.theme ?? 'clair',
        equipe: parsedUser?.equipe ?? 'non trouvé',
        key: parsedUser?.key ?? 'non trouvé',
        status: parsedUser?.status ?? 'disponible',
        compte: parsedUser?.compte ?? 'actif',
        codeAcces: parsedUser?.codeAcces ?? '',
        compteDesactiveTime: parsedUser?.compteDesactiveTime ?? '',
        notification: parsedUser?.notification ?? [],
        cookie: parsedUser?.cookie ?? '',
        __v: parsedUser?.__v ?? 0,
        dysListe: parsedUser?.dysListe ?? []
      };

      console.log("📊 Objet user final utilisé dans Angular :", this.user);

    } catch (error) {

      console.error("❌ Erreur lors du JSON.parse :", error);
      this.user = null;

    }
  }

  trackByDysId(index: number, dys: string): string {
    return `${index}-${dys}`;
  }

  redirectToLogin(): void {
    console.log("➡️ Redirection vers la page connexion");
    this.router.navigate(['/connexion']);
  }

  hasDysTroubles(): boolean {
    return (this.user?.dysListe?.length ?? 0) > 0;
  }

  getDysCount(): number {
    return this.user?.dysListe?.length ?? 0;
  }

  openScanner() {
    this.showScanner = true;
  }

  closeScanner() {
    this.showScanner = false;
  }
  
  onCodeResult(result: string) {

    this.showScanner = false;
  
    // redirection vers une page précise avec le résultat du QR
    this.router.navigate(['/QRCode', result]);
  
  }

}