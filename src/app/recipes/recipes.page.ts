import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule, 
    RouterModule
  ],
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss']
})
export class RecipesPage implements OnInit {
  meals: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMeals();
  }

  loadMeals() {
    this.http.get<any>('https://www.themealdb.com/api/json/v1/1/search.php?s=') //API FOR MEALS/RECIPES
      .subscribe(res => {
        this.meals = res.meals || [];
        console.log(this.meals); 
      });
  }
}