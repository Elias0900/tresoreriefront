import { Component, inject } from '@angular/core';
import { AssuranceAndFramDto, VenteControllerService } from '../../../../back';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-pourcentage-assurance',
  imports: [ChartModule, CommonModule, FluidModule],
  templateUrl: './pourcentage-assurance.component.html',
  styleUrl: './pourcentage-assurance.component.scss'
})
export class PourcentageAssuranceComponent {
  agenceId: number | undefined;
  nombreAssurance!: number;
  venteTotal!: number;
  pourcentageAssurance!: number;
  venteSansAssurance!: number;
  venteFram!: number;
  venteSansFram!: number;

  subscription: Subscription = new Subscription();
  readonly venteService = inject(VenteControllerService);

  pieData: any;
  pieOptions: any;

  constructor() { }

  ngOnInit() {
    this.loadUserObj();
    this.recupChamps();

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    };
  }

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

  recupChamps() {
    if (this.agenceId === undefined) {
      console.error('Agence ID non défini');
      return;
    }

    this.subscription.add(
      this.venteService.setAssuranceAndFram(this.agenceId).subscribe({
        next: (data: AssuranceAndFramDto) => {
          console.log('Données récupérées :', data);

          this.venteSansAssurance = data.venteSansAssurance!;
          this.nombreAssurance = data.assuranceTotal!;
          this.pourcentageAssurance = data.pourcentageAssurance!;
          this.venteFram = data.venteFram!;
          this.venteSansFram = data.venteSansFram!;

          // Mise à jour des données du Pie Chart
          this.updatePieChart();
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des données', error);
        }
      })
    );
  }

  updatePieChart() {
    this.pieData = {
      labels: ['Ventes avec assurance', 'Ventes sans assurance', 'Ventes FRAM', 'Ventes sans FRAM'], // Ajout des labels manquants
      datasets: [
        {
          data: [this.nombreAssurance, this.venteSansAssurance, this.venteFram, this.venteSansFram],
          backgroundColor: ['#42A5F5', '#FF6384', '#FFA726', '#66BB6A'], // Ajout d'une couleur pour "Ventes sans FRAM"
          hoverBackgroundColor: ['#64B5F6', '#FF7A99', '#FFB74D', '#81C784'] // Ajout d'une couleur de survol pour "Ventes sans FRAM"
        }
      ]
    };
    this.pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 14 // Augmente la taille des labels pour plus de lisibilité
            }
          }
        }
      }
    };
    
    console.log('Pie Data:', this.pieData); // Vérifier les données
  }
  
}
