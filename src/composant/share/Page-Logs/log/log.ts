import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  DatabaseService,
  DatabaseData
} from '../../../../../Backend/Services/database.service';

import { LogService } from '../../../../../Backend/Services/log.service';

import { Subscription, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// =========================
// LOG MODEL
// =========================
interface LogItem {
  user: string;
  role: string;
  action: string;
  description: string;
  date: Date;
  type: 'INIT' | 'CREATE' | 'DELETE' | 'UPDATE' | 'NO_CHANGE';
  field?: string;
  oldValue?: any;
  newValue?: any;
  entity?: string;
}

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log.html',
  styleUrl: './log.css',
})
export class Log implements OnInit, OnDestroy {

  // =========================
  // DATA
  // =========================
  bloc1: DatabaseData | null = null;   // ← Snapshot de référence (garde 2 min)
  bloc2: DatabaseData | null = null;   // ← Nouveau snapshot

  logs: LogItem[] = [];
  loading = true;
  error = '';
  nextScanIn = 120;                    // ← Compte à rebours affichable (UI)

  private dbSub!: Subscription;
  private timerSub!: Subscription;     // ← Timer RxJS propre pour les 2 min

  private readonly INTERVAL_MS = 120000; // 2 minutes en millisecondes

  constructor(
    private databaseService: DatabaseService,
    private logService: LogService
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    console.log('🚀 [LOG] ngOnInit — démarrage du watcher de changements');
    this.loadExistingLogs();
    this.startCycle(); // ← Premier cycle immédiat
  }

  // =========================
  // CHARGEMENT DES LOGS EXISTANTS
  // =========================
  loadExistingLogs(): void {
    console.log('📂 [LOG] Chargement des logs existants...');
    this.logService.getLogs().subscribe({
      next: (data) => {
        this.logs = data.map(l => this.normalizeLog(l));
        console.log(`✅ [LOG] ${this.logs.length} log(s) chargé(s)`);
      },
      error: (err) => console.error('❌ [LOG] Erreur chargement logs :', err)
    });
  }

  private normalizeLog(l: any): LogItem {
    return {
      user: l.user ?? 'Système',
      role: l.role ?? 'system',
      action: l.action ?? 'UNKNOWN',
      description: l.description ?? '',
      date: new Date(l.date),
      type: l.type ?? 'UPDATE',
      field: l.field,
      oldValue: l.oldValue,
      newValue: l.newValue,
      entity: l.entity
    };
  }

  // =========================
  // CYCLE PRINCIPAL : BLOC 1 → [2 MIN] → BLOC 2 → COMPARE → ROTATION
  // =========================
  private startCycle(): void {
    console.log('⏱️ [CYCLE] Démarrage d\'un nouveau cycle de surveillance');

    // ÉTAPE 1 : Si pas de Bloc 1, on le récupère immédiatement
    if (!this.bloc1) {
      console.log('🟢 [CYCLE] Premier cycle — récupération du Bloc 1 initial');
      this.fetchBloc1();
      return;
    }

    // ÉTAPE 2 : Bloc 1 existe → on attend 2 min → puis on récupère Bloc 2
    console.log(`⏳ [CYCLE] Bloc 1 en mémoire — attente de ${this.INTERVAL_MS / 1000}s avant récupération du Bloc 2`);
    this.startCountdown();

    this.timerSub = timer(this.INTERVAL_MS).subscribe(() => {
      console.log('📡 [CYCLE] 2 minutes écoulées — récupération du Bloc 2');
      this.fetchBloc2();
    });
  }

  // =========================
  // RÉCUPÉRATION BLOC 1 (Initial)
  // =========================
  private fetchBloc1(): void {
    this.loading = true;

    if (this.dbSub) this.dbSub.unsubscribe();

    this.dbSub = this.databaseService.watchDatabaseChanges().subscribe({
      next: (data) => {
        this.bloc1 = structuredClone(data); // ← Clone profond pour éviter les références
        console.log('✅ [BLOC 1] Snapshot initial stocké en mémoire');
        console.log('📊 [BLOC 1] Données :', this.bloc1);

        this.loading = false;

        // On lance immédiatement l'attente pour le prochain cycle
        this.startCycle();
      },
      error: (err) => {
        console.error('❌ [BLOC 1] Erreur :', err);
        this.error = 'Erreur récupération Bloc 1';
        this.loading = false;
      }
    });
  }

