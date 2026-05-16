// =========================
// AJOUTER EQUIPE COMPONENT
// =========================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../../priver/icon/icon';

@Component({
  selector: 'app-ajouter-equipe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    Icon
  ],
  templateUrl: './ajouter-equipe.html',
  styleUrls: ['./ajouter-equipe.css']
})
export class AjouterEquipe implements OnInit {

  // =========================
  // FORM
  // =========================
  equipeForm: FormGroup;

  // =========================
  // UI STATE
  // =========================
  showForm = false;
  showEventForm = false;
  isDragging = false;
  hoverCard = false;
  isMobile = window.innerWidth <= 970;
  closing = false;

  // =========================
  // IMAGE
  // =========================
  logoPreview: string | null = null;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  uploadError: string | null = null;

  // =========================
  // NOTIFICATION
  // =========================
  showNotification = false;
  notificationMessage = '';

  // =========================
  // AUTH / THEME
  // =========================
  isLoggedIn = false;
  theme: 'clair' | 'sombre' = 'clair';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public themeService: ThemeService
  ) {

    this.equipeForm = this.fb.group({
      nom: ['', Validators.required],
      logo: [null, Validators.required],
      saison: ['2026', Validators.required]
    });
  }

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    const storedUser = localStorage.getItem('utilisateur');

    if (storedUser) {
      const user = JSON.parse(storedUser);

      this.isLoggedIn = true;
      this.theme = user.theme === 'sombre' ? 'sombre' : 'clair';
    }
  }

  // =========================
  // TOGGLE FORM
  // =========================
  toggleForm(): void {

    this.showForm = !this.showForm;

    if (!this.showForm) {
      this.resetForm();
    }
  }

  closeForm(): void {
    this.closing = true;

    setTimeout(() => {
      this.showForm = false;
      this.closing = false;
      this.resetForm();
    }, 450);
  }

  private resetForm(): void {
    this.equipeForm.reset({ saison: '2026' });

    this.logoPreview = null;
    this.selectedFile = null;
    this.selectedFileName = null;
    this.uploadError = null;
    this.notificationMessage = '';
  }

  // =========================
  // FILE INPUT
  // =========================
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.handleFile(file);
  }

  // =========================
  // DRAG EVENTS
  // =========================
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    this.handleFile(file);
  }

  // =========================
  // IMAGE HANDLER (PNG ONLY)
  // =========================
  private handleFile(file: File): void {

    this.uploadError = null;

    // ❌ pas une image
    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Veuillez sélectionner une image valide';
      return;
    }

    // ❌ pas PNG
    if (file.type !== 'image/png') {
      this.uploadError = 'Seules les images PNG sont autorisées';
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;

    this.equipeForm.patchValue({
      logo: file
    });

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  // =========================
  // REMOVE IMAGE
  // =========================
  removePreview(): void {
    this.logoPreview = null;
    this.selectedFile = null;
    this.selectedFileName = null;

    this.equipeForm.patchValue({ logo: null });
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

  // =========================
  // AJOUT EQUIPE
  // =========================
  ajouterEquipe(): void {

    if (this.equipeForm.invalid) {
      this.showToast('Veuillez remplir tous les champs');
      return;
    }

    const file: File = this.equipeForm.get('logo')?.value;

    if (!file) {
      this.showToast('Veuillez ajouter un logo');
      return;
    }

    if (file.type !== 'image/png') {
      this.showToast('Le logo doit être au format PNG uniquement');
      return;
    }

    const formData = new FormData();

    formData.append('nom', this.equipeForm.get('nom')?.value);
    formData.append('saison', this.equipeForm.get('saison')?.value);
    formData.append('logo', file);

    this.http.post('http://localhost:3000/api/equipes', formData)
      .subscribe({

        next: (res: any) => {
          this.showToast(res.message || 'Équipe ajoutée avec succès');

          this.resetForm();

          setTimeout(() => {
            this.toggleForm();
          }, 1200);
        },

        error: (err) => {
          console.error(err);
          this.showToast('Erreur lors de l’ajout de l’équipe');
        }

      });
  }
}