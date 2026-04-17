import { Routes } from '@angular/router';

import { Connexion } from '../page/auth/connexion/connexion';
import { Inscription } from '../page/auth/inscription/inscription';
import { Acceuil } from '../page/public/acceuil/acceuil';
import { Actualite } from '../page/public/actualite/actualite';
import { Dashboard } from '../page/public/dashboard/dashboard';
import { QRCode } from '../page/public/qrcode/qrcode';
import { Match } from '../page/public/match/match';
import { COOKIES } from '../page/public/cookies/cookies';
import { Convocations } from '../page/public/convocations/convocations';
import { Gestion } from '../page/public/gestion/gestion';
import { Utilisateur } from '../page/public/utilisateur/utilisateur';








/* ---- TOUT --- */
export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },
    { path: 'accueil', component: Acceuil },
    { path: 'actus', component: Actualite },
    { path: 'dashboard', component: Dashboard },
    { path: 'qrcode', component: QRCode },
    { path: 'match', component: Match },
    { path: 'cookies', component: COOKIES },
    { path: 'convo', component: Convocations },
    { path: 'gestion', component: Gestion},
    { path: 'user', component: Utilisateur},
    

];
