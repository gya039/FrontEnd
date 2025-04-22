import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { RecipeModalComponent } from '../components/recipe-modal/recipe-modal.component';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
}

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {
  savedMeals: Meal[] = [];

  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit() {
    this.loadSavedMeals();
  }

  loadSavedMeals() {
    const saved = JSON.parse(localStorage.getItem('ezchef-favourites') || '[]') as { idMeal: string }[];

    if (!saved.length) {
      this.savedMeals = [];
      return;
    }

    const fetches: Observable<{ meals: Meal[] }>[] = saved.map((meal) =>
      this.http.get<{ meals: Meal[] }>(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      )
    );

    forkJoin(fetches).subscribe((results: { meals: Meal[] }[]) => {
      this.savedMeals = results
        .map((res) => res.meals?.[0])
        .filter((meal): meal is Meal => !!meal);
    });
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
