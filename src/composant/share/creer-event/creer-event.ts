import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  // ================================
  // GESTION UTILISATEUR / THEME
  // ================================
  isLoggedIn = false;
  theme: 'clair' | 'sombre' = 'clair';

  // ================================
  // COULEURS DYNAMIQUES
  // ================================
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
  icon = '';
  BorderHeader = '';
  BorderHeader1 = '';
  BorderHeader2 = '';
  Text = '';

  // ================================
  // DONNÉES SELECT
  // ================================
  themes = ['Sport', 'Réunion', 'Formation', 'Autre'];
  categories = ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U19'];
  statuts = ['À Venir','En Cours','Terminé'];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {

    // ================================
    // RECUPERATION UTILISATEUR
    // ================================
    const storedUser = localStorage.getItem('utilisateur');
  
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
  
        if (user.theme === 'sombre' || user.theme === 'clair') {
          this.theme = user.theme;
        }
  
        this.isLoggedIn = true;
  
      } catch (error) {
        console.error('Erreur parsing utilisateur localStorage', error);
      }
    } else {
      this.isLoggedIn = false;
    }
  
    // Appliquer les couleurs
    this.setThemeColors();
  
    // ================================
    // INITIALISATION FORMULAIRE
    // ================================
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
      createdBy: ['', Validators.required]
    });
  }
  

  // ================================
  // AFFICHER / MASQUER FORMULAIRE
  // ================================
  toggleEventForm() {
    this.showEventForm = !this.showEventForm;
    this.message = null;
  }

  // ================================
  // CREATION EVENEMENT
  // ================================
  creerEvent() {

    if (this.eventForm.invalid) {
      this.message = 'Veuillez remplir les champs obligatoires !';
      Object.keys(this.eventForm.controls).forEach(key => {
        const controlErrors = this.eventForm.get(key)?.errors;
        if (controlErrors) console.warn(`Erreur sur ${key} :`, controlErrors);
      });
      return;
    }

    const formData = { ...this.eventForm.value };

    if (formData.date) {
      formData.date = new Date(formData.date).toISOString();
    }

    this.http.post('http://localhost:3000/api/events/create', formData).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Événement créé avec succès !';
        this.eventForm.reset({ statut: 'À Venir' });
        this.showEventForm = false;
        setTimeout(() => this.message = null, 3000);
      },
      error: (err) => {
        console.error('Erreur création événement :', err);
        this.message = err?.error?.message || 'Erreur lors de la création de l’événement';
      }
    });
  }

  // ================================
  // GESTION COULEURS THEME
  // ================================
  private setThemeColors(): void {

    // ================================
    // THEME SOMBRE
    // ================================
    if (!this.isLoggedIn || this.theme === 'sombre') {

      this.Background = '#1E293B';
      this.BorderHeader = '2px solid #64748B';
      this.Text = '#FFFFFF';

      this.Background1 = 'linear-gradient(135deg,#6978b8,#818fd5)';

      this.Background2 = '#6978b8';
      this.Background3 = '#818fd5';
      this.Background4 = '#64748B';

      this.Background5 = '#1E293B';
      this.icon = '#FFFFFF';

      this.Background6 = '#818fd5';
      this.Background7 = '#6978b8';

      this.Background8 = '#454f7ba1';

      this.BorderHeader1 = '2px solid #64748B';

      this.Background9 = '#505c91';

      this.BorderHeader2 = '2px dotted #64748B';

      return;
    }

    // ================================
    // THEME CLAIR
    // ================================
    this.Background = '#FFFFFF';
    this.BorderHeader = '2px solid #A80303';
    this.Text = '#000000';

    this.Background1 = 'linear-gradient(135deg,#DC2626,#BE123C)';

    this.Background2 = '#DC2626';
    this.Background3 = '#BE123C';
    this.Background4 = '#A80303';

    this.Background5 = '#FFFFFF';
    this.icon = '#DC2626';

    this.Background6 = '#BE123C';
    this.Background7 = '#DC2626';

    this.Background8 = '#c9c8c8b3';

    this.BorderHeader1 = '2px solid #A80303';

    this.Background9 = '#F3F4F6';

    this.BorderHeader2 = '2px dotted #A80303';
  }
}
