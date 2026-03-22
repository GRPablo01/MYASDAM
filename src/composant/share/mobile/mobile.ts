import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme } from "../theme/theme";
import { ThemeService } from '../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [CommonModule, Theme],
  templateUrl: './mobile.html',
  styleUrls: ['./mobile.css'],
})
export class Mobile implements OnInit {

  isMobile: boolean = false;
  currentWidth: number = window.innerWidth;

  constructor(
      public themeService: ThemeService
    ) {}
  

  ngOnInit() {
    this.checkScreen();
  }

  // 👀 détecte resize écran
  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  // 📱 logique mobile
  checkScreen() {
    this.isMobile = window.innerWidth < 382;
  }

}