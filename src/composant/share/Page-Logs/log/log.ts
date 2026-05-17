import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { Subscription, timer } from 'rxjs';

import {
  DatabaseData,
  DatabaseService
} from '../../../../../Backend/Services/database.service';

import { LogService } from '../../../../../Backend/Services/log.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

// ======================================================
// TYPES
// ======================================================

type LogType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'SYSTEM'
  | 'INITIALISATION';

// ======================================================
// INTERFACE
// ======================================================

interface LogItem {
  user: string;
  role: string;
  action: LogType;
  type: LogType;
  description: string;
  date: Date;

  createdAt?: Date;
  field?: string;
  oldValue?: any;
  newValue?: any;
  entity?: string;
}

// ======================================================
// COMPONENT
// ======================================================

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './log.html',
  styleUrl: './log.css'
})
export class Log implements OnInit, OnDestroy {

  bloc1: DatabaseData | null = null;
  bloc2: DatabaseData | null = null;

  logs: LogItem[] = [];
  loading = false;
  error = '';

  isHover = false;
  maxCount: number = 0;
  searchFocused = false
  searchTerm = '';
  selectedType: 'ALL' | LogType = 'ALL';

  totalLogs = 0;
  todayLogs = 0;

  maxActivityCount = 0;
  activityData: { label: string; count: number }[] = [];
  selectedWeek: 'current' | 'previous' = 'current';


  selectedDate = '';
  lastSync: Date = new Date();

  private dbSub?: Subscription;
  private timerSub?: Subscription;

  private readonly INTERVAL_MS = 120000;

