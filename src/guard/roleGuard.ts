import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role = localStorage.getItem('user_role');

    if (!user || !role) {
      // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié ou n'a pas de rôle
      this.router.navigate(['/login']);
      return false;
    }

    if (role === 'EMPLOYE') {
      // Redirige vers la page Employé si le rôle est EMPLOYE
      this.router.navigate(['/employe']);
      return false;
    } else if (role === 'DIRECTEUR') {
      // Redirige vers la page Directeur si le rôle est DIRECTEUR
      this.router.navigate(['/directeur']);
      return false;
    }

    return true;
  }
}
