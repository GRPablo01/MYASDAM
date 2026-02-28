import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvocationService, Convocation } from '../../../../Backend/Services/convocation.service';
import { AuthService } from '../../../../Backend/Services/User/Auth.Service';

/* =========================
   INTERFACES
========================= */

interface Joueur {
  key: string;
  nom: string;
  prenom: string;
  poste?: string;
  positionField?: 'gardien' | 'defenseur' | 'milieu' | 'attaquant';
  positionIndex?: number;
}

interface Formation {
  id: string;
  name: string;
  structure: string;
  defense: number;
  midfield: number;
  attack: number;
  description: string;
}

interface StoredUser {
  id?: string;
  role: string;
  equipe: string;
  theme?: 'clair' | 'sombre';
  [key: string]: any;
}

/* =========================
   COMPONENT
========================= */

@Component({
  selector: 'app-convocations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './convocations.html',
  styleUrls: ['./convocations.css']
})
export class Convocations implements OnInit {

  /* =========================
     VARIABLES
  ========================= */

  convocations: Convocation[] = [];
  joueursEquipe: Joueur[] = [];
  joueursSelectionnes: Joueur[] = [];

  loading = false;
  showForm = false;
  message: string | null = null;

  convocationForm!: FormGroup;

  role: string = '';
  equipeUser: string = '';
  theme: 'clair' | 'sombre' = 'sombre';
  isLoggedIn = false;

  /* =========================
     MODALS
  ========================= */

  showCompoChoiceModal = false;
  showColumnCompo = false;
  showFieldCompo = false;

  /* =========================
     FORMATIONS
  ========================= */

  selectedFormation = '4-4-2';

  availableFormations: Formation[] = [
    { id: '4-4-2', name: 'Classique', structure: '4-4-2', defense: 4, midfield: 4, attack: 2, description: 'Équilibre parfait' },
    { id: '4-3-3', name: 'Offensif', structure: '4-3-3', defense: 4, midfield: 3, attack: 3, description: '3 attaquants' },
    { id: '4-5-1', name: 'Défensif', structure: '4-5-1', defense: 4, midfield: 5, attack: 1, description: 'Milieu renforcé' },
    { id: '3-5-2', name: 'Polyvalent', structure: '3-5-2', defense: 3, midfield: 5, attack: 2, description: 'Milieux offensifs' },
    { id: '5-3-2', name: 'Ultra défensif', structure: '5-3-2', defense: 5, midfield: 3, attack: 2, description: 'Mur défensif' },
    { id: '3-4-3', name: 'Tout attaque', structure: '3-4-3', defense: 3, midfield: 4, attack: 3, description: 'Pressing constant' },
    { id: '4-2-3-1', name: 'Moderne', structure: '4-2-3-1', defense: 4, midfield: 5, attack: 1, description: 'Double pivot' },
    { id: '4-1-4-1', name: 'Contre', structure: '4-1-4-1', defense: 4, midfield: 5, attack: 1, description: 'Transitions rapides' }
  ];

  get currentFormation(): Formation {
    return this.availableFormations.find(f => f.id === this.selectedFormation)
      || this.availableFormations[0];
  }

  /* =========================
     COULEURS THEME
  ========================= */

  Background = '';
  Background1 = '';
  Background2 = '';
  Background3 = '';
  Background4 = '';
  Background5 = '';
  Background6 = '';
  Background7 = '';
  Background8 = '';
  Background9 = '';
  BorderHeader = '';
  BorderHeader1 = '';
  BorderHeader2 = '';
  Text = '';
  icon = '';

  /* =========================
     CONSTRUCTOR
  ========================= */

