import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Registrer } from '../../../composant/auth/registrer/registrer';


@Component({
  selector: 'app-inscription',
  imports: [Registrer,CommonModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {


  // ✅ Variable pour simuler le chargement
  isLoaded: boolean = false;

  constructor(
    private titleService: Title,
  ) {}

  ngOnInit(): void {

    // 🧠 Titre onglet
    this.titleService.setTitle('MYASDAM | Inscription');

    // ⏳ Petit effet de chargement
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }

}