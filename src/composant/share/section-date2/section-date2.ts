import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../../../Backend/Services/Event.Service';
import { MatchService, Match } from '../../../../Backend/Services/match.service';

interface CalendarEvent {
  id?: string | number;
  date: string;
  title: string;
  description?: string;
  type: 'match' | 'training' | 'event';
  heureDebut?: string;
  heureFin?: string;
  lieu?: string;
  categorie?: string;
  equipeDom?: string;
  equipeExt?: string;
  logoDom?: string;
  logoExt?: string;
  statut?: string;
  typeMatch?: string;
  theme?: string;
  createdBy?: string;
}

@Component({
  selector: 'app-section-date2',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './section-date2.html',
  styleUrls: ['./section-date2.css'],
})
export class SectionDate2 implements OnInit {

  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  currentMonthName: string = '';

  selectedDay: number | null = null;
  selectedCell: { day: string; hour: string } | null = null;
  daysInCurrentMonth: number[] = [];
  viewMode: 'month' | 'day' = 'month';
  hours: string[] = Array.from({ length: 14 }, (_, i) => `${8 + i}:00`);

  events: CalendarEvent[] = [];

  theme: 'clair' | 'sombre' = 'clair';
  isLoggedIn = false;
  hoverIndex: number = -1;

  selectedEvent: CalendarEvent | null = null;
  showCreateEventModal: boolean = false;
  selectedDateForCreate: string = '';
  eventForm: FormGroup;

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
  Background10 = '';
  Background11 = '';
  Background12 = '';
  BorderHeader = '';
  BorderHeader1 = '';
  BorderHeader2 = '';
  BorderHeader3 = '';
  Text = '';
  Text1 = '';
  Text2 = '';

  message: string | null = null;

  private readonly HOUR_WIDTH = 80;
  private readonly START_HOUR = 8;

  constructor(
    private eventService: EventService,
    private matchService: MatchService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      lieu: ['', Validators.required],
      type: ['Entrainement', Validators.required],
      categorie: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.updateMonth();
    this.loadEventsAndMatches();
  
    // 🔹 Récupérer l'utilisateur depuis le localStorage
    const utilisateurStr = localStorage.getItem('utilisateur');
    if (utilisateurStr) {
      try {
        const utilisateur = JSON.parse(utilisateurStr);
        this.theme = utilisateur.theme; // on prend seulement le thème
        console.log('Thème récupéré depuis localStorage :', this.theme);
      } catch (e) {
        console.error('Erreur parsing localStorage utilisateur :', e);
      }
    }
  
    // 🔹 Appliquer le thème même si isLoggedIn = false
    this.isLoggedIn = true; // <-- assure que les couleurs s'appliquent
    this.setThemeColors();
  }
  
  

  // 🔹 Chargement événements et matchs
  loadEventsAndMatches() {
    this.events = [];

    // 🔵 EVENEMENTS
    this.eventService.getEvents().subscribe((events: any[]) => {
      const formattedEvents: CalendarEvent[] = events.map(e => ({
        id: e.id,
        date: e.date,
        title: e.titre,
        description: e.description + (e.lieu ? ` - ${e.lieu}` : ''),
        type: 'event',
        heureDebut: e.heureDebut,
        heureFin: e.heureFin,
        lieu: e.lieu,
        categorie: e.categorie
      }));
      this.events = [...this.events, ...formattedEvents];
    });

    // 🔴 MATCHS
    this.matchService.getMatchs().subscribe((matchs: Match[]) => {
      const formattedMatches: CalendarEvent[] = matchs.map(m => {
        let heureFin = '';
        if (m.heure) {
          const [h, min] = m.heure.split(':').map(Number);
          const dateFin = new Date();
          dateFin.setHours(h, min + 90);
          const hh = String(dateFin.getHours()).padStart(2, '0');
          const mm = String(dateFin.getMinutes()).padStart(2, '0');
          heureFin = `${hh}:${mm}`;
        }

        return {
          id: m._id,
          key: m.key,
          date: m.date,
          title: `${m.equipeDom} vs ${m.equipeExt}`,
          description: m.lieu || '',
          type: 'match',
          heureDebut: m.heure,
          heureFin: heureFin,
          lieu: m.lieu,
          categorie: m.categorie,
          typeMatch: m.typeMatch,
          equipeDom: m.equipeDom,
          equipeExt: m.equipeExt,
          logoDom: m.logoDom,
          logoExt: m.logoExt,
          scoreDom: m.scoreDom,
          scoreExt: m.scoreExt,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt
        };
      });
      this.events = [...this.events, ...formattedMatches];
    });
  }

