import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { VenteControllerService } from '../../../back';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-chart-par-mois',
  imports: [ChartModule, CommonModule, FluidModule],
  templateUrl: './chart-par-mois.component.html',
  styleUrls: ['./chart-par-mois.component.scss']
})
export class ChartParMoisComponent {
  barData: any;
  barOptions: any;
  subscription: Subscription = new Subscription();
  readonly venteService = inject(VenteControllerService);

  constructor() {}

  ngOnInit() {
    this.loadVenteData();
  }

  loadVenteData() {
    const currentYear = new Date().getFullYear();

    this.subscription.add(
      this.venteService.getVentesParMoisCharts(currentYear).subscribe((ventes) => {
        this.initBarChart(ventes);
      })
    );
  }

  initBarChart(ventes: any[]) {
    const documentStyle = getComputedStyle(document.documentElement);

    if (ventes && Array.isArray(ventes)) {
      this.barData = {
        labels: ventes.map((v) => this.formatDate(v.date)), // Formater la date pour afficher le mois
        datasets: [
          {
            label: 'Nombre de ventes par mois',
            backgroundColor: 'rgba(66, 214, 97, 0.2)', // Vert pâle pour l'arrière-plan
            borderColor: '#66BB6A', // Vert pour la ligne
            data: ventes.map((v) => v.nombreVentes), // Données pour les ventes
            fill: true,
            yAxisID: 'y1', // Assigner cet axe à l'axe Y gauche
          },
          {
            label: 'Prix des ventes par mois',
            backgroundColor: 'rgba(66, 165, 245, 0.2)', // Bleu pâle pour l'arrière-plan
            borderColor: '#42A5F5', // Bleu pour la ligne
            data: ventes.map((v) => v.totalVentes), // Données pour les prix
            fill: true,
            yAxisID: 'y2', // Assigner cet axe à l'axe Y droit
          },
        ],
      };

      // Configuration des axes
      this.barOptions = {
        responsive: true,
        scales: {
          y1: {
            type: 'linear',
            position: 'left',
            ticks: {
              beginAtZero: true,
              color: '#66BB6A', // Vert pour l'axe de gauche
            },
            grid: {
              display: false
            },
          },
          y2: {
            type: 'linear',
            position: 'right',
            ticks: {
              beginAtZero: true,
              color: '#42A5F5', // Bleu pour l'axe de droite
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.2)', // Gris pâle pour l'axe de droite
            },
          },
        },
      };
    } else {
      console.error('Les données des ventes sont mal formatées:', ventes);
    }
  }

  // Fonction pour formater la date en mois et année
  formatDate(date: string): string {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const dateObj = new Date(date);
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${month} ${year}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
