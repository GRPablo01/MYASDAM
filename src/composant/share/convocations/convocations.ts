import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvocationService, Convocation } from '../../../../Backend/Services/convocation.service';
import { AuthService } from '../../../../Backend/Services/User/Auth.Service';
import { ThemeService } from '../../../../Backend/Services/theme.service';

/* =========================
   INTERFACES
========================= */

interface Joueur {
  key: string;
  nom: string;
  prenom: string;
  email?: string;
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
  ========================== */

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
  isMobile = window.innerWidth <= 970;
  hoverCard: boolean = false;

  /* =========================
     MODALS
  ========================== */

  showCompoChoiceModal = false;
  showColumnCompo = false;
  showFieldCompo = false;

  /* =========================
     FORMATIONS
  ========================== */

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
     CONSTRUCTOR
  ========================== */

  constructor(
    private convocationService: ConvocationService,
    private fb: FormBuilder,
    private authService: AuthService,
    public themeService: ThemeService
  ) {}

  /* =========================
     INIT
  ========================== */

  ngOnInit(): void {
    console.log('🔹 Convocations Component initialized');
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
  }

  /* =========================
     USER STORAGE
  ========================== */

  loadUserFromStorage(): void {
    console.log('🔹 Loading user from localStorage');
    try {
      const userString = localStorage.getItem('utilisateur');
      if (!userString) {
        console.log('⚠️ No localStorage user, fallback to AuthService');
        const user = this.authService.getUser();
        this.role = user?.role || '';
        this.equipeUser = user?.equipe || '';
        return;
      }
      const user: StoredUser = JSON.parse(userString);
      console.log('✅ User loaded from storage:', user);
      this.role = user.role || '';
      this.equipeUser = user.equipe || '';
      this.theme = user.theme || 'sombre';
      this.isLoggedIn = true;
    } catch (err) {
      console.error('❌ Error parsing user from storage:', err);
      const user = this.authService.getUser();
      this.role = user?.role || '';
      this.equipeUser = user?.equipe || '';
    }
  }

  /* =========================
     DATA LOADING
  ========================== */

  loadConvocations(): void {
    console.log('🔹 Loading convocations...');
    this.loading = true;
    this.convocationService.getConvocations().subscribe({
      next: data => {
        console.log('✅ Convocations loaded:', data);
        this.convocations = data;
        this.loading = false;
      },
      error: err => {
        console.error('❌ Error loading convocations:', err);
        this.loading = false;
      }
    });
  }

  loadJoueursEquipe(): void {
    console.log('🔹 Loading team players for equipe:', this.equipeUser);
    if (!this.equipeUser) return;
    this.authService.getAllUsers().subscribe({
      next: (users: any) => {
        const usersArray = Array.isArray(users) ? users : [];
        this.joueursEquipe = usersArray
          .filter(u => u.role?.toLowerCase() === 'joueur' && u.equipe === this.equipeUser)
          .map(u => ({
            key: u.key || u._key,
            nom: u.nom,
            prenom: u.prenom,
            email: u.email
          }));
        console.log('✅ Joueurs de mon équipe:', this.joueursEquipe);
      },
      error: err => console.error('❌ Erreur récupération joueurs :', err)
    });
  }

  /* =========================
     FORM SUBMIT
  ========================== */

  ajouterConvocation(): void {
    console.log('🔹 Adding convocation...');
    if (this.convocationForm.invalid || this.joueursSelectionnes.length === 0) {
      console.warn('⚠️ Form invalid or no players selected');
      return;
    }

    const data = {
      ...this.convocationForm.value,
      joueurs: this.joueursSelectionnes.map(j => `${j.prenom} ${j.nom}`),
      formation: this.selectedFormation,
      joueursDetails: this.joueursSelectionnes
    };
    console.log('📤 Convocation data to submit:', data);

    this.convocationService.createConvocation(data)
      .subscribe({
        next: () => {
          console.log('✅ Convocation created successfully');
          this.message = 'Convocation créée avec succès !';
          setTimeout(() => {
            this.toggleForm();
            this.loadConvocations();
          }, 1500);
        },
        error: err => {
          console.error('❌ Error creating convocation:', err);
          this.message = 'Erreur lors de la création';
        }
      });
  }