  constructor(
    private databaseService: DatabaseService,
    private logService: LogService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  ngOnDestroy(): void {
    this.dbSub?.unsubscribe();
    this.timerSub?.unsubscribe();
  }

  // ======================================================
  // LOAD LOGS
  // ======================================================

  loadLogs(): void {
    this.loading = true;

    this.logService.getLogs().subscribe({
      next: (data: any[]) => {

        this.logs = (data || [])
          .map(l => this.normalize(l))
          .sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        this.totalLogs = this.logs.length;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.todayLogs = this.logs.filter(log => {
          const d = new Date(log.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        }).length;

        this.generateActivityData();
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement logs';
        this.loading = false;
      }
    });
  }

  // ======================================================
  // ACTIVITY GRAPH
  // ======================================================

  generateActivityData(): void {

    const days: { label: string; count: number }[] = [];
    const labels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    const today = new Date();
    const weekOffset = this.selectedWeek === 'previous' ? 7 : 0;

    for (let i = 6; i >= 0; i--) {

      const date = new Date(today);
      date.setDate(today.getDate() - i - weekOffset);
      date.setHours(0, 0, 0, 0);

      const label = labels[date.getDay()];

      const count = this.logs.filter(log => {
        const d = new Date(log.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === date.getTime();
      }).length;

      days.push({ label, count });
    }

    this.activityData = days;
    this.maxActivityCount = Math.max(...days.map(d => d.count), 1);
  }

  getBarPixelHeight(count: number): number {
    if (!this.maxActivityCount) return 5;
    const percent = (count / this.maxActivityCount) * 100;
    return Math.max(percent, count > 0 ? 8 : 4);
  }

  refreshLogs(): void {
    this.loadLogs();
  }

  // ======================================================
  // NORMALIZE
  // ======================================================

  private normalize(log: Partial<LogItem>): LogItem {
    return {
      user: log.user ?? 'Système',
      role: log.role ?? 'system',
      action: log.action ?? 'SYSTEM',
      type: log.type ?? 'SYSTEM',
      description: log.description ?? '',
      date: log.date ? new Date(log.date) : new Date(),
      createdAt: log.createdAt ? new Date(log.createdAt) : new Date(),
      field: log.field,
      oldValue: log.oldValue,
      newValue: log.newValue,
      entity: log.entity
    };
  }

  // ======================================================
  // SAVE LOG
  // ======================================================

  saveLog(log: Partial<LogItem>) {

    const final: LogItem = this.normalize({
      ...log,
      date: new Date()
    });

    this.logs.unshift(final);

    const logToSend = {
      ...final,
      type: this.mapTypeForBackend(final.type),
      action: this.mapTypeForBackend(final.action)
    };

    this.logService.createLog(logToSend as any).subscribe({
      error: err => console.error(err)
    });
  }

  private mapTypeForBackend(type: LogType): LogType {
    if (type === 'INITIALISATION') return 'SYSTEM';
    return type;
  }

  // ======================================================
  // FILTERS
  // ======================================================

  get filteredLogs() {
    return this.logs.filter(log => {
  
      const search = this.searchTerm.toLowerCase();
  
      const matchesSearch =
        !this.searchTerm ||
        log.user?.toLowerCase().includes(search) ||
        log.description?.toLowerCase().includes(search) ||
        log.action?.toLowerCase().includes(search);
  
      // ✅ Gestion des types
      let actionType = log.action;
  
      // Tous les CREATE_* deviennent CREATE
      if (log.action?.startsWith('CREATE_')) {
        actionType = 'CREATE';
      }
  
      // Tous les UPDATE_* deviennent UPDATE
      if (log.action?.startsWith('UPDATE_')) {
        actionType = 'UPDATE';
      }
  
      // Tous les DELETE_* deviennent DELETE
      if (log.action?.startsWith('DELETE_')) {
        actionType = 'DELETE';
      }
  
      const matchesType =
        this.selectedType === 'ALL' ||
        actionType === this.selectedType;
  
      const matchesDate =
        !this.selectedDate ||
        new Date(log.date).toDateString() ===
        new Date(this.selectedDate).toDateString();
  
      return matchesSearch && matchesType && matchesDate;
    });
  }


  trackByIndex(i: number) {
    return i;
  }

  // ======================================================
  // UI HELPERS
  // ======================================================

  getUserGradient(name: string): string {
    const gradients = [
      'bg-gradient-to-r from-red-700 to-red-700',
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);

    return gradients[hash % gradients.length];
  }

  getUserInitial(name: string): string {
    if (!name) return '?';

    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getRoleConfig(role: string): any {
    const config: any = {
      ADMIN: { label: 'Admin', badgeClass: 'bg-red-500 text-white px-2 py-1 rounded-lg' },
      USER: { label: 'Utilisateur', badgeClass: 'bg-blue-500 text-white px-2 py-1 rounded-lg' },
      SUPERADMIN: { label: 'Super Admin', badgeClass: 'bg-purple-600 text-white px-2 py-1 rounded-lg' },
      DEFAULT: { label: 'Inconnu', badgeClass: 'bg-slate-400 text-white px-2 py-1 rounded-lg' }
    };

    return config[role?.toUpperCase()] || config.DEFAULT;
  }

  getActionConfig(action: string) {
    switch (action) {
      case 'CREATE':
        return {
          icon: 'fas fa-plus',
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        };
  
      case 'DELETE':
        return {
          icon: 'fas fa-trash',
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          textColor: 'text-red-600'
        };
  
      default:
        return {
          icon: 'fas fa-info-circle',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600'
        };
    }
  }

  getActionIcon(type: string): string {
    return this.getActionConfig(type).icon;
  }
  // ======================================================
  // PAGINATION
  // ======================================================

  currentPage: number = 1;
  itemsPerPage: number = 4;

  // =========================
  // TOTAL PAGES
  // =========================
  get totalPages(): number {
    const total = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    return total > 0 ? total : 1;
  }

  // =========================
  // LOGS PAGINÉS
  // =========================
  get displayedLogs() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.filteredLogs.slice(start, end);
  }

  // =========================
  // RANGE AFFICHÉ (1 - X)
  // =========================
  get displayedRange(): number {
    const end = this.currentPage * this.itemsPerPage;

    return end > this.filteredLogs.length
      ? this.filteredLogs.length
      : end;
  }

  // =========================
  // PAGE SUIVANTE
  // =========================
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      // console.log('➡️ Page suivante :', this.currentPage);
    }
  }

  // =========================
  // PAGE PRÉCÉDENTE
  // =========================
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      // console.log('⬅️ Page précédente :', this.currentPage);
    }
  }

  // =========================
  // ALLER À UNE PAGE
  // =========================
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // console.log('📄 Page sélectionnée :', page);
    }
  }

  // =========================
  // NUMÉROS DE PAGES
  // =========================
  getPageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  // =========================
  // RESET FILTRES
  // =========================
  resetFilters(): void {
    this.currentPage = 1;
    // console.log('🔄 Reset pagination + filtres');
  }
}