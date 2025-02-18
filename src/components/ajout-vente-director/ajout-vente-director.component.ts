import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BilanControllerService, VenteControllerService } from '../../back';

@Component({
  selector: 'app-ajout-vente-director',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ajout-vente-director.component.html',
  styleUrl: './ajout-vente-director.component.scss'
})
export class AjoutVenteDirectorComponent {
    readonly venteService = inject(VenteControllerService);
    readonly router = inject(Router);
    userIdParam!: number;
  
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
      { id: 'transactionDate', label: 'Mois de la transaction', type: 'month', model: 'transactionDate', validators: [Validators.required] },
      { id: 'userId', type: 'number', model: 'userId' }
    ];

    constructor(private fb: FormBuilder, private route: ActivatedRoute) {
        this.salesForm = this.fb.group({});
      }

      ngOnInit() {
        console.log("EmployeComponent chargé !");
        const userIdParam = this.route.snapshot.paramMap.get('id');
        console.log(userIdParam)
        
    
        // Récupère l'ID de l'utilisateur connecté, par exemple via un service d'authentification
        
    
        // Initialisation dynamique du formulaire
        let group: any = {};
    
        this.fields.forEach(field => {
          // Ajoute le champ au groupe avec l'ID utilisateur si nécessaire
          group[field.model] = field.validators ? [null, field.validators] : [null];
        });
    
        // Initialiser le formulaire
        this.salesForm = this.fb.group(group);
    
        // Définir la valeur de userId
        if (userIdParam) {
          this.salesForm.patchValue({ userId: userIdParam });
        }
        this.salesForm.patchValue({ transactionDate: new Date().toISOString().slice(0, 7) });
    
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
            this.router.navigate(['/directeur'])
          },
          error: (err) => {
            console.error('Erreur lors de l’ajout de la vente', err);
          }
        });
      }

      retour(){
        this.router.navigate(['/directeur'])
      }

}
