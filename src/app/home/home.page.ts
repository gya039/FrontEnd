import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RecipeModalComponent } from '../components/recipe-modal/recipe-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, HttpClientModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  recentSaved: any[] = [];
  recipeOfTheDay: any = null;

  constructor(private http: HttpClient, private modalCtrl: ModalController) {}

  ngOnInit() {
    try {
      const saved = localStorage.getItem('ezchef-favourites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.recentSaved = parsed.slice(-5).reverse();

          const today = new Date().toDateString();
          const stored = localStorage.getItem('ezchef-rotod');
          const parsedStored = stored ? JSON.parse(stored) : null;

          if (parsedStored && parsedStored.date === today && parsedStored.recipe?.strMeal) {
            this.recipeOfTheDay = parsedStored.recipe;
          } else {
            const validRecipes = parsed.filter(meal => meal.idMeal);
            const random = validRecipes[Math.floor(Math.random() * validRecipes.length)];

            if (random.strMeal && random.strMealThumb) {
              this.recipeOfTheDay = random;
              localStorage.setItem('ezchef-rotod', JSON.stringify({ date: today, recipe: random }));
            } else {
              this.fetchMealDetails(random.idMeal).then(fullMeal => {
                if (fullMeal) {
                  this.recipeOfTheDay = fullMeal;
                  localStorage.setItem(
                    'ezchef-rotod',
                    JSON.stringify({ date: today, recipe: fullMeal })
                  );
                }
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load saved recipes:', error);
    }
  }

  async fetchMealDetails(idMeal: string): Promise<any> {
    try {
      const res: any = await this.http
        .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        .toPromise();
      return res?.meals?.[0] || null;
    } catch (err) {
      console.error('Error fetching full meal details:', err);
      return null;
    }
  }

  async openRecipeModal(idMeal: string | undefined) {
    if (!idMeal) return;
  
    const modal = await this.modalCtrl.create({
      component: RecipeModalComponent,
      componentProps: {
        mealId: idMeal, 
      },
    });
  
    await modal.present();
  }
  
}
