import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'recipes',
    loadComponent: () =>
      import('./recipes/recipes.page').then((m) => m.RecipesPage),
  },
  {
    path: 'saved',
    loadComponent: () => import('./saved/saved.page').then( m => m.SavedPage)
  },
];

