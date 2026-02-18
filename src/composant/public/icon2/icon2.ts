import { Component } from '@angular/core';
import { Notif } from '../../share/notif/notif';
import { Support } from '../../share/support/support';
import { Param } from '../../share/param/param';

@Component({
  selector: 'app-icon2',
  imports: [Notif,Support,Param],
  templateUrl: './icon2.html',
  styleUrl: './icon2.css',
})
export class Icon2 {

}
