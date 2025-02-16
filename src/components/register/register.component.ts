import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthControllerService } from '../../back';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  readonly authService= inject(AuthControllerService)
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['EMPLOYE'], // Rôle fixé automatiquement
      agenceId: ['1', Validators.required] // Ajout de l'agence
    });
  }
  

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Formulaire soumis', this.registerForm.value);
     this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        console.log('Inscription réussie');
        this.router.navigate(['/login']); // Redirection après inscription
      },
      error: (err) => {
        this.errorMessage = err.error || 'Une erreur est survenue';
      }
    });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
