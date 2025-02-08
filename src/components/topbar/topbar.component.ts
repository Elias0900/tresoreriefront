import { Component, inject } from '@angular/core';
import { User } from '../../back/model/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  readonly router = inject(Router);
  user: User | null = null;
  sidenavOpen: boolean | undefined;
  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  loadUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        console.log(this.user)
      } catch (error) {
        console.error('Erreur de parsing du token', error);
        this.user = null;
      }
    }
  }

  logout() {
    localStorage.clear();
    this.user = null;
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.loadUser();
  }
  
}


