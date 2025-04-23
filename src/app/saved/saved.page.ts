import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
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
  showFull?: boolean;
  showIngredients?: boolean;
  removing?: boolean;
  [key: string]: any;
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
  filteredMeals: Meal[] = [];
  savedCategories: string[] = [];
  selectedCategory: string = '';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadSavedMeals();
  }

  loadSavedMeals() {
    const saved = JSON.parse(localStorage.getItem('ezchef-favourites') || '[]') as { idMeal: string }[];

    if (!saved.length) {
      this.savedMeals = [];
      this.filteredMeals = [];
      this.savedCategories = [];
      return;
    }

    const fetches: Observable<{ meals: Meal[] }>[] = saved.map((meal) =>
      this.http.get<{ meals: Meal[] }>(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
    );

    forkJoin(fetches).subscribe((results) => {
      this.savedMeals = results
        .map((res) => res.meals?.[0])
        .filter((meal): meal is Meal => !!meal)
        .map((meal) => ({
          ...meal,
          showFull: false,
          showIngredients: false,
        }));

      this.savedCategories = [...new Set(this.savedMeals.map(m => m.strCategory).filter(Boolean))];
      this.filterByCategory(); 
    });
  }
  getCategoryCount(category: string): number {
    return this.savedMeals.filter(m => m.strCategory === category).length;
  }
  
  filterByCategory() {
    this.filteredMeals = this.selectedCategory
      ? this.savedMeals.filter(m => m.strCategory === this.selectedCategory)
      : [...this.savedMeals];
  }

  toggleInstructions(mealId: string) {
    const meal = this.savedMeals.find(m => m.idMeal === mealId);
    if (meal) meal.showFull = !meal.showFull;
  }

  toggleIngredients(mealId: string) {
    const meal = this.savedMeals.find(m => m.idMeal === mealId);
    if (meal) meal.showIngredients = !meal.showIngredients;
  }

  getIngredients(meal: Meal): string[] {
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure?.trim() || ''} ${ingredient.trim()}`.trim());
      }
    }
    return ingredients;
  }

  async removeFromSaved(mealId: string) {
    // Remove from array instantly to prevent a blank "Card" 
    this.savedMeals = this.savedMeals.filter(m => m.idMeal !== mealId);
    this.filteredMeals = this.savedMeals.filter(
      m => !this.selectedCategory || m.strCategory === this.selectedCategory
    );
  
    const updated = this.savedMeals.map(m => ({ idMeal: m.idMeal }));
    localStorage.setItem('ezchef-favourites', JSON.stringify(updated));
  
    this.savedCategories = [...new Set(this.savedMeals.map(m => m.strCategory).filter(Boolean))];
    if (!this.savedCategories.includes(this.selectedCategory)) {
      this.selectedCategory = '';
      this.filteredMeals = this.savedMeals; 
    }
  
    const toast = await this.toastCtrl.create({
      message: 'Recipe removed from saved 🍽️',
      duration: 2000,
      color: 'danger',
      position: 'bottom',
    });
    toast.present();
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
    this.filteredMeals = [];
    this.savedCategories = [];
    this.selectedCategory = '';
  }
}
