import { 
  Component, 
  HostListener, 
  OnInit, 
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AjouterEquipe } from '../ajouter-equipe/ajouter-equipe';
import { CreerMatch } from '../creer-match/creer-match';
import { CreerEvent } from "../creer-event/creer-event";
import { Convocations } from '../convocations/convocations';
import { CreerActus } from "../creer-actus/creer-actus";

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    AjouterEquipe, 
    CreerMatch, 
    CreerEvent, 
    Convocations, 
    CreerActus
  ],
  templateUrl: './commande.html',
  styleUrls: ['./commande.css'],
})
export class Commande{
}