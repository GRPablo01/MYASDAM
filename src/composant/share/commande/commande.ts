import { Component } from '@angular/core';
import { AjouterEquipe } from '../ajouter-equipe/ajouter-equipe';
import { CreerMatch } from '../creer-match/creer-match';
import { CreerEvent } from "../creer-event/creer-event";
import { Convocations } from '../convocations/convocations';
import { CreerActus } from "../creer-actus/creer-actus";

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [AjouterEquipe, CreerMatch, CreerEvent, Convocations, CreerActus],
  templateUrl: './commande.html',
  styleUrl: './commande.css',
})
export class Commande {


  cardWidth = 0;
  gap = 24;
  currentIndex = 0;
  totalSlides = 5;

  next() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

}