  // 🔹 Calendrier
  formatDateForDay(day: number): string {
    const month = String(this.currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${this.currentYear}-${month}-${dayStr}`;
  }

  isToday(day: number): boolean {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.formatDateForDay(day) === todayStr;
  }

  getEventsForDate(date: string): CalendarEvent[] {
    return this.events.filter(e => e.date.split('T')[0] === date);
  }

  getEventStyle(ev: CalendarEvent): any {
    if (!ev.heureDebut || !ev.heureFin) return {};
    const startH = parseInt(ev.heureDebut.split(':')[0], 10);
    const startM = parseInt(ev.heureDebut.split(':')[1], 10) || 0;
    const endH = parseInt(ev.heureFin.split(':')[0], 10);
    const endM = parseInt(ev.heureFin.split(':')[1], 10) || 0;
    const pxPerHour = 64;
    const pxPerMinute = pxPerHour / 60;
    const top = ((startH - 8) * pxPerHour) + (startM * pxPerMinute);
    const height = ((endH - startH) * pxPerHour) + ((endM - startM) * pxPerMinute);
    return { top: `${top}px`, height: `${Math.max(height, 32)}px` };
  }

  onDayClick(day: number) { this.selectedDay = day; this.viewMode = 'day'; }

  onCellClick(day: string, hour: string) {
    this.selectedCell = { day, hour };
    this.selectedDateForCreate = day;
    this.eventForm.patchValue({
      heureDebut: hour,
      heureFin: this.addOneHour(hour)
    });
    this.showCreateEventModal = true;
  }

  onEventClick(event: CalendarEvent, eventClick?: MouseEvent) {
    if (eventClick) eventClick.stopPropagation();
    this.selectedEvent = { ...event, title: event.title || '', description: event.description || '', heureDebut: event.heureDebut || '', heureFin: event.heureFin || '', lieu: event.lieu || '' };
  }

  closeEventModal() { this.selectedEvent = null; }
  closeCreateModal() { 
    this.showCreateEventModal = false; 
    this.eventForm.reset({ type: 'Entrainement' }); 
    this.selectedDateForCreate = ''; 
  }

  createEvent() {
    if (!this.eventForm.valid || !this.selectedDateForCreate) return;
    const formValue = this.eventForm.value;
    const newEvent: any = {
      date: this.selectedDateForCreate,
      titre: formValue.title,
      description: formValue.description || '',
      heureDebut: formValue.heureDebut,
      heureFin: formValue.heureFin,
      lieu: formValue.lieu,
      type: formValue.type,
      categorie: formValue.categorie,
      statut: formValue.statut
    };
    this.eventService.createEvent(newEvent).subscribe({
      next: (response) => {
        const calendarEvent: CalendarEvent = {
          id: response.id,
          date: newEvent.date,
          title: newEvent.titre,
          description: newEvent.description + (newEvent.lieu ? ` - ${newEvent.lieu}` : ''),
          type: 'event',
          heureDebut: newEvent.heureDebut,
          heureFin: newEvent.heureFin,
          lieu: newEvent.lieu,
          categorie: newEvent.categorie,
          statut: newEvent.statut
        };
        this.events.push(calendarEvent);
        this.closeCreateModal();
        this.showSuccessMessage('Événement créé avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors de la création:', err);
        this.events.push({ date: newEvent.date, title: newEvent.titre, description: newEvent.description, type: 'event', heureDebut: newEvent.heureDebut, heureFin: newEvent.heureFin, lieu: newEvent.lieu, categorie: newEvent.categorie });
        this.closeCreateModal();
        this.showSuccessMessage('Événement créé (mode local) !');
      }
    });
  }

  editEvent(event: CalendarEvent) { console.log('Édition de l\'événement:', event); this.closeEventModal(); }
  showSuccessMessage(msg: string) { this.message = msg; setTimeout(() => { this.message = null; }, 3000); }

  private addOneHour(time: string): string {
    const [h, m] = time.split(':').map(Number);
    return `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  previousMonth() { 
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; } 
    else this.currentMonth--; 
    this.updateMonth(); 
  }

  nextMonth() { 
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; } 
    else this.currentMonth++; 
    this.updateMonth(); 
  }

  goToToday() { 
    this.today = new Date(); 
    this.currentMonth = this.today.getMonth(); 
    this.currentYear = this.today.getFullYear(); 
    this.updateMonth(); 
  }

