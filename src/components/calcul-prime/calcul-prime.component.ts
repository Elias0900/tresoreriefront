import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../back/model/user';
import {  AgenceVoyageControllerService, BilanControllerService, BilanDto, UserLoginResponseDTO } from '../../back';

@Component({
  selector: 'app-calcul-prime',
  imports: [FormsModule, CommonModule],
  templateUrl: './calcul-prime.component.html',
  
})
export class CalculPrimeComponent {
    readonly agenceService = inject(AgenceVoyageControllerService);
    readonly bilanService = inject(BilanControllerService);
  
  listUser: User[] = []
  agenceId: number | undefined ;
  bilan: BilanDto | undefined;  
  bilanUsers: { [key: number]: BilanDto } = {}; // Stocke les bilans par utilisateur


  loadUserObj() {
    const agenceIdStored = localStorage.getItem('user_agenceId');
    if (agenceIdStored) {
      try {
        this.agenceId = JSON.parse(agenceIdStored!);
        console.log(this.agenceId)
      } catch (error) {
        console.error('Erreur de parsing du token', error);
   
      }
    }
  }

  getUsers() {
    this.agenceService.getUsersByAgence(this.agenceId!).subscribe({
      next: (data) => {
        this.listUser = data;
        console.log('Utilisateurs récupérés :', this.listUser);
  
        // Charger les bilans seulement après avoir récupéré les utilisateurs
        this.loadBilans();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs', err);
      }
    });
  }
  
  loadBilans() {
    this.listUser.forEach((user) => {
      if (user.id !== undefined) {  // Vérifie que user.id est bien défini
        this.bilanService.getBilanByUserId(user.id).subscribe({
          next: (bilan) => {
            this.bilanUsers[user.id!] = bilan; // On force TypeScript à accepter user.id comme clé
          },
          error: (err) => {
            console.error(`Erreur lors de la récupération du bilan pour l'utilisateur ${user.id}`, err);
          }
        });
      } else {
        console.warn("Utilisateur sans ID détecté :", user);
      }
    });
  }

  ngOnInit() {
    this.loadUserObj();
    this.getUsers();
   
  }

  formatPercentage(value: number | undefined): number {
    return value ? Math.floor(value * 100) : 0; // Multiplie par 100 et arrondi à l'entier inférieur
  }

}
