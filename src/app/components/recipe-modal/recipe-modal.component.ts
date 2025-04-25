import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss']
})
export class RecipeModalComponent implements OnInit {
  @Input() mealId!: string;
  meal: any;

  constructor(private http: HttpClient, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.http.get<any>(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${this.mealId}`)
      .subscribe(res => {
        this.meal = res.meals[0];
      });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  // Extracts a formatted list of ingredients with measurements
  getIngredients(): string[] {
    if (!this.meal) return [];
    const ingredients: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = this.meal[`strIngredient${i}`];
      const measure = this.meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure?.trim()} ${ingredient.trim()}`);
      }
    }

    return ingredients;
  }

}



