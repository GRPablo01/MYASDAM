import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Login } from '../../../composant/auth/login/login';

@Component({
  selector: 'app-connexion',
  imports: [Login,CommonModule],
  standalone:true,
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {


  // ✅ Variable pour simuler le chargement
  isLoaded: boolean = false;

  constructor(
    private titleService: Title,
  ) {}

  ngOnInit(): void {

    // 🧠 Titre onglet
    this.titleService.setTitle('MYASDAM | Connexion');

    // ⏳ Petit effet de chargement
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }

}