  /* =========================
     UTILITAIRES
  ========================== */

  toggleForm(): void {
    this.showForm = !this.showForm;
    console.log('🔹 toggleForm, showForm:', this.showForm);
    if (!this.showForm) this.resetForm();
  }

  resetForm(): void {
    console.log('🔹 Resetting form');
    this.convocationForm.reset({
      statut: 'Convoqué',
      equipe: this.equipeUser
    });
    this.joueursSelectionnes = [];
    this.selectedFormation = '4-4-2';
    this.message = null;
  }

  updateFormJoueur(): void {
    const joueurString = this.joueursSelectionnes.map(j => `${j.prenom} ${j.nom}`).join(', ');
    this.convocationForm.patchValue({ joueur: joueurString });
    console.log('🔹 Updated form joueur:', joueurString);
  }

  getInitials(joueur: Joueur): string {
    return (joueur.prenom?.[0] || '') + (joueur.nom?.[0] || '');
  }

  /* =========================
     MODALS COMPOSITION
  ========================== */

  openCompoModal(): void { this.showCompoChoiceModal = true; }
  closeCompoChoiceModal(): void { this.showCompoChoiceModal = false; }
  openColumnCompo(): void { this.showCompoChoiceModal = false; this.showColumnCompo = true; }
  closeColumnCompo(): void { this.showColumnCompo = false; }
  openFieldCompo(): void { this.showCompoChoiceModal = false; this.showFieldCompo = true; }
  closeFieldCompo(): void { this.showFieldCompo = false; }
  switchToFieldMode(): void { this.closeColumnCompo(); this.openFieldCompo(); }
  switchToColumnMode(): void { this.closeFieldCompo(); this.openColumnCompo(); }

  /* =========================
     DRAG & DROP - COLONNE
  ========================== */

  onDragStart(event: DragEvent, joueur: Joueur): void {
    if (event.dataTransfer) {
      const joueurCopy = JSON.stringify(joueur);
      event.dataTransfer.setData('application/json', joueurCopy);
      event.dataTransfer.setData('text/plain', joueurCopy);
      event.dataTransfer.effectAllowed = 'move';
      const target = event.target as HTMLElement;
      target.classList.add('dragging');
      console.log('🔹 Drag start joueur:', joueur);
    }
  }

  onDragEnd(event: DragEvent): void {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
    console.log('🔹 Drag end');
  }

  onDragOver(event: DragEvent): void { event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'; }
  onDragEnter(event: DragEvent): void { event.preventDefault(); (event.currentTarget as HTMLElement).classList.add('drag-over'); }
  onDragLeave(event: DragEvent): void { (event.currentTarget as HTMLElement).classList.remove('drag-over'); }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    const data = event.dataTransfer?.getData('application/json') || event.dataTransfer?.getData('text/plain');
    if (!data) return;
    try {
      const joueur: Joueur = JSON.parse(data);
      console.log('🔹 Drop joueur:', joueur);
      this.ajouterJoueur(joueur);
    } catch (e) { console.error('❌ Error parsing dropped joueur:', e); }
  }

  ajouterJoueur(joueur: Joueur): void {
    if (!this.joueursSelectionnes.find(j => j.key === joueur.key)) {
      const newJoueur: Joueur = { ...joueur, positionField: undefined, positionIndex: undefined };
      this.joueursSelectionnes.push(newJoueur);
      this.updateFormJoueur();
      console.log('✅ Joueur added:', newJoueur);
    }
  }

  retirerJoueur(joueur: Joueur): void {
    this.joueursSelectionnes = this.joueursSelectionnes.filter(j => j.key !== joueur.key);
    this.updateFormJoueur();
    console.log('✅ Joueur removed:', joueur);
  }

  validateCompo(): void { this.closeColumnCompo(); }

  /* =========================
     DRAG & DROP - TERRAIN
  ========================== */

  onDropToField(event: DragEvent, position: string, index: number): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    const data = event.dataTransfer?.getData('application/json') || event.dataTransfer?.getData('text/plain');
    if (!data) return;

