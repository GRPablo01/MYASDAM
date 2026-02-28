import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
  ViewChild,
  Renderer2
} from '@angular/core';

import { ActusService, Actu, Commentaire } from '.././../../../Backend/Services/actus.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Role = 'entraineur' | 'admin' | 'joueur' | 'invite';

@Component({
  selector: 'app-actus',
  templateUrl: './actus.html',
  styleUrls: ['./actus.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
})
export class Actus implements OnInit {

  // =============================
  // VARIABLES
  // =============================

  actus: Actu[] = [];

  newComment: string[] = [];
  commentSectionOpen: boolean[] = [];
  showHeartAnimation: boolean[] = [];
  menuOpen: boolean[] = [];

  userRole: Role = 'joueur';
  userNom = '';
  userPrenom = '';
  currentUserId = '';

  selectedActu: Actu | null = null;
  selectedActuForComments: Actu | null = null;

  selectedIndex = -1;
  popupMenuOpen = false;

  showAllComments = false;

  modalNewComment = '';

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  @ViewChildren('menuContainer') menuContainers!: QueryList<ElementRef>;
  @ViewChildren('commentInput') commentInputs!: QueryList<ElementRef>;
  @ViewChild('popupCommentInput') popupCommentInput!: ElementRef;

  constructor(
    private actusService: ActusService,
    private renderer: Renderer2
  ) {}

  // =============================
  // INIT
  // =============================

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.loadActus();

    this.renderer.listen('document', 'click', () => this.closeAllMenus());
  }

  // =============================
  // USER
  // =============================

  loadUserFromLocalStorage(): void {
    const userData = localStorage.getItem('utilisateur');
    if (!userData) return;

    try {
      const parsed = JSON.parse(userData);
      this.userRole = parsed.role || 'joueur';
      this.userNom = parsed.nom || '';
      this.userPrenom = parsed.prenom || '';
      this.currentUserId = parsed.id || `${this.userPrenom} ${this.userNom}`;
    } catch (e) {
      console.error('Erreur lecture localStorage user', e);
    }
  }

  // =============================
  // ACTUS
  // =============================

  loadActus(): void {
    this.actusService.getAllActus().subscribe({
      next: data => {

        this.actus = data.map(actu => {
          const [prenom, ...rest] = (actu.auteur || '').split(' ');

          return {
            ...actu,
            prenom,
            nom: rest.join(' '),
            commentaires: (actu.commentaires || []).map(c => ({
              ...c,
              userId: c.userId || c.nomComplet
            }))
          };
        });

        const length = this.actus.length;
        this.newComment = new Array(length).fill('');
        this.commentSectionOpen = new Array(length).fill(false);
        this.showHeartAnimation = new Array(length).fill(false);
        this.menuOpen = new Array(length).fill(false);
      },
      error: err => console.error('Erreur récupération actus', err)
    });
  }

  // =============================
  // LIKE
  // =============================

  likeActu(actu: Actu, index?: number): void {
    if (!actu.key) return;

    const userId = `${this.userPrenom} ${this.userNom}`;

    this.actusService.toggleLike(actu.key, userId).subscribe({
      next: res => {
        const i = this.actus.findIndex(a => a.key === actu.key);
        if (i === -1) return;

        this.actus[i].likes = res.likes;
        this.actus[i].isLiked = res.isLiked;

        if (res.isLiked && index !== undefined) {
          this.showHeartAnimation[index] = true;
          setTimeout(() => this.showHeartAnimation[index] = false, 1000);
        }
      }
    });
  }

  favoriActu(actu: Actu): void {
    if (!actu.key) return;

    const userId = `${this.userPrenom} ${this.userNom}`;

    this.actusService.toggleFavori(actu.key, userId).subscribe({
      next: res => {
        const i = this.actus.findIndex(a => a.key === actu.key);
        if (i === -1) return;

        this.actus[i].favoris = res.favoris;
        this.actus[i].isFavori = res.isFavori;
      }
    });
  }

  // =============================
  // COMMENTAIRES
  // =============================

  toggleCommentSection(actu: Actu): void {
    const index = this.actus.findIndex(a => a.key === actu.key);
    if (index === -1) return;

    this.commentSectionOpen[index] = !this.commentSectionOpen[index];

    if (this.commentSectionOpen[index]) {
      setTimeout(() => {
        this.commentInputs?.toArray()[index]?.nativeElement.focus();
      }, 300);
    }
  }

  commenterActu(actu: Actu, index: number): void {
    const contenu = this.newComment[index]?.trim();
    if (!actu.key || !contenu) return;

    const nomComplet = `${this.userPrenom} ${this.userNom}`;

    this.actusService.addCommentaire(actu.key, nomComplet, contenu).subscribe({
      next: res => {

        this.actus[index].commentaires =
          (res.data.commentaires as Commentaire[]).map(c => ({
            ...c,
            userId: c.userId || c.nomComplet
          }));

        this.newComment[index] = '';
      }
    });
  }

  canEditOrDelete(com: Commentaire): boolean {
    return (
      this.userRole === 'entraineur' ||
      this.userRole === 'admin' ||
      com.userId === this.currentUserId
    );
  }

  editComment(com: Commentaire): void {
    console.log('Modifier commentaire', com);
  }

  deleteComment(com: Commentaire): void {
    console.log('Supprimer commentaire', com);
  }

  // =============================
  // MENUS
  // =============================

  toggleMenu(index: number): void {
    this.menuOpen = this.menuOpen.map((o, i) => i === index ? !o : false);
  }

  closeAllMenus(): void {
    this.menuOpen = this.menuOpen.map(() => false);
  }

  // =============================
  // POPUP
  // =============================

  openPopup(actu: Actu, index: number): void {
    this.selectedActu = actu;
    this.selectedIndex = index;
    this.popupMenuOpen = false;
    document.body.classList.add('popup-open');

    setTimeout(() => this.popupCommentInput?.nativeElement.focus(), 100);
  }

  closePopup(): void {
    this.selectedActu = null;
    this.selectedIndex = -1;
    this.popupMenuOpen = false;
    document.body.classList.remove('popup-open');
  }

  openAllComments(actu: Actu, index: number): void {
    this.selectedActu = actu;
    this.selectedIndex = index;
    this.showAllComments = true;
    document.body.classList.add('popup-open');
  }

  closeAllComments(): void {
    this.showAllComments = false;
    document.body.classList.remove('popup-open');
  }

  openAllCommentsFromPopup(): void {
    this.showAllComments = true;
  }

  // =============================
  // UTILS
  // =============================

  getInitiales(nomComplet: string): string {
    if (!nomComplet) return '';

    const parts = nomComplet.trim().split(' ').filter(p => p.length > 0);

    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => this.showToast = false, 3000);
  }

  // =============================
  // HOST LISTENER
  // =============================

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {

    const target = event.target as HTMLElement | null;

    if (this.selectedActu && target && !target.closest('.relative')) {
      this.popupMenuOpen = false;
    }

    let clickedInside = false;

    this.menuContainers?.forEach(container => {
      if (target && container.nativeElement.contains(target)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) this.closeAllMenus();
  }
}
