import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../back/model/user';
import { AgenceVoyageControllerService, BilanControllerService, BilanDto } from '../../back';
import { RouterLink } from '@angular/router';
import { PipeDatePipe } from '../pipe-date.pipe';
import { TopbarComponent } from "../topbar/topbar.component";

@Component({
  selector: 'app-calcul-prime',
  imports: [FormsModule, CommonModule, RouterLink, TopbarComponent],
  templateUrl: './calcul-prime.component.html',
})
export class CalculPrimeComponent {
  readonly agenceService = inject(AgenceVoyageControllerService);
  readonly bilanService = inject(BilanControllerService);
  readonly location = inject(Location);

  listUser: User[] = [];
  agenceId: number | undefined;
  bilanUsers: { [key: number]: BilanDto } = {}; // Stocke les bilans par utilisateur

  selectedUserId: number | null = null;
  selectedYearMonth: string = new Date().toISOString().slice(0, 7); // Mois actuel

  loadUserObj() {
    const agenceIdStored = localStorage.getItem('user_agenceId');
    if (agenceIdStored) {
      try {
        this.agenceId = JSON.parse(agenceIdStored);
        console.log('Agence ID récupéré :', this.agenceId);
      } catch (error) {
        console.error('Erreur de parsing du token', error);
      }
    }
  }

  getUsers() {
    console.log('Récupération des utilisateurs pour lagence ID :', this.agenceId);
    if (!this.agenceId) {
      console.warn('Aucune agence ID trouvé, impossible de récupérer les utilisateurs.');
      return;
    }
    
    this.agenceService.getUsersByAgence(this.agenceId).subscribe({
      next: (data) => {
        this.listUser = data;
        console.log('Utilisateurs récupérés :', this.listUser);
        this.loadBilans();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs', err);
      }
    });
  }

  loadBilans() {
    console.log('Chargement des bilans pour les utilisateurs');
    this.listUser.forEach((user) => {
      if (user.id !== undefined) {
        const formattedDate = new PipeDatePipe().transform(new Date());
        console.log(`Récupération du bilan pour l'utilisateur ${user.id} et le mois ${formattedDate}`);
        
        this.bilanService.getBilanByUserIdAndMois(user.id, formattedDate).subscribe({
          next: (bilan) => {
            this.bilanUsers[user.id!] = bilan;
            console.log(`Bilan reçu pour l'utilisateur ${user.id} :`, bilan);
          },
          error: (err) => {
            console.error(`Erreur lors de la récupération du bilan pour l'utilisateur ${user.id}`, err);
          }
        });
      } else {
        console.warn('Utilisateur sans ID détecté :', user);
      }
    });
  }

  loadBilansByUser() {
    console.log('Chargement des bilans pour un utilisateur spécifique ou tous');
    if (!this.selectedYearMonth) {
      console.warn('Aucune date sélectionnée.');
      return;
    }
    
    const formattedDate = this.selectedYearMonth;
    console.log('Mois sélectionné :', formattedDate);
    console.log('Utilisateur sélectionné :', this.selectedUserId);

    if (this.selectedUserId) {
      console.log(`Récupération du bilan pour l'utilisateur ${this.selectedUserId}`);
      this.bilanService.getBilanByUserIdAndMois(this.selectedUserId, formattedDate).subscribe({
        next: (bilan) => {
          this.bilanUsers[this.selectedUserId!] = bilan;
          console.log(`Bilan reçu pour ${this.selectedUserId} :`, bilan);
        },
        error: (err) => {
          console.error(`Erreur lors de la récupération du bilan pour l'utilisateur ${this.selectedUserId}`, err);
        }
      });
    } else {
      console.log('Aucun utilisateur spécifique sélectionné, récupération des bilans pour tous.');
      this.listUser.forEach((user) => {
        if (user.id !== undefined) {
          console.log(`Récupération du bilan pour l'utilisateur ${user.id}`);
          this.bilanService.getBilanByUserIdAndMois(user.id, formattedDate).subscribe({
            next: (bilan) => {
              this.bilanUsers[user.id!] = bilan;
              console.log(`Bilan reçu pour ${user.id} :`, bilan);
            },
            error: (err) => {
              console.error(`Erreur lors de la récupération du bilan pour l'utilisateur ${user.id}`, err);
            }
          });
        } else {
          console.warn('Utilisateur sans ID détecté :', user);
        }
      });
    }
    console.log('Données des bilans mises à jour :', this.bilanUsers);
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    console.log('Initialisation du composant');
    this.loadUserObj();
    this.getUsers();
  }
}
