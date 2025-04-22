import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RecipeModalComponent } from '../components/recipe-modal/recipe-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {
  savedMeals: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.loadSavedMeals();
  }

  loadSavedMeals() {
    this.savedMeals = JSON.parse(localStorage.getItem('ezchef-favourites') || '[]');
  }

  async openRecipeModal(mealId: string) {
    const modal = await this.modalCtrl.create({
      component: RecipeModalComponent,
      componentProps: { mealId },
    });
    await modal.present();
  }

  clearAll() {
    localStorage.removeItem('ezchef-favourites');
    this.savedMeals = [];
  }
}
