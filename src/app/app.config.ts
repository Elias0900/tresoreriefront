import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EmployeComponent } from '../components/employe/employe.component';
import { authInterceptor } from '../interceptor/auth.interceptor';
import { DirectorComponent } from '../components/director/director.component';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { RoleGuard } from '../guard/roleGuard';
import { CalculPrimeComponent } from '../components/calcul-prime/calcul-prime.component';
import { ListVentesParUserComponent } from '../components/list-ventes-par-user/list-ventes-par-user.component';
import { RegisterComponent } from '../components/register/register.component';
import { AjoutVenteDirectorComponent } from '../components/ajout-vente-director/ajout-vente-director.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Page de connexion',
  }, 
  {
    path: 'login',
    component: LoginComponent,
    title: 'Page de connexion',
  }, 
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Inscription',
  }, 
  {
    path: 'employe',
    component: EmployeComponent,
    title: 'Dashboard Employe',
  
  },
  {
    path: 'directeur',
    component: DirectorComponent,
    title: 'Dashboard Directeur',
  },
  {
    path: 'prime',
    component: CalculPrimeComponent,
    title: 'Prime'
  },
  {
    path: 'ventes-user/:id',
    component: ListVentesParUserComponent,
    title:'detail-ventes'
  },
  {
    path: 'ajout-vente/:id',
    component: AjoutVenteDirectorComponent,
    title: 'Ajouter une vente'
  }
]

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),  provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),  providePrimeNG({
      theme: {
          preset: Aura
      }})]
};
