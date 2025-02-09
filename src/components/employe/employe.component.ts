import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthControllerService, BilanControllerService, BilanDto, VenteControllerService, VenteDto } from '../../back';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PercentageColorDirective } from '../../directive/objectif.directive';
import { User } from '../../back/model/user';

@Component({
  selector: 'app-employe',
  imports: [NgIf, NgFor, ReactiveFormsModule, PercentageColorDirective],
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css']
})
export class EmployeComponent implements OnInit {
  readonly venteService = inject(VenteControllerService);
  readonly bilanService = inject(BilanControllerService);
  readonly router = inject(Router);

  user: User | null = null;
  ventes: VenteDto[] = [];
  bilan: BilanDto | null = null;
  salesForm: FormGroup;
  fields = [
    { id: 'nom', label: 'Nom', type: 'text', model: 'nom', validators: [Validators.required] },
    { id: 'prenom', label: 'Prénom', type: 'text', model: 'prenom', validators: [Validators.required] },
    { id: 'numeroDossier', label: 'Numéro de dossier', type: 'text', model: 'numeroDossier', validators: [Validators.required] },
    { id: 'pax', label: 'Nombre de personnes', type: 'number', model: 'pax', validators: [Validators.required, Validators.min(1)] },
    { id: 'dateValidation', label: 'Date de validation', type: 'date', model: 'dateValidation', validators: [Validators.required] },
    { id: 'dateDepart', label: 'Date de départ', type: 'date', model: 'dateDepart', validators: [Validators.required] },
    { 
      id: 'tourOperateur', label: 'Tour Opérateur', type: 'select', model: 'tourOperateur', 
      options: [{ value: 'FRAM', label: 'FRAM' }, { value: 'AUTRE', label: 'Autres' }],
      validators: [Validators.required] 
    },
    { id: 'venteTotal', label: 'Montant total', type: 'number', model: 'venteTotal', validators: [Validators.required, Validators.min(0)] },
    { id: 'assurance', label: 'Assurance souscrite', type: 'checkbox', model: 'assurance' },
    { id: 'montantAssurance', label: "Montant de l'assurance", type: 'number', model: 'montantAssurance' },
    { id: 'fraisAgence', label: "Frais d'agence", type: 'number', model: 'fraisAgence', validators: [Validators.required, Validators.min(0)] },
    { id: 'totalSansAssurance', label: 'Total sans assurance', type: 'number', model: 'totalSansAssurance', validators: [Validators.required, Validators.min(0)] },
    { id: 'userId', type: 'number', model: 'userId' }
  ];
  objectif: number = 0;    // Objectif par défaut


  constructor(private fb: FormBuilder) {
    this.salesForm = this.fb.group({});
  }

  ajouterVente() {
    if (this.salesForm.invalid) {
      return;
    }

    const nouvelleVente = this.salesForm.value;
    console.log('Nouvelle vente ajoutée :', nouvelleVente);

    this.venteService.saveOrUpdateVente(nouvelleVente).subscribe({
      next: (response) => {
        console.log('Vente enregistrée avec succès', response);
        this.salesForm.reset();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de la vente', err);
      }
    });
  }

  getBilan(): void {
    if (!this.user || !this.user.id) {
      console.error('Utilisateur non connecté ou identifiant manquant');
      return;
    }

    this.bilanService.getBilanByUserId(this.user.id).subscribe({
      next: (data) => {
        this.bilan = data;
        console.log('Bilan récupéré :', this.bilan);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du bilan', err);
      }
    });
  }

  getVentes(): void {
    if (!this.user || !this.user.id) {
      console.error('Utilisateur non connecté ou identifiant manquant');
      return;
    }

    this.venteService.getVentesByUserId(this.user.id).subscribe({
      next: (data) => {
        this.ventes = data;
        console.log('Ventes récupérées :', this.ventes);
        this.getBilan();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des ventes', err);
      }
    });
  }

  ngOnInit() {
    console.log("EmployeComponent chargé !");
    this.loadUser();
    if (this.user) {
      this.getVentes();
      this.getBilan();
    }

    // Récupère l'ID de l'utilisateur connecté, par exemple via un service d'authentification
    const userId = this.user?.id;

    // Initialisation dynamique du formulaire
    let group: any = {};

    this.fields.forEach(field => {
      // Ajoute le champ au groupe avec l'ID utilisateur si nécessaire
      group[field.model] = field.validators ? [null, field.validators] : [null];
    });

    // Initialiser le formulaire
    this.salesForm = this.fb.group(group);

    // Définir la valeur de userId
    if (userId) {
      this.salesForm.patchValue({ userId: userId });
    }

    this.salesForm.get('venteTotal')?.valueChanges.subscribe(venteTotal => {
      const montantAssurance = this.salesForm.get('montantAssurance')?.value || 0;
      this.salesForm.patchValue({
        totalSansAssurance: venteTotal - montantAssurance
      }, { emitEvent: false });
    });
    
    this.salesForm.get('montantAssurance')?.valueChanges.subscribe(montantAssurance => {
      const venteTotal = this.salesForm.get('venteTotal')?.value || 0;
      this.salesForm.patchValue({
        totalSansAssurance: venteTotal - montantAssurance
      }, { emitEvent: false });
    });
    
  }

  handleSubmit() {
    if (this.salesForm.invalid) return;

    this.ventes.push(this.salesForm.value);
    this.salesForm.reset();
  }

  loadUser() {
    const storedUser = localStorage.getItem('user');
    const objectifStored = localStorage.getItem('user_objectif');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        this.objectif = JSON.parse(objectifStored!);
      } catch (error) {
        console.error('Erreur de parsing du token', error);
        this.user = null;
      }
    }
  }

  handleLogout() {
    localStorage.clear();
    this.user = null;
    this.router.navigate(['/login']);
  }

  formatPercentage(value: number | undefined): number {
    return value ? Math.floor(value * 100) : 0; // Multiplie par 100 et arrondi à l'entier inférieur
  }

  getMontantSansAssurance(){
    
  }
  
}