  // =========================
  // RÉCUPÉRATION BLOC 2 (Après 2 min)
  // =========================
  private fetchBloc2(): void {
    this.loading = true;

    if (this.dbSub) this.dbSub.unsubscribe();

    this.dbSub = this.databaseService.watchDatabaseChanges().subscribe({
      next: (data) => {
        this.bloc2 = structuredClone(data);
        console.log('✅ [BLOC 2] Nouveau snapshot récupéré');
        console.log('📊 [BLOC 2] Données :', this.bloc2);

        // ÉTAPE 3 : COMPARAISON
        this.compareAndProcess();

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ [BLOC 2] Erreur :', err);
        this.error = 'Erreur récupération Bloc 2';
        this.loading = false;
        
        // Même en cas d'erreur, on relance le cycle pour réessayer dans 2 min
        this.startCycle();
      }
    });
  }

  // =========================
  // COMPARAISON + TRAITEMENT
  // =========================
  private compareAndProcess(): void {
    if (!this.bloc1 || !this.bloc2) {
      console.warn('⚠️ [COMPARE] Bloc 1 ou Bloc 2 manquant');
      return;
    }

    console.log('🔍 [COMPARE] Comparaison Bloc 1 vs Bloc 2...');

    // On collecte tous les changements détectés
    const changesDetected: LogItem[] = [];

    // Comparaison entité par entité
    this.compareEntity('Utilisateur',   this.bloc1.users        ?? [], this.bloc2.users        ?? [], changesDetected);
    this.compareEntity('Équipe',        this.bloc1.equipes      ?? [], this.bloc2.equipes      ?? [], changesDetected);
    this.compareEntity('Match',         this.bloc1.matchs       ?? [], this.bloc2.matchs       ?? [], changesDetected);
    this.compareEntity('Événement',     this.bloc1.events       ?? [], this.bloc2.events       ?? [], changesDetected);
    this.compareEntity('Convocation',   this.bloc1.convocations ?? [], this.bloc2.convocations ?? [], changesDetected);
    this.compareEntity('Actualité',     this.bloc1.actus        ?? [], this.bloc2.actus        ?? [], changesDetected);
    this.compareEntity('Message',       this.bloc1.messages     ?? [], this.bloc2.messages     ?? [], changesDetected);

    // =========================
    // DÉCISION : MODIFICATION OU PAS ?
    // =========================
    if (changesDetected.length === 0) {
      console.log('✔️ [COMPARE] AUCUNE MODIFICATION détectée entre Bloc 1 et Bloc 2');
      
      // Pas de changement → Bloc 2 devient Bloc 1 (rotation silencieuse)
      this.bloc1 = this.bloc2;
      this.bloc2 = null;
      console.log('🔄 [ROTATION] Bloc 2 → Bloc 1 (sans log)');

    } else {
      console.log(`📝 [COMPARE] ${changesDetected.length} modification(s) détectée(s) !`);

      // Il y a des changements → on sauvegarde chaque changement en base
      changesDetected.forEach(change => {
        this.saveLog(change);
      });

      // Puis rotation : Bloc 2 devient le nouveau Bloc 1
      this.bloc1 = this.bloc2;
      this.bloc2 = null;
      console.log('🔄 [ROTATION] Bloc 2 → Bloc 1 (après sauvegarde des logs)');
    }

    // Relance immédiatement le cycle (attente 2 min)
    this.startCycle();
  }

