import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ThemeService } from '../../../../../Backend/Services/theme.service';


interface User {
  nom?: string;
  prenom?: string;
  email?: string;
  role?: string;
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-creer-actus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './creer-actus.html',
  styleUrls: ['./creer-actus.css'],
})
export class CreerActus implements OnInit {

  message: string | null = null;
  showForm = false;
  actusForm!: FormGroup;

  // =========================
  // NOTIFICATION
  // =========================
  showNotification = false;
  notificationMessage = '';

  isMobile = window.innerWidth <= 970;
  hoverCard: boolean = false;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile!: File;

  isLoggedIn = true;
  theme: 'clair' | 'sombre' = 'sombre';
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('utilisateur');

    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.isLoggedIn = true;
      this.theme = this.currentUser?.theme ?? 'sombre';
    } else {
      this.isLoggedIn = false;
      this.theme = 'sombre';
    }

    // ✅ Formulaire avec description
    this.actusForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      saison: ['2026', Validators.required],
      image: [null]
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;

    if (!this.showForm) {
      this.actusForm.reset();
      this.actusForm.patchValue({ saison: '2026' });
      this.imagePreview = null;
      this.message = null;
    }
  }

  // =========================
  // TOAST
  // =========================
  showToast(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 4000);
  }

  closeNotification(): void {
    this.showNotification = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    this.actusForm.patchValue({ image: file });
    this.actusForm.get('image')?.markAsTouched();
    this.actusForm.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

 // =========================
// LOG URL
// =========================
private logUrl = 'http://localhost:3000/api/logs';

// =========================
// USER CONNECTÉ
// =========================
getCurrentUser(): any {
  const user = localStorage.getItem('utilisateur');

  return user ? JSON.parse(user) : {
    prenom: 'Inconnu',
    nom: '',
    role: 'unknown'
  };
}

// ======================================
// CREATE ACTUS + LOG + TOAST
// ======================================
ajouterActus(): void {

  if (this.actusForm.invalid || !this.selectedFile) return;

  const formData = new FormData();

  const auteurNomComplet = this.currentUser
    ? `${this.currentUser.prenom || ''} ${this.currentUser.nom || ''}`.trim()
    : '';

  formData.append('titre', this.actusForm.value.titre);
  formData.append('description', this.actusForm.value.description);
  formData.append('auteur', auteurNomComplet);
  formData.append('saison', this.actusForm.value.saison);
  formData.append('image', this.selectedFile);

  this.http.post<any>('http://localhost:3000/api/actus', formData)
    .subscribe({

      next: (res: any) => {

        // =========================
        // TOAST SUCCESS
        // =========================
        this.notificationMessage = res.message || 'Actu créée avec succès !';
        this.showNotification = true;

        setTimeout(() => {
          this.showNotification = false;
        }, 3000);

        setTimeout(() => this.toggleForm(), 2000);

        // =========================
        // LOG ACTUS CREATE
        // =========================
        const currentUser = this.getCurrentUser();

        const logData = {
          user: `${currentUser.prenom || 'Inconnu'} ${currentUser.nom || ''}`,
          role: currentUser.role || 'unknown',
          action: 'CREATE_ACTUS',
          description: `${currentUser.role || 'Utilisateur'} a créé une actu`,
          type: 'CREATE',
          field: 'actu',
          newValue: {
            titre: this.actusForm.value.titre,
            description: this.actusForm.value.description,
            auteur: auteurNomComplet,
            saison: this.actusForm.value.saison
          },
          date: new Date()
        };

        this.http.post(this.logUrl, logData).subscribe({
          next: () => console.log('✅ Log actus créé'),
          error: (err) => console.error('❌ Erreur log actus', err)
        });
      },

      error: () => {
        this.notificationMessage = 'Erreur création actus';
        this.showNotification = true;

        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    });
}
}