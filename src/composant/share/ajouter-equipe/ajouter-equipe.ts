// ajouter-equipe.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  // Auth / Theme
  isLoggedIn = false;
  theme: 'clair' | 'sombre' = 'clair';

  // Couleurs dynamiques
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
 
  
  

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
    this.setThemeColors();
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

  // Définir les couleurs selon le thème
  private setThemeColors(): void {
    if (!this.isLoggedIn || this.theme === 'sombre') {
      // Thème sombre

      // Section 0
      this.Background = '#1E293B';
      this.BorderHeader = '2px solid #64748B';
      this.Text = '#FFFFFF';

      // Section 1
      this.Background1 = 'linear-gradient(135deg,#6978b8,#818fd5)';

      // Section 2
      this.Background2 = '#6978b8';
      this.Background3 = '#818fd5';
      this.Background4 = '#64748B';

      // Section 3
      this.Background5 = '#1E293B';
      this.icon = '#FFFFFF';

      // Section 9
      this.Background6 = '#818fd5';
      this.Background7 = '#6978b8';

      // Section 10
      this.Background8 = '#454f7ba1';

      // Section 11
      this.BorderHeader1 = '2px solid #64748B';

      // Section 12
      this.Background9 = '#505c91';

      // Section 13
      this.BorderHeader2 = '2px dotted #64748B';
      return;
    }

    // Thème clair

    // Section 0
    this.Background = '#FFFFFF';
    this.BorderHeader = '2px solid #A80303';
    this.Text = '#000000';

    // Section 1
    this.Background1 = 'linear-gradient(135deg,#DC2626,#BE123C)';

    // Section 2
    this.Background2 = '#DC2626';
    this.Background3 = '#BE123C';
    this.Background4 = '#A80303';

    // Section 3
    this.Background5 = '#FFFFFF';
    this.icon = '#DC2626';

    // Section 9
    this.Background6 = '#BE123C';
    this.Background7 = '#DC2626';

    // Section 10
    this.Background8 = '#c9c8c8b3';

    // Section 11
    this.BorderHeader1 = '2px solid #A80303';

    // Section 12
    this.Background9 = '#F3F4F6';

    // Section 13
    this.BorderHeader2 = '2px dotted #A80303';
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
