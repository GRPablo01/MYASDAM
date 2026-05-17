import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { EventService } from '../../../../../Backend/Services/Event.Service';

@Component({
  selector: 'app-creer-event',
  templateUrl: './creer-event.html',
  styleUrls: ['./creer-event.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class CreerEvent implements OnInit {

  showEventForm = false;
  eventForm!: FormGroup;
  message: string | null = null;

  isLoggedIn = false;
  theme: 'clair' | 'sombre' = 'clair';
  isMobile = window.innerWidth <= 970;
  currentStep = 1;

  isTitreFocused = false;
  isDescFocused = false;
  isDateFocused = false;
  isHeureDebutFocused = false;
  isHeureFinFocused = false;
  isLieuFocused = false;
  isCategorieFocused = false;
  isThemeFocused = false;
  isStatutFocused = false;

  themes = ['Sport', 'Réunion', 'Formation', 'Autre'];
  categories = ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U19'];
  statuts = ['À venir', 'En cours', 'Terminé'];

  private logUrl = 'http://localhost:3000/api/logs';
  private backendUrl = 'http://localhost:3000';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public themeService: ThemeService,
    public eventService: EventService
  ) {}

  ngOnInit(): void {

    const storedUser = localStorage.getItem('utilisateur');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.theme = user.theme === 'sombre' ? 'sombre' : 'clair';
        this.isLoggedIn = true;
      } catch (e) {
        console.error('Erreur user localStorage', e);
      }
    }

    this.eventForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      lieu: [''],
      heureDebut: [''],
      heureFin: [''],
      theme: [''],
      categorie: ['', Validators.required],
      statut: ['À Venir'],
    
      // 🔥 AJOUT ICI
      createdBy: ['']   // ou null
    });
  }

  // ================================
  // TOGGLE FORM
  // ================================
  toggleEventForm() {
    this.showEventForm = !this.showEventForm;
    this.message = null;
  }

  // ================================
  // USER CONNECTÉ
  // ================================
  getCurrentUser(): any {
    const user = localStorage.getItem('utilisateur');

    return user ? JSON.parse(user) : {
      prenom: 'Inconnu',
      nom: '',
      role: 'unknown',
      _id: null
    };
  }

  // ================================
  // CREATE EVENT + LOG
  // ================================
  creerEvent() {

    console.log('🚀 START creerEvent');

    if (this.eventForm.invalid) {
      console.warn('⚠️ Formulaire invalide:', this.eventForm.value);
      this.message = 'Veuillez remplir les champs obligatoires !';
      return;
    }

    const currentUser = this.getCurrentUser();

    console.log('👤 USER:', currentUser);

    const createdBy =
      `${currentUser.prenom || 'Inconnu'} ${currentUser.nom || ''}`.trim();

    const eventData = {
      ...this.eventForm.value,
      statut: 'À venir',
      createdBy
    };

    console.log('📤 EVENT DATA:', eventData);

    this.http.post(`${this.backendUrl}/api/events`, eventData)
      .subscribe({

        next: (res: any) => {

          console.log('✅ EVENT CREATED:', res);

          this.message = 'Événement créé avec succès !';
          this.showEventForm = false;

          this.eventForm.reset({
            statut: 'À venir'
          });

          this.currentStep = 1;

          const logData = {
            user: createdBy,
            role: currentUser.role || 'unknown',
            action: 'CREATE_EVENT',
            description: `${currentUser.role || 'Utilisateur'} a créé un événement`,
            type: 'CREATE',
            field: 'event',
            newValue: eventData,
            date: new Date()
          };

          console.log('📊 LOG DATA:', logData);

          this.http.post(this.logUrl, logData).subscribe({
            next: () => console.log('✅ LOG OK'),
            error: err => console.error('❌ LOG ERROR', err)
          });

          setTimeout(() => {
            this.message = null;
            console.log('⌛ Message supprimé');
          }, 3000);
        },

        error: (err) => {
          console.error('❌ ERROR CREATE EVENT:', err);
          console.log('STATUS:', err.status);
          console.log('BODY:', err.error);

          this.message =
            err?.error?.message ||
            err?.error?.errors ||
            'Erreur lors de la création';
        }
      });
  }
}