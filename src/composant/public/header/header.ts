import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Composants standalone
import { Nav } from '../../share/nav/nav';
import { Profil } from '../../share/profil/profil';
import { News } from '../../share/news/news';
import { Theme } from '../../share/theme/theme';
import { Notif } from '../../share/notif/notif';
import { Icon } from '../../priver/icon/icon';
import { Icon2 } from '../icon2/icon2';
import { Barre } from '../../share/barre/barre';
import { Logo } from '../../share/logo/logo';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon3 } from '../icon3/icon3';



// Service


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Nav,
    Profil,
    News,
    Theme,
    Notif,
    Icon,
    Icon2,
    Icon3,
    Barre,
    Logo,
],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor(public themeService: ThemeService) {}
}