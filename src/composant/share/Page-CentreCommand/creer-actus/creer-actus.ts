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

    this.http.post<any>('http://localhost:3000/api/actus', formData).subscribe({
      next: res => {
        this.message = res.message;
        setTimeout(() => this.toggleForm(), 2000);
      },
      error: () => {
        this.message = 'Erreur création actus';
      }
    });
  }
}