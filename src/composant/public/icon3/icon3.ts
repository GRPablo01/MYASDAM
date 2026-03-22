import { Component } from '@angular/core';
import { Icon } from '../../priver/icon/icon';
import { Notif } from '../../share/notif/notif';
import { News } from '../../share/news/news';
import { Theme } from '../../share/theme/theme';

@Component({
  selector: 'app-icon3',
  imports: [Icon,Notif,News,Theme],
  templateUrl: './icon3.html',
  styleUrl: './icon3.css',
})
export class Icon3 {

}
