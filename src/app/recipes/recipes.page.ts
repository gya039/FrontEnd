import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCategories();
    this.loadMeals();
  }

  getCategories() {
    this.http.get<any>('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .subscribe(res => {
        console.log('Categories:', res); 
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
}
