import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QRCodeComponent } from 'angularx-qrcode';
import { ThemeService } from '../../../../Backend/Services/theme.service';

interface UserData {
  nom: string;
  prenom: string;
  role: string;
  key: string;
  equipe: string;
  createdAt?: Date;
}

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    QRCodeComponent
  ],
  templateUrl: './user-info.html',
  styleUrl: './user-info.css',
})
export class UserInfo implements OnInit, OnDestroy {

  constructor(
    public themeService: ThemeService
  ) {}

  user: UserData | null = null;

  showQR = false;
  isCopied = false;
  private copyTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {

    const userStorage = localStorage.getItem('utilisateur');

    if (userStorage) {

      const utilisateur = JSON.parse(userStorage);

      this.user = {
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        role: utilisateur.role,
        key: utilisateur.key,
        equipe: utilisateur.equipe
      };

    }

  }

  copyToClipboard(text: string): void {

    navigator.clipboard.writeText(text).then(() => {

      console.log('Copié dans le presse-papiers');
      
      this.isCopied = true;
      
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }
      
      this.copyTimeout = setTimeout(() => {
        this.isCopied = false;
      }, 2000);

    });

  }

  openQR(): void {
    this.showQR = true;
  }

  closeQR(): void {
    this.showQR = false;
  }

  ngOnDestroy(): void {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  }

}