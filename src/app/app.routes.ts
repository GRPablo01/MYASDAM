import { Routes } from '@angular/router';

import { Connexion } from '../page/auth/connexion/connexion';
import { Inscription } from '../page/auth/inscription/inscription';
import { Acceuil } from '../page/public/acceuil/acceuil';
import { Actualite } from '../page/public/actualite/actualite';
import { Dashboard } from '../page/public/dashboard/dashboard';







/* ---- TOUT --- */
export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },
    { path: 'accueil', component: Acceuil },
    { path: 'actus', component: Actualite },
    { path: 'dashboard', component: Dashboard },
    

];
