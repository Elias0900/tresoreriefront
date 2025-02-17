import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { VenteControllerService } from '../../../back';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-chart-par-jour',
  imports: [ChartModule, CommonModule, FluidModule],
  templateUrl: './chart-par-jour.component.html',
  styleUrls: ['./chart-par-jour.component.scss'],
})
export class ChartParJourComponent {
  lineData: any; // Pour le nombre de ventes
  lineDataPrice: any; // Pour le prix des ventes
  lineOptions: any;

  subscription: Subscription = new Subscription();
  readonly venteService = inject(VenteControllerService);

  constructor() {}

  ngOnInit() {
    this.loadVenteData();
  }

  loadVenteData() {
    const currentYear = new Date().getFullYear();

    this.subscription.add(
      this.venteService.getVentesParJourCharts(currentYear).subscribe((ventes) => {
        this.initLineChart(ventes);
      })
    );
  }

  initLineChart(ventes: any[]) {
    const documentStyle = getComputedStyle(document.documentElement);

    if (ventes && Array.isArray(ventes)) {
      this.lineData = {
        labels: ventes.map((v) => v.date ),
        datasets: [
          {
            label: 'Nombre de ventes par jour',
            data: ventes.map((v) => v.nombreVentes),
            backgroundColor: 'rgba(66, 214, 97, 0.2)', // Vert pâle pour l'arrière-plan de la courbe
            borderColor: '#66BB6A', // Vert pour la ligne de la courbe
            tension: 0.3,
            fill: false,
            yAxisID: 'y1', // Axe pour le nombre de ventes
          },
          {
            label: 'Prix des ventes par jour',
            data: ventes.map((v) => v.totalVentes), // Vérifie le bon champ pour le prix
            backgroundColor: 'rgba(66, 165, 245, 0.2)', // Bleu pâle pour l'arrière-plan de la courbe
            borderColor: '#42A5F5', // Bleu pour la ligne de la courbe
            tension: 0.4,
            fill: false,
            yAxisID: 'y2', // Axe pour le prix des ventes
          },
        ],
      };
      this.lineOptions = {
        responsive: true,
        scales: {
          y1: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            grid: {
              display: false, // Masque les lignes de la grille
            },
            ticks: {
              color: '#66BB6A', // Couleur des ticks pour le nombre de ventes (vert pâle)
            },
            title: {
              display: false, // Masque le titre de l'axe
            },
          },
          y2: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.2)', // Gris pâle pour l'axe de droite
            },
            ticks: {
              color: '#42A5F5', // Couleur des ticks pour le prix des ventes (bleu pâle)
            },
            title: {
              display: false, // Masque le titre de l'axe
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true, // Garder les info-bulles activées
          },
        },
        elements: {
          line: {
            tension: 0.4, // Arrondir les courbes
          },
        },
      };
      
    } else {
      console.error('Les données des ventes sont mal formatées:', ventes);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