    try {
      const draggedJoueur: Joueur = JSON.parse(data);
      const existingJoueur = this.getJoueurAtPosition(position, index);

      this.joueursSelectionnes = this.joueursSelectionnes.filter(j => j.key !== draggedJoueur.key);
      if (existingJoueur && existingJoueur.key !== draggedJoueur.key) {
        this.joueursSelectionnes = this.joueursSelectionnes.filter(j => j.key !== existingJoueur.key);
      }

      const newJoueur: Joueur = { ...draggedJoueur, positionField: position as any, positionIndex: index };
      this.joueursSelectionnes.push(newJoueur);
      this.updateFormJoueur();
      console.log('✅ Joueur placed on field:', newJoueur);

    } catch (e) { console.error('❌ Error dropping joueur to field:', e); }
  }

  ajouterJoueurField(joueur: Joueur): void {
    const existingIndex = this.joueursSelectionnes.findIndex(j => j.key === joueur.key);
    if (existingIndex >= 0) this.joueursSelectionnes[existingIndex] = { ...joueur };
    else this.joueursSelectionnes.push({ ...joueur });
    this.updateFormJoueur();
  }

  retirerJoueurField(joueur: Joueur): void { this.retirerJoueur(joueur); }

  onDragStartFromField(event: DragEvent, joueur: Joueur): void {
    if (event.dataTransfer) {
      const joueurCopy = JSON.stringify(joueur);
      event.dataTransfer.setData('application/json', joueurCopy);
      event.dataTransfer.setData('text/plain', joueurCopy);
      event.dataTransfer.effectAllowed = 'move';
      const target = event.target as HTMLElement;
      target.classList.add('dragging');
      console.log('🔹 Drag start from field:', joueur);
    }
  }

  getJoueurAtPosition(position: string, index: number): Joueur | undefined {
    return this.joueursSelectionnes.find(j => j.positionField === position && j.positionIndex === index);
  }

  getAvailableJoueurs(): Joueur[] {
    return this.joueursEquipe.filter(j => !this.joueursSelectionnes.some(js => js.key === j.key));
  }

  countByPosition(position: string): number {
    return this.joueursSelectionnes.filter(j => j.positionField === position).length;
  }

  getRange(n: number): number[] { return Array.from({ length: n }, (_, i) => i); }

  onFormationChange(formationId: string): void {
    console.log('🔹 Formation changed to:', formationId);
    this.selectedFormation = formationId;
    this.joueursSelectionnes = this.joueursSelectionnes.map(j => ({ ...j, positionField: undefined, positionIndex: undefined }));
    this.updateFormJoueur();
  }

  resetField(): void { this.joueursSelectionnes = []; this.updateFormJoueur(); }

  autoFillFormation(): void {
    const available = this.getAvailableJoueurs();
    const formation = this.currentFormation;
    let index = 0;
    const newSelections = [...this.joueursSelectionnes];

    const addToPosition = (position: string, posIndex: number) => {
      if (index >= available.length) return false;
      const joueur = available[index];
      if (!newSelections.find(j => j.key === joueur.key)) {
        newSelections.push({ ...joueur, positionField: position as any, positionIndex: posIndex });
        index++; return true;
      }
      index++; return false;
    };

    addToPosition('gardien', 0);
    for (let i = 0; i < formation.defense; i++) addToPosition('defenseur', i);
    for (let i = 0; i < formation.midfield; i++) addToPosition('milieu', i);
    for (let i = 0; i < formation.attack; i++) addToPosition('attaquant', i);

    this.joueursSelectionnes = newSelections;
    this.updateFormJoueur();
    console.log('✅ Auto-fill formation completed');
  }

  validateFieldCompo(): void { this.closeFieldCompo(); }

  isPositionOccupied(position: string, index: number): boolean {
    return this.joueursSelectionnes.some(j => j.positionField === position && j.positionIndex === index);
  }

  swapJoueurs(joueur1: Joueur, position2: string, index2: number): void {
    const joueur2 = this.getJoueurAtPosition(position2, index2);
    if (!joueur2) return;
    const tempPos = joueur1.positionField;
    const tempIndex = joueur1.positionIndex;
    joueur1.positionField = joueur2.positionField;
    joueur1.positionIndex = joueur2.positionIndex;
    joueur2.positionField = tempPos;
    joueur2.positionIndex = tempIndex;
    this.updateFormJoueur();
    console.log('🔹 Swapped joueurs:', joueur1, joueur2);
  }

}