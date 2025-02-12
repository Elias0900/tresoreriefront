import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthControllerService } from '../back';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-promovac-front';
  isLoggedIn: boolean = false;  // Variable qui détermine si l'utilisateur est connecté

  readonly authService = inject(AuthControllerService)

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    // Vérifiez si un utilisateur est stocké dans le localStorage
    const user = localStorage.getItem('user');  // Par exemple, 'user' pourrait être un objet JSON ou un token
    if (user) {
      this.isLoggedIn = true;  // L'utilisateur est connecté si l'objet existe dans localStorage
    } else {
      this.isLoggedIn = false;  // Sinon, l'utilisateur n'est pas connecté
    }
  }
}
