import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { ConvocationService, Convocation, Joueur } from '../../../../Backend/Services/convocation.service';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-notif',
  standalone: true,
  templateUrl: './notif.html',
  styleUrls: ['./notif.css'],
  imports: [CommonModule, NgForOf, AsyncPipe]
})
export class Notif implements OnInit {
  hoverNotif = false;
  openCenter = false;
  isDark = false;
  convocations: Convocation[] = [];
  expandedConvocation: string | null = null;

  // Pour toasts
  toasts: { convocation: Convocation, isRead: boolean }[] = [];

  // Infos utilisateur
  nom = '';
  prenom = '';
  role = '';
  equipe = '';

  constructor(
    public themeService: ThemeService,
    private convocationService: ConvocationService
  ) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.loadConvocations();
  }

  loadUserFromLocalStorage() {
    const userData = localStorage.getItem('utilisateur'); 
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.nom = user.nom || '';
        this.prenom = user.prenom || '';
        this.role = user.role || '';
        this.equipe = user.equipe || '';
      } catch (err) {
        console.error(err);
      }
    }
  }

  toggleCenter() {
    this.openCenter = !this.openCenter;
  }

  toggleExpand(convId: string) {
    this.expandedConvocation = this.expandedConvocation === convId ? null : convId;
  }

  loadConvocations() {
    if (this.role !== 'joueur') {
      this.convocations = [];
      this.toasts = [];
      return;
    }
  
    this.convocationService.getConvocations().subscribe({
      next: (data) => {
        // Filtrer les convocations pour ce joueur ET non répondues
        const playerConvs = data
          .filter(conv => 
            conv.equipe === this.equipe &&
            conv.joueurs.some(j => 
              j.nom.toLowerCase() === this.nom.toLowerCase() &&
              j.prenom.toLowerCase() === this.prenom.toLowerCase() &&
              j.present === 'non_repondu' // <-- on ne prend que celles non répondues
            )
          )
          .map(conv => ({ ...conv, isRead: conv.isRead ?? false }));
  
        this.convocations = playerConvs;
  
        // Créer les toasts uniquement pour ces convocations non répondues
        this.toasts = playerConvs.map(conv => ({ convocation: conv, isRead: false }));
      },
      error: (err) => console.error(err)
    });
  }


  getConfirmationRate(conv: Convocation): number {
    const total = conv.joueurs.length;
    const confirmed = conv.joueurs.filter(j => j.present === 'oui').length;
    return total > 0 ? Math.round((confirmed / total) * 100) : 0;
  }

  getStatusLabel(status: 'oui' | 'non' | 'non_repondu'): string {
    switch (status) {
      case 'oui': return 'Présent';
      case 'non': return 'Absent';
      case 'non_repondu': return 'Pas répondu';
    }
  }

  getInitials(nom: string, prenom?: string): string {
    return (prenom ? prenom.charAt(0) : '') + (nom ? nom.charAt(0) : '');
  }

  markAllAsRead() {
    this.convocations.forEach(c => c.isRead = true);
  }

  removeToast(index: number) {
    this.toasts.splice(index, 1);
  }

  getBorderColor(conv: Convocation): string {
    const rate = this.getConfirmationRate(conv);
    if (rate >= 70) return this.themeService.BorderOui;
    if (rate >= 40) return '#facc15';
    return this.themeService.BorderNon;
  }

  getBgColor(conv: Convocation): string {
    const rate = this.getConfirmationRate(conv);
    if (rate >= 70) return this.themeService.BgOui;
    if (rate >= 40) return '#fcd34d';
    return this.themeService.BgNon;
  }

  getTextColor(conv: Convocation): string {
    const rate = this.getConfirmationRate(conv);
    if (rate >= 70) return '#ffffff';
    if (rate >= 40) return '#78350f';
    return '#ffffff';
  }

  hasUnread(): boolean {
    return this.convocations.some(c => !c.isRead);
  }

  unreadCount(): number {
    return this.convocations.filter(c => !c.isRead).length;
  }

  refreshNotifications() {
    this.loadConvocations();
  }

  openSettings() {
    console.log('Ouverture paramètres notifications');
  }
}