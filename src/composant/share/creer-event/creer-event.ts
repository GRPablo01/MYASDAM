import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ThemeService } from '../../../../Backend/Services/theme.service';

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
  isMobile = window.innerWidth <= 970;
  hoverCard: boolean = false;

  // ================================
  // DONNÉES SELECT
  // ================================
  themes = ['Sport', 'Réunion', 'Formation', 'Autre'];
  categories = ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U19'];
  statuts = ['À Venir','En Cours','Terminé'];

  constructor(private fb: FormBuilder, private http: HttpClient,public themeService: ThemeService) {}

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
}
