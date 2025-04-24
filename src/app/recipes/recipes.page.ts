import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { RecipeModalComponent } from '../components/recipe-modal/recipe-modal.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss']
})
export class RecipesPage implements OnInit {
  meals: any[] = [];
  categories: string[] = [];
  selectedCategory: string = '';

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getCategories();
    this.loadMeals();
  }

  getCategories() {
    this.http.get<any>('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .subscribe(res => {
        this.categories = res.meals?.map((cat: any) => cat.strCategory) || [];
      });
  }

  loadMeals(category?: string) {
    const url = category
      ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      : 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

    this.http.get<any>(url)
      .subscribe(res => {
        this.meals = res.meals || [];
      });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.loadMeals(cat);
  }

  async openRecipeModal(mealId: string) {
    const modal = await this.modalCtrl.create({
      component: RecipeModalComponent,
      componentProps: { mealId }
    });
    await modal.present();
  }

  async toggleSave(meal: any) {
    const saved = JSON.parse(localStorage.getItem('ezchef-favourites') || '[]');
    const exists = saved.find((r: any) => r.idMeal === meal.idMeal);

    // Toasts but couldnt get android studio/electron working to test used 
    // used a popup to test so hope it works
    if (exists) {
      const updated = saved.filter((r: any) => r.idMeal !== meal.idMeal);
      localStorage.setItem('ezchef-favourites', JSON.stringify(updated));
      await Toast.show({ text: 'Recipe removed', duration: 'short' });
    } else {
      saved.push(meal);
      localStorage.setItem('ezchef-favourites', JSON.stringify(saved));
      await Toast.show({ text: 'Recipe saved', duration: 'short' });
    }
  }

  isSaved(idMeal: string): boolean {
    const saved = JSON.parse(localStorage.getItem('ezchef-favourites') || '[]');
    return saved.some((r: any) => r.idMeal === idMeal);
  }
}
