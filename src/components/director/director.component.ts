import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartParJourComponent } from "../chart/chart-par-jour/chart-par-jour.component";
import { ChartParMoisComponent } from "../chart/chart-par-mois/chart-par-mois.component";
import { Subscription } from 'rxjs';
import { AgenceVoyagecontrollerService, BilanControllerService, VenteControllerService } from '../../back';
import { ListAllVenteComponent } from "../list-all-vente/list-all-vente.component";
import { CommonModule } from '@angular/common';
import { ProgressBar } from 'primeng/progressbar';
import {  TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ModalObjectifComponent } from "../modal-objectif/modal-objectif.component";
import { AgenceVoyage } from '../../back/model/agenceVoyage';
import { User } from '../../back/model/user';
import { TopbarComponent } from "../topbar/topbar.component";


@Component({
  selector: 'app-director',
  imports: [ButtonModule,
    FormsModule,
    ChartParJourComponent,
    ChartParMoisComponent,
    ListAllVenteComponent,
    CommonModule,
    ProgressBar,
    TooltipModule,
    DialogModule, ModalObjectifComponent, TopbarComponent],
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css']
})
export class DirectorComponent implements OnInit, OnDestroy {
  ventesHier: { nombreVentes: number; date: string; message: string; evolution?: number } = { 
    nombreVentes: 0, 
    date: '', 
    message: '', 
    evolution: undefined
  };

  ventesMois: { VenteMois: number; date: number; message: string; evolution?: number } = { 
    VenteMois: 0, 
    date: 0, 
    message: '', 
    evolution: undefined
  };
  ventesAn: { ventesAn: number; date: number; message: string; evolution?: number } = { 
    ventesAn: 0, 
    date: 0, 
    message: '', 
    evolution: undefined
  };
  objectif: number = 0;    // Objectif par défaut
  progression: number | undefined ;     // Progression de l'objectif
  agenceId: number | undefined ;     // Progression de l'objectif
  venteTotal: number = 0;      // Total des ventes
  agence: AgenceVoyage | undefined;
  user: User | null = null;

  subscription: Subscription = new Subscription();
  readonly venteService = inject(VenteControllerService);
  readonly bilanService = inject(BilanControllerService);
  readonly agenceService = inject(AgenceVoyagecontrollerService);

  constructor() {}
  loadUserObj() {
    const objectifStored = localStorage.getItem('user_objectif');
    const agenceIdStored = localStorage.getItem('user_agenceId');
    if (objectifStored) {
      try {
        this.objectif = JSON.parse(objectifStored);
        this.agenceId = JSON.parse(agenceIdStored!);
        console.log(this.agenceId)
        console.log(this.objectif)
      } catch (error) {
        console.error('Erreur de parsing du token', error);
        this.user = null;
      }
    }
 
  }



  updateObjectif(newObjectif: number) {
    console.log("Nouvel objectif reçu :", newObjectif);
    this.objectif = newObjectif;
  
    // Envoi de la mise à jour avec le bon paramètre
    this.agenceService.updateObjectif(this.agenceId!, { objectif: newObjectif }).subscribe({
      next: (updatedAgence: AgenceVoyage) => {
        console.log("Objectif mis à jour avec succès:", updatedAgence.objectif);
        this.objectif = updatedAgence.objectif!;
        this.calculateProgression(); // Mise à jour correcte après la réponse du serveur
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'objectif :", err);
      }
    });
  }
  

  


  // Méthode pour calculer la progression de la barre
  calculateProgression(): void {
    if (this.venteTotal > 0 && this.objectif > 0) {
      console.log("Calcul progression avec :", this.venteTotal, "et objectif :", this.objectif);
      
      // Calcul de la progression en pourcentage
      this.progression = (this.venteTotal / this.objectif) * 100;
  
      // Limiter la progression à un maximum de 100
      if (this.progression > 100) {
        this.progression = 100;
      }
    } else {
      console.error('Valeur incorrecte pour venteTotal ou objectif', this.venteTotal, this.objectif);
      this.progression = 0;
    }
    console.log('Progression après calcul:', this.progression);
  }
  

  ngOnInit() {
    this.loadVenteData();
    this.loadVenteMoisData();
    this.loadVenteAnneeData();
    this.loadTotalVente();
    this.loadUserObj();
  }


