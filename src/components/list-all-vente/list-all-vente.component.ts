import { Component, ElementRef, inject, ViewChild, OnInit } from '@angular/core';
import { AuthControllerService, UserControllerService, UserDTO, VenteControllerService, VenteDto } from '../../back';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';


@Component({
  selector: 'app-list-all-vente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    MultiSelectModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    RouterLink
  ],
  templateUrl: './list-all-vente.component.html',
  styleUrl: './list-all-vente.component.scss'
})
export class ListAllVenteComponent implements OnInit {
  readonly venteService = inject(VenteControllerService);
  readonly userService = inject(UserControllerService);
  readonly router = inject(Router);
  readonly location = inject(Location);
  ventes: VenteDto[] = []; // Liste des ventes
  searchQuery: string = ''; // Recherche utilisateur
  objectif: number = 0; // Objectif stocké
  agenceId: number | undefined; // ID de l'agence
  isSearching: boolean = false; // Gestion affichage "Aucun résultat"
  userDto!: UserDTO
  userId!: number;

  @ViewChild('filter') filter!: ElementRef;

  ngOnInit(): void {
    this.loadUserObj();
    this.getVentes();
  }

  // Charge les données de l'utilisateur depuis localStorage
  loadUserObj(): void {
    const objectifStored = localStorage.getItem('user_objectif');
    const agenceIdStored = localStorage.getItem('user_agenceId');
    const userIdStored = localStorage.getItem('user_id')

    if (objectifStored && agenceIdStored) {
      try {
        this.objectif = JSON.parse(objectifStored);
        this.agenceId = JSON.parse(agenceIdStored);
        this.userId = JSON.parse(userIdStored!);
        console.log('Agence ID:', this.agenceId, 'Objectif:', this.objectif);
      } catch (error) {
        console.error('Erreur de parsing du token', error);
      }
    }
  }

  // Récupère toutes les ventes
  getVentes(): void {
    this.venteService.getAllVentes().subscribe({
      next: (data) => {
        this.ventes = data;
        console.log('Ventes récupérées:', this.ventes);
      
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des ventes', err);
      }
    });
  }



  
  goToPrime() {
    this.router.navigate(['/prime']);
  }

  goToVente() {
    this.router.navigate(['/ajout-ventes']);
  }

  

  // Recherche les ventes par agence
  onSearch(): void {
    if (!this.agenceId) {
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
    this.venteService.searchVentesByAgence(this.agenceId, this.searchQuery).subscribe({
      next: (data) => {
        this.ventes = data;
        console.log('Résultats de la recherche:', this.ventes);  // Vérification dans la console
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
        this.isSearching = false;
      }
    });
  }


}
