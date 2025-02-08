import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-objectif',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-objectif.component.html',
  styleUrl: './modal-objectif.component.scss'
})
export class ModalObjectifComponent {
  objectif: number = 0; // Objectif par défaut

@Output() objectifChanged: EventEmitter<number> = new EventEmitter<number>();
@Output() closeModal: EventEmitter<void> = new EventEmitter<void>(); // Événement pour fermer la modal

  constructor() { }

  save() {
    this.objectifChanged.emit(this.objectif); // Émet l'objectif modifié au parent
    this.closeModal.emit(); // Demande au parent de fermer la modal
      }

}
