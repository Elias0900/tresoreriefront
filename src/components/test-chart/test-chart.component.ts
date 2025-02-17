import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { VenteControllerService } from '../../back';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';


@Component({
  selector: 'app-test-chart',
  standalone: true,
  imports: [ChartModule, CommonModule, FluidModule],
  templateUrl: './test-chart.component.html',
  styleUrls: ['./test-chart.component.css']
})
export class TestChartComponent implements OnInit, OnDestroy {
  lineData: any;

  barData: any;

  pieData: any;

  polarData: any;

  radarData: any;

  lineOptions: any;

  barOptions: any;

  pieOptions: any;

  polarOptions: any;

  radarOptions: any;

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

    this.subscription.add(
      this.venteService.getVentesParMoisCharts(currentYear).subscribe((ventes) => {
        this.initBarChart(ventes);
      })
    );

    this.subscription.add(
      this.venteService.getVentesParAn().subscribe((ventes) => {
        this.initPieChart(ventes);
      })
    );
  }

  initLineChart(ventes: any[]) {
    if (ventes && Array.isArray(ventes)) {
      this.lineData = {
        labels: ventes.map((v) => v.date), // Utilise v.date ici
        datasets: [
          {
            label: 'Ventes par jour',
            data: ventes.map((v) => v.nombreVentes), // Utilise v.totalVentes ici
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66, 165, 245, 0.2)',
            fill: true,
          },
        ],
      };
    } else {
      console.error('Les données des ventes sont mal formatées:', ventes);
    }
  }
  

  initBarChart(ventes: any[]) {
    if (ventes && Array.isArray(ventes)) {
      this.barData = {
        labels: ventes.map((v) => v.date), // Utilise v.date ici
        datasets: [
          {
            label: 'Ventes par mois',
            backgroundColor: '#FFA726',
            borderColor: '#FB8C00',
            data: ventes.map((v) => v.nombreVentes), // Utilise v.totalVentes ici
          },
        ],
      };
    } else {
      console.error('Les données des ventes sont mal formatées:', ventes);
    }
  }
  

  initPieChart(ventes: any[]) {
    if (ventes && Array.isArray(ventes)) {
      this.pieData = {
        labels: ventes.map((v) => v.date), // Utilise v.date ici
        datasets: [
          {
            data: ventes.map((v) => v.nombreVentes), // Utilise v.totalVentes ici
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      };
    } else {
      console.error('Les données des ventes sont mal formatées:', ventes);
    }
  }
  

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
