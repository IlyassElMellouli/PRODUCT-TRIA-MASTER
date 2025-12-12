import { Routes } from '@angular/router';
import { HomeComponent } from './shared/features/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component'; 
import { ContactComponent } from './shared/features/contact/contact.component';

export const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent,  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, 
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then((m) => m.PRODUCTS_ROUTES),
  },
  { 
    path: 'contact', 
    component: ContactComponent,
    title: 'Contactez-nous'
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];