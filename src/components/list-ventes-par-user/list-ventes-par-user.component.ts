import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VenteControllerService, VenteDto } from '../../back';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-list-ventes-par-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './list-ventes-par-user.component.html',
  styleUrl: './list-ventes-par-user.component.scss'
})
export class ListVentesParUserComponent {
  isSearching!: boolean;
  searchQuery: string = '';
  constructor(private route: ActivatedRoute) {}
  readonly venteService = inject(VenteControllerService);
  readonly location = inject(Location);
   listVente: VenteDto[] = []
   userId!: number
   

   getVentes(): void {
    if (!this.userId) { // Vérifie si l'ID est invalide
      console.error('Utilisateur non connecté ou identifiant manquant');
      return;
    }

    this.venteService.ventesDuMois(this.userId).subscribe({
      next: (data) => {
        this.listVente = data;
        console.log('Ventes récupérées :', this.listVente);
   
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des ventes', err);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    const userIdParam = this.route.snapshot.paramMap.get('id');
    
    if (userIdParam) {
      this.userId = Number(userIdParam); // Convertir en nombre
      console.log('User ID:', this.userId);
      this.getVentes(); // Récupérer les ventes après l'initialisation
    } else {
      console.error('ID utilisateur non fourni dans l’URL');
    }
  }

  onSearch(): void {
    if (!this.userId) {
      console.warn('Impossible de rechercher : agenceId non défini.');
      return;
    }
  
    this.isSearching = true;
  
    // Si la recherche est vide, afficher toutes les ventes
    if (!this.searchQuery.trim()) {
      this.getVentes(); // Recharge toutes les ventes
      this.isSearching = false;
      return;
    }
  
    // Effectuer la recherche
    this.venteService.searchVentesByAgence(this.userId, this.searchQuery).subscribe({
      next: (data) => {
        this.listVente = data;
        console.log('Résultats de la recherche:', this.listVente);  // Vérification dans la console
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
        this.isSearching = false;
      }
    });
  }
}
