import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../priver/icon/icon';

interface Notification {
  message: string;
  date: Date;
  unread?: boolean;
}

@Component({
  selector: 'app-notif',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
  templateUrl: './notif.html',
  styleUrls: ['./notif.css'],
})
export class Notif implements OnInit {

  // Couleurs en dur
  Header = '#F43F5E';   // Rouge clair
  Header2 = '#BE123C';  // Rouge foncé
  Texte = '#000000';    // Noir
  Logo = 'assets/IconBlack.svg';
  BleuBG = '#FFFFFF';   // Fond blanc du panneau
  Bleu1 = '#F43F5E';    // Bouton
  Bleu2 = '#BE123C';    // Bordures / accents
  rouge = '#DC2626';    // Suppression

  hoverNotif = false;
  showMessages = false;

  notifications: Notification[] = [
    { message: 'Nouvelle demande d’amis', date: new Date(), unread: true },
    { message: 'Cours ajouté', date: new Date(), unread: true },
    { message: 'Exercice corrigé', date: new Date(), unread: true },
  ];

  ngOnInit() {}

  toggleNotif() {
    this.showMessages = !this.showMessages;
  }

  markAllRead() {
    this.notifications.forEach(n => n.unread = false);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-container')) {
      this.showMessages = false;
    }
  }

  deleteNotification(notification: Notification) {
    this.notifications = this.notifications.filter(n => n !== notification);
  }

  getLabelColor(label: string) {
    switch (label) {
      case 'info': return '#3B82F6';      // bleu
      case 'alerte': return '#F59E0B';    // orange
      default: return '#6B7280';           // gris
    }
  }
}
