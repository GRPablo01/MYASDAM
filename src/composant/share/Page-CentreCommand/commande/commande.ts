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
import { CreerEvent } from '../creer-event/creer-event';
import { Convocations } from '../convocations/convocations';
import { CreerActus } from '../creer-actus/creer-actus';
import { CreerMatch } from '../creer-match/creer-match';
import { ThemeService } from '../../../../../Backend/Services/theme.service';


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
export class Commande {

  constructor(public themeService: ThemeService) { }


  items: string[] = [
    'team',
    'match',
    'event',
    'actus',
    'convocation'
  ];

  paginatedItems: string[] = [];
  isHover = false
  isNextHover = false
  currentPage = 0;
  itemsPerPage = 4;

  totalPages = 0;

  gridClass = 'grid-cols-4'; // desktop par défaut

  ngOnInit() {
    this.updateLayout();
    this.paginate();
    window.addEventListener('resize', () => this.updateLayout());
  }

  updateLayout() {
    const width = window.innerWidth;

    // Desktop
    if (width >= 1280) {
      this.itemsPerPage = 4;
      this.gridClass = 'grid-cols-4';
    }

    // Laptop
    else if (width >= 1024) {
      this.itemsPerPage = 3;
      this.gridClass = 'grid-cols-3';
    }

    // Tablette
    else if (width >= 768) {
      this.itemsPerPage = 3;
      this.gridClass = 'grid-cols-3';
    }

    // Mobile
    else {
      this.itemsPerPage = 4;
      this.gridClass = 'grid-cols-1';
    }

    this.paginate();
  }

  paginate() {
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);

    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.paginatedItems = this.items.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.paginate();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.paginate();
    }
  }
}