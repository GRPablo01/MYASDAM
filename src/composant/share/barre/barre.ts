import { Component } from '@angular/core';
import { Info } from '../info/info';
import { UserInfo } from '../user-info/user-info';



@Component({
  selector: 'app-barre',
  imports: [UserInfo],
  templateUrl: './barre.html',
  styleUrl: './barre.css',
})
export class Barre {

}
