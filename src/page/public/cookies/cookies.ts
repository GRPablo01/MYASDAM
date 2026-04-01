import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Icon } from '../../../composant/priver/icon/icon';
import { ThemeService } from '../../../../Backend/Services/theme.service';

interface SectionCGU {
  titre: string;
  contenu: string;
}

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, Icon],
  templateUrl: './cookies.html',
  styleUrls: ['./cookies.css']
})
export class COOKIES implements OnInit, OnDestroy {

  isLoaded = false;

  sections: SectionCGU[] = [];
  currentPage = 0;
  pageSize = 3;

  constructor(private titleService: Title, public themeService: ThemeService) {}

  ngOnInit(): void {
    this.titleService.setTitle('UniDys | Cookies');

    // 🔒 Bloquer le scroll pendant le chargement
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    setTimeout(() => this.isLoaded = true, 10);

    /* ------------------------------- */
    /*        CONTENU COOKIES          */
    /* ------------------------------- */
    this.sections = [
      {
        titre: '1. Introduction',
        contenu: `Cette page explique comment ASDAM utilise les cookies 
        pour offrir une expérience sécurisée, fluide et adaptée aux membres du club.`
      },
      {
        titre: '2. Que sont les cookies ?',
        contenu: `Les cookies sont de petits fichiers stockés dans votre navigateur. 
        Ils permettent au site de se souvenir de vos préférences et de votre session de connexion.`
      },
      {
        titre: '3. Cookies essentiels',
        contenu: `ASDAM utilise uniquement des cookies indispensables : 
        - connexion au compte membre, 
        - mémorisation de votre choix concernant les cookies. 
        Ces cookies ne collectent aucune donnée personnelle sensible.`
      },
      {
        titre: '4. Aucun cookie publicitaire',
        contenu: `ASDAM n’utilise pas de cookies publicitaires, marketing, sociaux 
        ou provenant de services tiers (Google Analytics, Facebook, TikTok, etc.).`
      },
      {
        titre: '5. Votre choix',
        contenu: `Lors de votre première visite, vous pouvez accepter ou refuser 
        les cookies non essentiels (chez ASDAM, il n’y en a pas). 
        Votre décision est enregistrée et peut être modifiée à tout moment.`
      },
      {
        titre: '6. Contact',
        contenu: `
          Pour toute question sur les cookies ou la protection de vos données :
          <span class="text-[#C1121F] font-semibold">contact@asdam-foot.fr</span>
        `
      }
    ];
  }

  ngOnDestroy(): void {
    // 🔓 Restaurer le scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }

  get pagedSections(): SectionCGU[] {
    const start = this.currentPage * this.pageSize;
    return this.sections.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.sections.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goBack() {
    window.history.back();
  }
}