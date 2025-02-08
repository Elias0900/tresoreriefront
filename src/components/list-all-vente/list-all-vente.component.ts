import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { VenteControllerService, VenteDto } from '../../back';

@Component({
  selector: 'app-list-all-vente',
  imports: [ TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule],
  templateUrl: './list-all-vente.component.html',
  styleUrl: './list-all-vente.component.scss'
})
export class ListAllVenteComponent {
  readonly venteService = inject(VenteControllerService);
  ventes: VenteDto[] = [];
  @ViewChild('filter') filter!: ElementRef;

  getVentes(): void {

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

 
  ngOnInit() {
    this.getVentes();
  }
}
