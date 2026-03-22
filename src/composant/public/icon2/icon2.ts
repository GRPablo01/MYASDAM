import { Component } from '@angular/core';
import { Notif } from '../../share/notif/notif';
import { News } from '../../share/news/news';
import { Theme } from '../../share/theme/theme';
import { Icon } from '../../priver/icon/icon';
import { CommonModule } from '@angular/common';

import { Profil } from '../../share/profil/profil';
import { ThemeService } from '../../../../Backend/Services/theme.service';




@Component({
  selector: 'app-icon2',
  standalone: true,
  imports: [Notif, News, Theme,Icon,CommonModule,Profil],
  templateUrl: './icon2.html',
  styleUrl: './icon2.css',
})
export class Icon2 {

  constructor(public themeService: ThemeService) {}
}