  constructor(
    private convocationService: ConvocationService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  /* =========================
     INIT
  ========================= */

  ngOnInit(): void {
    this.loadUserFromStorage();

    this.convocationForm = this.fb.group({
      match: ['', Validators.required],
      equipe: [this.equipeUser, Validators.required],
      lieu: ['', Validators.required],
      dateMatch: ['', Validators.required],
      statut: ['Convoqué', Validators.required],
      joueur: ['', Validators.required]
    });

    this.loadConvocations();
    this.loadJoueursEquipe();
    this.setThemeColors();
  }

  /* =========================
     USER STORAGE
  ========================= */

  loadUserFromStorage(): void {
    try {
      const userString = localStorage.getItem('utilisateur');

      if (!userString) {
        const user = this.authService.getUser();
        this.role = user?.role || '';
        this.equipeUser = user?.equipe || '';
        return;
      }

      const user: StoredUser = JSON.parse(userString);

      this.role = user.role || '';
      this.equipeUser = user.equipe || '';
      this.theme = user.theme || 'sombre';
      this.isLoggedIn = true;

    } catch {
      const user = this.authService.getUser();
      this.role = user?.role || '';
      this.equipeUser = user?.equipe || '';
    }
  }

  /* =========================
     THEME
  ========================= */

  private setThemeColors(): void {

    if (!this.isLoggedIn || this.theme === 'sombre') {

      this.Background = '#1E293B';
      this.Text = '#FFFFFF';
      this.BorderHeader = '2px solid #64748B';
      this.BorderHeader1 = '2px solid #64748B';
      this.BorderHeader2 = '2px dotted #64748B';

      this.Background1 = 'linear-gradient(135deg,#6978b8,#818fd5)';
      this.Background2 = '#6978b8';
      this.Background3 = '#818fd5';
      this.Background4 = '#64748B';
      this.Background5 = '#1E293B';
      this.Background6 = '#818fd5';
      this.Background7 = '#6978b8';
      this.Background8 = '#454f7ba1';
      this.Background9 = '#505c91';
      this.icon = '#FFFFFF';

      return;
    }

    this.Background = '#FFFFFF';
    this.Text = '#000000';
    this.BorderHeader = '2px solid #A80303';
    this.BorderHeader1 = '2px solid #A80303';
    this.BorderHeader2 = '2px dotted #A80303';

    this.Background1 = 'linear-gradient(135deg,#DC2626,#BE123C)';
    this.Background2 = '#DC2626';
    this.Background3 = '#BE123C';
    this.Background4 = '#A80303';
    this.Background5 = '#FFFFFF';
    this.Background6 = '#BE123C';
    this.Background7 = '#DC2626';
    this.Background8 = '#c9c8c8b3';
    this.Background9 = '#F3F4F6';
    this.icon = '#DC2626';
  }

  /* =========================
     DATA LOADING
  ========================= */

  loadConvocations(): void {
    this.loading = true;
    this.convocationService.getConvocations().subscribe({
      next: data => {
        this.convocations = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadJoueursEquipe(): void {
    if (!this.equipeUser) return;
  
    this.authService.getAllUsers().subscribe({
      next: (users: any) => {
        // Vérifier que c'est bien un tableau
        const usersArray = Array.isArray(users) ? users : [];
  
        // Filtrer uniquement les joueurs appartenant à la même équipe que l'entraîneur connecté
        this.joueursEquipe = usersArray
          .filter(u => 
            u.role?.toLowerCase() === 'joueur' &&  // seulement les joueurs
            u.equipe === this.equipeUser          // et qui ont la même équipe que l'entraîneur connecté
          )
          .map(u => ({
            key: u.key || u._key,
            nom: u.nom,
            prenom: u.prenom,
          }));
  
        console.log('Joueurs de mon équipe :', this.joueursEquipe);
      },
      error: (err) => console.error('Erreur récupération joueurs :', err)
    });
  }
  
  
  

  /* =========================
     FORM SUBMIT
  ========================= */

  ajouterConvocation(): void {

    if (this.convocationForm.invalid || this.joueursSelectionnes.length === 0)
      return;

    const data = {
      ...this.convocationForm.value,
      joueurs: this.joueursSelectionnes.map(j => `${j.prenom} ${j.nom}`),
      formation: this.selectedFormation,
      joueursDetails: this.joueursSelectionnes
    };

    this.convocationService.createConvocation(data)
      .subscribe({
        next: () => {
          this.message = 'Convocation créée avec succès !';
          setTimeout(() => {
            this.toggleForm();
            this.loadConvocations();
          }, 1500);
        },
        error: () => this.message = 'Erreur lors de la création'
      });
  }

  /* =========================
     UTILITAIRES
  ========================= */

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  resetForm(): void {
    this.convocationForm.reset({
      statut: 'Convoqué',
      equipe: this.equipeUser
    });
    this.joueursSelectionnes = [];
    this.selectedFormation = '4-4-2';
    this.message = null;
  }

  updateFormJoueur(): void {
    const joueurString = this.joueursSelectionnes
      .map(j => `${j.prenom} ${j.nom}`)
      .join(', ');
    this.convocationForm.patchValue({ joueur: joueurString });
  }

  getInitials(joueur: Joueur): string {
    return (joueur.prenom?.[0] || '') + (joueur.nom?.[0] || '');
  }

  /* =========================
     MODALS COMPOSITION
  ========================= */

  openCompoModal(): void {
    this.showCompoChoiceModal = true;
  }

  closeCompoChoiceModal(): void {
    this.showCompoChoiceModal = false;
  }

  openColumnCompo(): void {
    this.showCompoChoiceModal = false;
    this.showColumnCompo = true;
  }

  closeColumnCompo(): void {
    this.showColumnCompo = false;
  }

  openFieldCompo(): void {
    this.showCompoChoiceModal = false;
    this.showFieldCompo = true;
  }

  closeFieldCompo(): void {
    this.showFieldCompo = false;
  }

  switchToFieldMode(): void {
    this.closeColumnCompo();
    this.openFieldCompo();
  }

  switchToColumnMode(): void {
    this.closeFieldCompo();
    this.openColumnCompo();
  }

  /* =========================
     DRAG & DROP - COLONNE
  ========================= */

  onDragStart(event: DragEvent, joueur: Joueur): void {
    if (event.dataTransfer) {
      // CORRECTION : Créer une copie profonde pour éviter les mutations
      const joueurCopy = JSON.stringify(joueur);
      event.dataTransfer.setData('application/json', joueurCopy);
      event.dataTransfer.setData('text/plain', joueurCopy); // Fallback
      event.dataTransfer.effectAllowed = 'move';
      
      // Ajouter une classe visuelle
      const target = event.target as HTMLElement;
      target.classList.add('dragging');
    }
  }

  onDragEnd(event: DragEvent): void {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    
    const data = event.dataTransfer?.getData('application/json') || event.dataTransfer?.getData('text/plain');
    if (data) {
      try {
        const joueur: Joueur = JSON.parse(data);
        this.ajouterJoueur(joueur);
      } catch (e) {
        console.error('Erreur parsing JSON:', e);
      }
    }
  }

  ajouterJoueur(joueur: Joueur): void {
    // CORRECTION : Vérifier si déjà présent et créer une copie
    if (!this.joueursSelectionnes.find(j => j.key === joueur.key)) {
      // Créer une nouvelle instance pour éviter les références partagées
      const newJoueur: Joueur = {
        ...joueur,
        positionField: undefined,
        positionIndex: undefined
      };
      this.joueursSelectionnes.push(newJoueur);
      this.updateFormJoueur();
    }
  }

  retirerJoueur(joueur: Joueur): void {
    this.joueursSelectionnes = this.joueursSelectionnes.filter(j => j.key !== joueur.key);
    this.updateFormJoueur();
  }

  validateCompo(): void {
    this.closeColumnCompo();
  }

  /* =========================
     DRAG & DROP - TERRAIN
  ========================= */

  onDropToField(event: DragEvent, position: string, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    
    const data = event.dataTransfer?.getData('application/json') || event.dataTransfer?.getData('text/plain');
    if (!data) return;

    try {
      const draggedJoueur: Joueur = JSON.parse(data);
      
      // CORRECTION : Vérifier si un joueur occupe déjà cette position
      const existingJoueur = this.getJoueurAtPosition(position, index);
      
      // CORRECTION : Retirer le joueur de sa position précédente s'il existe
      this.joueursSelectionnes = this.joueursSelectionnes.filter(j => j.key !== draggedJoueur.key);
      
      // Si un joueur occupe déjà cette position, le retirer
      if (existingJoueur && existingJoueur.key !== draggedJoueur.key) {
        this.joueursSelectionnes = this.joueursSelectionnes.filter(j => j.key !== existingJoueur.key);
      }
      
      // CORRECTION : Créer une nouvelle instance avec les propriétés de position
      const newJoueur: Joueur = {
        ...draggedJoueur,
        positionField: position as any,
        positionIndex: index
      };
      
      this.joueursSelectionnes.push(newJoueur);
      this.updateFormJoueur();
      
    } catch (e) {
      console.error('Erreur lors du drop sur le terrain:', e);
    }
  }

  ajouterJoueurField(joueur: Joueur): void {
    // CORRECTION : Toujours créer une copie pour éviter les mutations
    const existingIndex = this.joueursSelectionnes.findIndex(j => j.key === joueur.key);
    
    if (existingIndex >= 0) {
      // Mettre à jour la position si déjà présent
      this.joueursSelectionnes[existingIndex] = { ...joueur };
    } else {
      this.joueursSelectionnes.push({ ...joueur });
    }
    this.updateFormJoueur();
  }

  retirerJoueurField(joueur: Joueur): void {
    this.retirerJoueur(joueur);
  }

  onDragStartFromField(event: DragEvent, joueur: Joueur): void {
    if (event.dataTransfer) {
      const joueurCopy = JSON.stringify(joueur);
      event.dataTransfer.setData('application/json', joueurCopy);
      event.dataTransfer.setData('text/plain', joueurCopy);
      event.dataTransfer.effectAllowed = 'move';
      
      const target = event.target as HTMLElement;
      target.classList.add('dragging');
    }
  }

  getJoueurAtPosition(position: string, index: number): Joueur | undefined {
    return this.joueursSelectionnes.find(j => 
      j.positionField === position && j.positionIndex === index
    );
  }

  getAvailableJoueurs(): Joueur[] {
    // CORRECTION : Retourner seulement les joueurs qui ne sont PAS déjà sélectionnés
    return this.joueursEquipe.filter(j => 
      !this.joueursSelectionnes.some(js => js.key === j.key)
    );
  }

  countByPosition(position: string): number {
    return this.joueursSelectionnes.filter(j => j.positionField === position).length;
  }

  getRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  onFormationChange(formationId: string): void {
    this.selectedFormation = formationId;
    // CORRECTION : Réinitialiser les positions mais garder les joueurs sélectionnés
    this.joueursSelectionnes = this.joueursSelectionnes.map(j => ({
      ...j,
      positionField: undefined,
      positionIndex: undefined
    }));
    this.updateFormJoueur();
  }

  resetField(): void {
    this.joueursSelectionnes = [];
    this.updateFormJoueur();
  }

  autoFillFormation(): void {
    const available = this.getAvailableJoueurs();
    const formation = this.currentFormation;
    
    // CORRECTION : Créer des copies des joueurs pour éviter les mutations
    let index = 0;
    const newSelections = [...this.joueursSelectionnes];
    
    // Fonction utilitaire pour ajouter un joueur à une position
    const addToPosition = (position: string, posIndex: number) => {
      if (index >= available.length) return false;
      
      const joueur = available[index];
      // Vérifier si le joueur n'est pas déjà dans la sélection
      if (!newSelections.find(j => j.key === joueur.key)) {
        newSelections.push({
          ...joueur,
          positionField: position as any,
          positionIndex: posIndex
        });
        index++;
        return true;
      }
      index++;
      return false;
    };
    
    // Gardien
    addToPosition('gardien', 0);
    
    // Défenseurs
    for (let i = 0; i < formation.defense; i++) {
      addToPosition('defenseur', i);
    }
    
    // Milieux
    for (let i = 0; i < formation.midfield; i++) {
      addToPosition('milieu', i);
    }
    
    // Attaquants
    for (let i = 0; i < formation.attack; i++) {
      addToPosition('attaquant', i);
    }
    
    this.joueursSelectionnes = newSelections;
    this.updateFormJoueur();
  }

  validateFieldCompo(): void {
    this.closeFieldCompo();
  }

  // CORRECTION : Nouvelle méthode pour vérifier si une position est occupée
  isPositionOccupied(position: string, index: number): boolean {
    return this.joueursSelectionnes.some(j => 
      j.positionField === position && j.positionIndex === index
    );
  }

  // CORRECTION : Méthode pour échanger deux joueurs sur le terrain
  swapJoueurs(joueur1: Joueur, position2: string, index2: number): void {
    const joueur2 = this.getJoueurAtPosition(position2, index2);
    
    if (!joueur2) return;
    
    // Échanger les positions
    const tempPos = joueur1.positionField;
    const tempIndex = joueur1.positionIndex;
    
    joueur1.positionField = joueur2.positionField;
    joueur1.positionIndex = joueur2.positionIndex;
    
    joueur2.positionField = tempPos;
    joueur2.positionIndex = tempIndex;
    
    this.updateFormJoueur();
  }
}