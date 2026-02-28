import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile!: File;

  isLoggedIn = true;
  theme: 'clair' | 'sombre' = 'sombre';
  currentUser: User | null = null;

  // Couleurs et thèmes
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

  constructor(private fb: FormBuilder, private http: HttpClient) {}

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

    // ✅ Formulaire avec titre et saison
    this.actusForm = this.fb.group({
      titre: ['', Validators.required],      // Titre de l'actu
      saison: ['2026', Validators.required],
      image: [null]                           // Image sélectionnée
    });

    this.setThemeColors();
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

  private setThemeColors(): void {
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
    // Clair
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

  onFileSelected(event: any) {
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

  ajouterActus(): void {
    if (this.actusForm.invalid || !this.selectedFile) return;

    const formData = new FormData();

    // ✅ Envoyer titre + auteur (nom complet)
    formData.append('titre', this.actusForm.value.titre);
    const auteurNomComplet = this.currentUser ? `${this.currentUser.prenom || ''} ${this.currentUser.nom || ''}`.trim() : '';
    formData.append('auteur', auteurNomComplet);
    formData.append('saison', this.actusForm.value.saison);
    formData.append('image', this.selectedFile);

    this.http.post<any>('http://localhost:3000/api/actus', formData).subscribe({
      next: res => {
        this.message = res.message;
        setTimeout(() => this.toggleForm(), 2000);
      },
      error: () => this.message = 'Erreur création actus'
    });
  }
}