  // =========================
  // MOTEUR DE COMPARAISON PAR ENTITÉ
  // =========================
  private compareEntity(
    label: string,
    oldArray: any[] = [],
    newArray: any[] = [],
    changesAccumulator: LogItem[]
  ): void {

    console.log(`🔎 [COMPARE] "${label}" — Bloc 1: ${oldArray.length} item(s), Bloc 2: ${newArray.length} item(s)`);

    const oldMap = new Map(oldArray.map(i => [i._id, i]));
    const newMap = new Map(newArray.map(i => [i._id, i]));

    // -------------------------
    // 1. CRÉATIONS (dans Bloc 2 mais pas dans Bloc 1)
    // -------------------------
    newArray.forEach(item => {
      if (!oldMap.has(item._id)) {
        console.log(`➕ [CREATE] ${label} : ${this.getLabel(item)}`);
        
        changesAccumulator.push({
          user: 'Système',
          role: 'system',
          action: 'CREATE',
          type: 'CREATE',
          entity: label,
          description: `${label} créé : ${this.getLabel(item)}`,
          newValue: item,
          date: new Date()
        });
      }
    });

    // -------------------------
    // 2. SUPPRESSIONS (dans Bloc 1 mais pas dans Bloc 2)
    // -------------------------
    oldArray.forEach(item => {
      if (!newMap.has(item._id)) {
        console.log(`➖ [DELETE] ${label} : ${this.getLabel(item)}`);
        
        changesAccumulator.push({
          user: 'Système',
          role: 'system',
          action: 'DELETE',
          type: 'DELETE',
          entity: label,
          description: `${label} supprimé : ${this.getLabel(item)}`,
          oldValue: item,
          date: new Date()
        });
      }
    });

    // -------------------------
    // 3. MODIFICATIONS (présent dans les deux → comparaison champ par champ)
    // -------------------------
    newArray.forEach(newItem => {
      const oldItem = oldMap.get(newItem._id);
      if (!oldItem) return; // Déjà traité en CREATE

      // Récupération de tous les champs (hors _id)
      const allFields = new Set([
        ...Object.keys(oldItem),
        ...Object.keys(newItem)
      ]);
      allFields.delete('_id');

      allFields.forEach(field => {
        const oldVal = oldItem[field];
        const newVal = newItem[field];

        // Comparaison profonde (objets/arrays imbriqués)
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          console.log(`✏️ [UPDATE] ${label} "${this.getLabel(newItem)}" — champ "${field}" modifié`);
          console.log(`   🔴 Ancien :`, oldVal);
          console.log(`   🟢 Nouveau :`, newVal);

          changesAccumulator.push({
            user: 'Système',
            role: 'system',
            action: 'UPDATE',
            type: 'UPDATE',
            entity: label,
            field: field,
            description: `${label} "${this.getLabel(newItem)}" — champ "${field}" modifié`,
            oldValue: oldVal,
            newValue: newVal,
            date: new Date()
          });
        }
      });
    });
  }

  // =========================
  // LABEL POUR L'AFFICHAGE
  // =========================
  private getLabel(item: any): string {
    if (!item) return 'inconnu';
    if (item.nom || item.prenom) {
      return `${item.nom ?? ''} ${item.prenom ?? ''}`.trim();
    }
    return item.name ?? item.title ?? item._id ?? 'sans nom';
  }

  // =========================
  // SAUVEGARDE D'UN LOG (API SPÉCIFIQUE)
  // =========================
  saveLog(logData: Partial<LogItem>): void {
    const log: LogItem = {
      user: logData.user ?? 'Système',
      role: logData.role ?? 'system',
      action: logData.action ?? 'UNKNOWN',
      description: logData.description ?? '',
      type: logData.type ?? 'UPDATE',
      field: logData.field,
      oldValue: logData.oldValue,
      newValue: logData.newValue,
      entity: logData.entity,
      date: new Date()
    };
  
    console.log('💾 [SAVE LOG] Envoi vers l\'API :', log);
  
    // Ajout local immédiat (UI optimiste)
    this.logs.unshift(log);
  
    if (this.logs.length > 100) {
      this.logs.pop();
    }
  
    // 🔥 Persistance en base via API
    this.logService.createLog(log).subscribe({
      next: (res) => {
        console.log('✅ [SAVE LOG] Log sauvegardé en base avec succès', res);
      },
      error: (err) => {
        console.error('❌ [SAVE LOG] Erreur API :', err);
      }
    });
  }

  // =========================
  // COMPTE À REBOURS (POUR L'UI)
  // =========================
  private startCountdown(): void {
    this.nextScanIn = this.INTERVAL_MS / 1000;
    
    // On utilise un interval pour l'affichage uniquement, pas pour la logique métier
    const countdownInterval = setInterval(() => {
      this.nextScanIn--;
      
      if (this.nextScanIn <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }

  // =========================
  // CLEAR ALL LOGS
  // =========================
  clearLogs(): void {
    console.log('🗑️ [CLEAR] Suppression de tous les logs...');
    this.logService.clearLogs().subscribe({
      next: () => {
        this.logs = [];
        console.log('✅ [CLEAR] Tous les logs supprimés');
      },
      error: (err) => console.error('❌ [CLEAR] Erreur :', err)
    });
  }

  // =========================
  // CLEANUP À LA DESTRUCTION
  // =========================
  ngOnDestroy(): void {
    console.log('🛑 [LOG] ngOnDestroy — nettoyage');
    if (this.dbSub) this.dbSub.unsubscribe();
    if (this.timerSub) this.timerSub.unsubscribe();
  }
}