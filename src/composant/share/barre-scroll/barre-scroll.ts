import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { CommonModule } from '@angular/common';

interface ScrollItem {
  id: number;
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string | number;
  active?: boolean;
  color?: string;
}

@Component({
  selector: 'app-barre-scroll',
  templateUrl: './barre-scroll.html',
  styleUrls: ['./barre-scroll.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BarreScroll implements OnInit, OnDestroy {
  
  // Items avec structure enrichie pour meilleure UX
  items: ScrollItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Élément ${i + 1}`,
    subtitle: i % 3 === 0 ? `Description de l'élément ${i + 1}` : undefined,
    icon: this.getRandomIcon(i),
    badge: i % 5 === 0 ? i + 1 : undefined,
    active: i === 0,
    color: this.getItemColor(i)
  }));

  // État du composant
  isScrolling = false;
  scrollProgress = 0;
  selectedItemId: number = 1;
  showScrollButtons = false;
  
  // Configuration responsive
  @Input() maxHeight: string = '70vh';
  @Input() itemHeight: number = 72;
  @Input() showProgressBar: boolean = true;
  @Input() enableQuickNav: boolean = true;

  private scrollTimeout: any;
  private resizeObserver: ResizeObserver | null = null;

  constructor(public themeService: ThemeService) {}

  // Méthode trackBy pour *ngFor
  trackById(index: number, item: any): number {
    return item.id;
  }
  ngOnInit(): void {
    this.updateScrollbarColors();
    this.setupResizeObserver();
    
    // Souscrire aux changements de thème
    this.themeService.themeChange$.subscribe(() => {
      this.updateScrollbarColors();
    });
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    clearTimeout(this.scrollTimeout);
  }

  /**
   * 🎯 Scrollbar dynamique avec ThemeService
   */
  updateScrollbarColors(): void {
    const root = document.documentElement;
    const isDark = this.themeService.isDarkMode;

    if (isDark) {
      root.style.setProperty('--scroll-track', this.themeService.Backgroundprincipal || '#0f172a');
      root.style.setProperty('--scroll-thumb', this.themeService.primary || '#3b82f6');
      root.style.setProperty('--scroll-thumb-hover', this.themeService.primaryHover || '#60a5fa');
      root.style.setProperty('--scroll-border', 'rgba(255, 255, 255, 0.1)');
    } else {
      root.style.setProperty('--scroll-track', '#f1f5f9');
      root.style.setProperty('--scroll-thumb', this.themeService.primary || '#3b82f6');
      root.style.setProperty('--scroll-thumb-hover', this.themeService.primaryHover || '#2563eb');
      root.style.setProperty('--scroll-border', 'rgba(0, 0, 0, 0.1)');
    }
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      const container = document.querySelector('.scroll-container');
      if (container) {
        this.resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            this.showScrollButtons = entry.contentRect.height > 400;
          }
        });
        this.resizeObserver.observe(container);
      }
    }
  }

  private getRandomIcon(index: number): string {
    const icons = ['📄', '📊', '🎯', '⭐', '🔔', '💡', '📌', '🎨', '🚀', '⚡'];
    return icons[index % icons.length];
  }

  private getItemColor(index: number): string {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-violet-500'
    ];
    return colors[index % colors.length];
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight - element.clientHeight;
    
    this.scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    this.isScrolling = true;
    
    // Reset du flag après arrêt du scroll avec animation fluide
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 150);
  }

  selectItem(item: ScrollItem): void {
    this.selectedItemId = item.id;
    
    // Animation de feedback tactile
    this.items.forEach(i => {
      i.active = i.id === item.id;
    });

    // Effet de ripple ou feedback visuel
    this.triggerSelectionFeedback(item.id);
  }

  private triggerSelectionFeedback(itemId: number): void {
    // Simuler un effet de feedback visuel
    const element = document.querySelector(`[data-item-id="${itemId}"]`);
    if (element) {
      element.classList.add('selection-pulse');
      setTimeout(() => {
        element.classList.remove('selection-pulse');
      }, 300);
    }
  }

  scrollToTop(): void {
    const container = document.querySelector('.scroll-container') as HTMLElement;
    if (container) {
      container.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  }

  scrollToBottom(): void {
    const container = document.querySelector('.scroll-container') as HTMLElement;
    if (container) {
      container.scrollTo({ 
        top: container.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }

  scrollToItem(itemId: number): void {
    const container = document.querySelector('.scroll-container') as HTMLElement;
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`) as HTMLElement;
    
    if (container && itemElement) {
      const itemTop = itemElement.offsetTop;
      const containerHeight = container.clientHeight;
      const itemHeight = itemElement.clientHeight;
      
      container.scrollTo({
        top: itemTop - (containerHeight / 2) + (itemHeight / 2),
        behavior: 'smooth'
      });
    }
  }

  // Navigation rapide par lettre ou numéro
  quickNavigate(direction: 'prev' | 'next'): void {
    const currentIndex = this.items.findIndex(item => item.id === this.selectedItemId);
    let newIndex: number;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : this.items.length - 1;
    } else {
      newIndex = currentIndex < this.items.length - 1 ? currentIndex + 1 : 0;
    }

    const newItem = this.items[newIndex];
    this.selectItem(newItem);
    this.scrollToItem(newItem.id);
  }

  // Filtrage et recherche
  filterItems(query: string): ScrollItem[] {
    if (!query) return this.items;
    const lowerQuery = query.toLowerCase();
    return this.items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.subtitle?.toLowerCase().includes(lowerQuery)
    );
  }

  get visibleItems(): ScrollItem[] {
    return this.items;
  }

  get progressBarStyle() {
    return {
      width: `${this.scrollProgress}%`,
      background: this.themeService.isDarkMode 
        ? 'linear-gradient(90deg, var(--scroll-thumb), var(--scroll-thumb-hover))'
        : 'linear-gradient(90deg, var(--scroll-thumb), var(--scroll-thumb-hover))'
    };
  }
}