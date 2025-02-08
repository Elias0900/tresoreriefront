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
    path: 'employe',
    component: EmployeComponent,
    title: 'Dashboard Employe',
  
  },
  {
    path: 'directeur',
    component: DirectorComponent,
    title: 'Dashboard Directeur',
    
  }
]

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),  provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),  providePrimeNG({
      theme: {
          preset: Aura
      }})]
};
