import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  recentSaved: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    try {
      const saved = localStorage.getItem('ezchef-favourites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.recentSaved = parsed.slice(-5).reverse();
        }
      }
    } catch (error) {
      console.error('Failed to load saved recipes:', error);
    }
  }

  openRecipeModal(idMeal: string) {
    this.router.navigate(['/recipe', idMeal]);
  }
}
