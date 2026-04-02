import { Component, OnInit } from '@angular/core';
import { Convocation, ConvocationService, Joueur } from '../../../../Backend/Services/convocation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Icon3 } from '../../public/icon3/icon3';

@Component({
  selector: 'app-convo',
  templateUrl: './convo.html',
  styleUrls: ['./convo.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,Icon3]
})
export class Convo implements OnInit {

  convocations: Convocation[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  convo: Convocation | undefined;

  equipe: string = '';
  role: string = '';
  nom: string = '';
  prenom: string = '';

  constructor(
    private convocationService: ConvocationService,
    public themeservice: ThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('🚀 Initialisation du composant Convo');
    this.getUserFromLocalStorage();
    this.loadConvocations();
  }

  getUserFromLocalStorage(): void {
    const user = localStorage.getItem('utilisateur');
    console.log('📥 Lecture du localStorage pour l’utilisateur :', user);

    if (user) {
      const parsedUser = JSON.parse(user);
      this.equipe = parsedUser.equipe || '';
      this.role = parsedUser.role || '';
      this.nom = parsedUser.nom || '';
      this.prenom = parsedUser.prenom || '';
    }

    console.log('👤 Utilisateur connecté :', { equipe: this.equipe, role: this.role, nom: this.nom, prenom: this.prenom });
  }

  loadConvocations(): void {
    console.log('⏳ Chargement des convocations...');
    this.loading = true;
  
    this.convocationService.getConvocations().subscribe({
      next: (data) => {
        console.log('✅ Convocations récupérées depuis l’API :', data);
  
        const nomComplet = `${this.prenom} ${this.nom}`.toLowerCase().trim();
  
        this.convocations = data.filter(convo => {
  
          // ✅ Vérifier équipe
          const bonneEquipe = convo.equipe === this.equipe;
  
          // 🧑‍🏫 CAS 1 : ENTRAINEUR → voit toutes les convos de son équipe
          if (this.role === 'entraineur') {
            return bonneEquipe;
          }
  
          // 👤 CAS 2 : JOUEUR → doit être dans la convo
          if (this.role === 'joueur') {
            const joueurDansConvo = convo.joueurs?.some(j =>
              j.nom.toLowerCase().trim() === nomComplet
            );
  
            return bonneEquipe && joueurDansConvo;
          }
  
          // 🔒 AUTRES ROLES → rien
          return false;
        });
  
        console.log('🎯 Convocations filtrées :', this.convocations);
  
        this.convo = this.convocations[0];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération des convocations :', err);
        this.errorMessage = 'Erreur lors du chargement des convocations.';
        this.loading = false;
      }
    });
  }

  isJoueurConnecte(joueur: Joueur): boolean {
    return this.role === 'joueur' && joueur.nom === `${this.prenom} ${this.nom}`;
  }

  changerStatut(joueur: Joueur, statut: "oui" | "non" | "non_repondu") {
    if (!this.convo?._id || !joueur?.key) {
      console.error("⚠️ Clé de convocation ou clé du joueur manquante !");
      return;
    }

    const url = `http://localhost:3000/api/convocation/${this.convo._id}/joueur/${joueur.key}`;
    console.log('🔗 PUT URL:', url, 'Statut:', statut);

    this.http.put(url, { present: statut }).subscribe({
      next: (res) => {
        console.log("✅ Statut mis à jour :", res);
        joueur.present = statut;
      },
      error: (err) => console.error("❌ Erreur lors de la mise à jour du statut :", err)
    });
  }

  getTotalJoueurs(): number {
    return this.convocations.reduce((acc, convo) => acc + (convo.joueurs?.length || 0), 0);
  }

  getMatchsProchains(): number {
    const now = new Date();
    return this.convocations.filter(convo => new Date(convo.dateMatch) > now).length;
  }

  getPresentCount(convo: Convocation): number {
    return convo.joueurs?.filter(j => j.present === 'oui').length || 0;
  }

  getAbsentCount(convo: Convocation): number {
    return convo.joueurs?.filter(j => j.present === 'non').length || 0;
  }

  getInitials(nom: string): string {
    if (!nom) return '';
  
    const mots = nom.split(' ');
    
    if (mots.length === 1) {
      return mots[0].charAt(0).toUpperCase();
    }
  
    return (
      mots[0].charAt(0) + mots[mots.length - 1].charAt(0)
    ).toUpperCase();
  }

  aDejaRepondu(joueur: Joueur): boolean {
    return joueur.present === 'oui' || joueur.present === 'non';
  }
}