  updateMonth() {
    this.currentMonthName = new Date(this.currentYear, this.currentMonth).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
    this.generateDaysInCurrentMonth();
  }

  generateDaysInCurrentMonth() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInCurrentMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  goToPreviousMonth() { this.previousMonth(); }
  goToNextMonth() { this.nextMonth(); }

  isEventStartHour(date: string, hour: string, ev: any) { return ev.heureDebut === hour; }
  getEventColSpan(ev: any) {
    const start = parseInt(ev.heureDebut.split(':')[0], 10);
    const end = parseInt(ev.heureFin.split(':')[0], 10);
    return Math.max(end - start, 1);
  }

  shouldDisplayEvent(event: CalendarEvent, day: number): boolean {
    if (!event?.date) return false;
    const eventDate = new Date(event.date);
    return eventDate.getDate() === day;
  }

  getEventDurationMinutes(event: CalendarEvent): number {
    if (!event?.heureDebut || !event?.heureFin) return 0;
    const [startH, startM] = event.heureDebut.split(':').map(Number);
    const [endH, endM] = event.heureFin.split(':').map(Number);
    return (endH * 60 + endM) - (startH * 60 + startM);
  }

  formatDuration(event: CalendarEvent): string {
    const minutes = this.getEventDurationMinutes(event);
    if (minutes <= 0) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  }

  calculateEventLeftPixels(event: CalendarEvent): number {
    if (!event?.heureDebut) return 0;
    const [startH, startM] = event.heureDebut.split(':').map(Number);
    const hoursFromStart = startH - this.START_HOUR;
    const minutesDecimal = startM / 60;
    return (hoursFromStart + minutesDecimal) * this.HOUR_WIDTH;
  }

  calculateEventWidthPixels(event: CalendarEvent): number {
    const durationMinutes = this.getEventDurationMinutes(event);
    if (durationMinutes <= 0) return this.HOUR_WIDTH;
    return Math.max((durationMinutes / 60) * this.HOUR_WIDTH, 60);
  }

  calculateEventHeight(event: CalendarEvent): number { return 80; }

  hasEventAtHour(date: string, hour: string): boolean { return this.getEventsForHour(date, hour).length > 0; }

  getEventsForHour(date: string, hour: string): CalendarEvent[] {
    const hourNum = parseInt(hour.split(':')[0]);
    return this.events.filter(ev => ev.heureDebut && ev.date && new Date(ev.date).toDateString() === new Date(date).toDateString() && parseInt(ev.heureDebut.split(':')[0]) === hourNum);
  }

  isMatch(item: any): boolean { return item && (item.equipeDom || item.typeMatch); }

  getStatusColor(statut: string): string {
    switch(statut?.toLowerCase()) {
      case 'confirmé':
      case 'confirmée': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'à venir':
      case 'planifié': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'en cours': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'terminé':
      case 'annulé': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-violet-100 text-violet-700 border-violet-200';
    }
  }

  private setThemeColors(): void {
    if (!this.isLoggedIn) return;

    if (this.theme === 'sombre') {
      // Section 0
      this.Background  = '#1E293B';
      this.Text = '#FFFFFF';

      // Section 1
      this.Background1  = '#334155';
      this.BorderHeader = '2px solid #6978b8';
      this.Background2  = '#1E293B';

      return;
    }

    // Section 0
    this.Background  = '#FFFFFF';
    this.Text = '#000000';

    // Section 1
    this.Background1  = '#553333';
    this.BorderHeader = '2px solid #a80303';
    this.Background2  = '#FFFFFF';

    
    // this.Background  = '#FFFFFF';
    // this.Text = '#000000';
    // this.Background1 = '#DC2626';
    // this.Background2 = '#DC2626';
    // this.Background3 = '#DC2626';
    // this.Background4 = '#DC2626';
    // this.Background5 = '#DC2626';
    // this.BorderHeader = '2px solid #a80303';
    // this.Text1 = '#DC2626';
    // this.Background6 = '#e9e6e6';
    // this.Background7 = '#DC2626';
    // this.Background8 = '#e9e6e6';
    // this.BorderHeader1 = '2px solid #DC2626';
    // this.Background9 = '#e9e6e6';
    // this.BorderHeader2 = '2px solid #DC2626';
    // this.BorderHeader3 = '2px solid #DC2626';
    // this.Background10 = '#DC2626';
    // this.Background11 = '#a3464680';
    // this.Background12 = '#DC2626';
  }
}
