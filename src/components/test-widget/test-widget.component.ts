import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Component, inject } from '@angular/core';
import { User } from '../../back/model/user';
import { VenteDto } from '../../back/model/models';
import { VenteControllerService } from '../../back/api/venteController.service';

@Component({
  selector: 'app-test-widget',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule],
  templateUrl: './test-widget.component.html',
  styleUrl: './test-widget.component.css'
})
export class TestWidgetComponent {
    user: User | null = null;
    ventes: VenteDto[] = [];
      readonly venteService = inject(VenteControllerService);
    
  getVentes(): void {
    if (!this.user || !this.user.id) {
      console.error('Utilisateur non connecté ou identifiant manquant');
      return;
    }

    this.venteService.getAllVentes().subscribe({
      next: (data) => {
        this.ventes = data;
        console.log('Ventes récupérées :', this.ventes);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des ventes', err);
      }
    });
  }

  loadUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (error) {
        console.error('Erreur de parsing du token', error);
        this.user = null;
      }
    }
  }

}