  loadVenteData() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); 
    const formattedYesterday = this.formatDate(yesterday);

    this.subscription.add(
      this.venteService.getVentesParJour(formattedYesterday, formattedYesterday).subscribe((ventesHier) => {
        this.ventesHier.nombreVentes = ventesHier.length > 0 ? ventesHier[0].nombreVentes! : 0;
        this.ventesHier.date = ventesHier.length > 0 ? ventesHier[0].date! : '';
        this.ventesHier.message = ventesHier.length > 0 ? '' : '0 vente';

        // Charger les ventes de l'avant-veille pour comparer
        const beforeYesterday = new Date();
        beforeYesterday.setDate(beforeYesterday.getDate() - 2);
        const formattedBeforeYesterday = this.formatDate(beforeYesterday);

        this.venteService.getVentesParJour(formattedBeforeYesterday, formattedBeforeYesterday).subscribe((ventesAvantVeille) => {
          const nombreVentesAvantVeille = ventesAvantVeille.length > 0 ? ventesAvantVeille[0].nombreVentes! : 0;
          this.ventesHier.evolution = this.ventesHier.nombreVentes - nombreVentesAvantVeille;
        });
      })
    );
  }

  loadVenteMoisData() {
    const currentYear = new Date().getFullYear();
  
    this.subscription.add(
      this.venteService.getVentesParMoisCharts(currentYear).subscribe((ventesMois) => {
        if (ventesMois.length > 0) {
          // Trier les ventes par date si elles existent
          ventesMois.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateA - dateB;
          });
  
          // Mois actuel et précédent
          const moisActuel = new Date().getMonth() + 1; // Janvier = 1
          const ventesMoisActuel = ventesMois.find(v => v.date && new Date(v.date).getMonth() + 1 === moisActuel);
          const ventesMoisPrecedent = ventesMois.find(v => v.date && new Date(v.date).getMonth() + 1 === (moisActuel - 1));
  
          // Initialisation des ventes du mois actuel
          this.ventesMois = {
            VenteMois: ventesMoisActuel ? ventesMoisActuel.nombreVentes! : 0,
            date: moisActuel,
            message: ventesMoisActuel ? '' : '0 vente',
            evolution: 0
          };
  
          // Comparaison avec le mois précédent
          const nombreVentesMoisPrecedent = ventesMoisPrecedent ? ventesMoisPrecedent.nombreVentes! : 0;
          this.ventesMois.evolution = this.ventesMois.VenteMois - nombreVentesMoisPrecedent;
        } else {
          // Cas où aucune donnée n'est reçue
          this.ventesMois = { VenteMois: 0, date: new Date().getMonth() + 1, message: '0 vente', evolution: 0 };
        }
      })
    );
  }
  
  loadVenteAnneeData() {
    this.subscription.add(
      this.venteService.getVentesParAn().subscribe((ventesAn) => {
        if (ventesAn.length > 0) {
          // Trier les ventes par année
          ventesAn.sort((a, b) => {
            const anneeA = a.date ? new Date(a.date).getFullYear() : 0;
            const anneeB = b.date ? new Date(b.date).getFullYear() : 0;
            return anneeA - anneeB;
          });
  
          // Année actuelle et précédente
          const anneeActuelle = new Date().getFullYear();
          const ventesAnneeActuelle = ventesAn.find(v => v.date && new Date(v.date).getFullYear() === anneeActuelle);
          const ventesAnneePrecedente = ventesAn.find(v => v.date && new Date(v.date).getFullYear() === (anneeActuelle - 1));
  
          // Initialisation des ventes de l'année actuelle
          this.ventesAn = {
            ventesAn: ventesAnneeActuelle ? ventesAnneeActuelle.nombreVentes! : 0,
            date: anneeActuelle,
            message: ventesAnneeActuelle ? '' : '0 vente',
            evolution: 0
          };
  
          // Comparaison avec l'année précédente
          const nombreVentesAnneePrecedente = ventesAnneePrecedente ? ventesAnneePrecedente.nombreVentes! : 0;
          this.ventesAn.evolution = this.ventesAn.ventesAn - nombreVentesAnneePrecedente;
        } else {
          // Cas où aucune donnée n'est reçue
          this.ventesAn = { ventesAn: 0, date: new Date().getFullYear(), message: '0 vente', evolution: 0 };
        }
      })
    );
  }

  loadTotalVente() {
    this.venteService.getTotalMontant().subscribe((totalMontant) => {
      this.venteTotal = totalMontant;
      console.log("Vente totale mise à jour :", this.venteTotal);
  
      // Vérifier si l'objectif est déjà défini avant de calculer la progression
      if (this.objectif > 0) {
        this.calculateProgression();
      }
    });
  }
  

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
