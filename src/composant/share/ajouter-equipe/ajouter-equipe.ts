// ajouter-equipe.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ThemeService } from '../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-ajouter-equipe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './ajouter-equipe.html',
  styleUrls: ['./ajouter-equipe.css']
})
export class AjouterEquipe implements OnInit {

  // Formulaire
  showEventForm = false;
  equipeForm: FormGroup;
  showForm: boolean = false;
  logoPreview: string | ArrayBuffer | null = null;

  // Message de succès ou erreur
  message: string | null = null;
  selectedFile: File | null = null;
  isMobile = window.innerWidth <= 970;
  hoverCard: boolean = false;
  // Auth / Theme
  isLoggedIn = false;
  theme: 'clair' | 'sombre' = 'clair';

  
  
  

  constructor(private fb: FormBuilder, private http: HttpClient,
    public themeService:ThemeService,
  ) {
    // Initialisation du formulaire
    this.equipeForm = this.fb.group({
      nom: ['', Validators.required],
      logo: [null, Validators.required],
      saison: ['2026', Validators.required]
    });
  }

  ngOnInit(): void {
    // Récupérer le thème depuis le localStorage si l'utilisateur est connecté
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.isLoggedIn = true;
      this.theme = user.theme === 'sombre' ? 'sombre' : 'clair';
    }
  }

  // Toggle du formulaire modal
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.equipeForm.reset({ saison: '2026' });
      this.message = null;
      this.logoPreview = null;
    }
  }

  // Gestion du fichier logo
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file) {
      this.equipeForm.patchValue({ logo: file });

      // Aperçu
      const reader = new FileReader();
      reader.onload = () => this.logoPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  isDragging = false;
selectedFileName: string | null = null;

onFileDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    this.handleFile(files[0]);
  }
}



private handleFile(file: File) {
  this.selectedFileName = file.name;
  // Votre logique existante...
}
  

  removePreview(): void {
    this.logoPreview = null;
    this.equipeForm.patchValue({ logo: null });
  }

  // ================================
  // AFFICHER / MASQUER FORMULAIRE
  // ================================
  toggleEventForm() {
    this.showEventForm = !this.showEventForm;
    this.message = null;
  }

  

  // Soumission du formulaire
  ajouterEquipe(): void {
    if (this.equipeForm.invalid) return;

    const formData = new FormData();
    formData.append('nom', this.equipeForm.get('nom')?.value);
    formData.append('saison', this.equipeForm.get('saison')?.value);
    formData.append('logo', this.equipeForm.get('logo')?.value);

    this.http.post('http://localhost:3000/api/equipes', formData)
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Équipe ajoutée avec succès !';
          setTimeout(() => this.toggleForm(), 2000);
        },
        error: (err) => {
          this.message = 'Erreur lors de l\'ajout de l\'équipe';
          console.error(err);
        }
      });
  }

}
