import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  AuthControllerService, UserLoginResponseDTO } from '../../back';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  readonly router = inject(Router);

  constructor(private fb: FormBuilder, private authService: AuthControllerService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
  
    const request = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
  
    this.authService.login(request).pipe().subscribe({
      next: (response: UserLoginResponseDTO) => {
        console.log('Connexion réussie', response);
  
        // Assurer que la réponse est au format JSON
        if (response) {
          // Stocker chaque propriété de l'objet utilisateur dans localStorage
          const user = {
            id: response.id,
            role: response.role,
            nom: response.nom,
            prenom: response.prenom,
            email: response.email,
            token: response.token,
            objectif: response.objectif,
            agenceId: response.agenceId
   
          };
          
          // Stocker l'objet utilisateur dans localStorage
          localStorage.setItem('user', JSON.stringify(user));
        
          localStorage.setItem('user_id', response.id!.toString());
          localStorage.setItem('user_role', response.role!);
          localStorage.setItem('user_token', response.token!);
          localStorage.setItem('user_objectif', response.objectif!.toString());
          localStorage.setItem('user_agenceId', response.agenceId!.toString());
        

       // Rediriger vers la page correspondante en fonction du rôle de l'utilisateur
       const role = response.role;

       if (role === 'EMPLOYE') {
         this.router.navigate(['/employe']);
       } else if (role === 'DIRECTEUR') {
         this.router.navigate(['/directeur']);
       } else {
         // Optionnel : rediriger vers une page d'erreur si le rôle est incorrect
         console.error('Rôle inconnu');
         this.router.navigate(['/login']);
       }
     } else {
       console.error('Réponse invalide ou token manquant');
     }
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        this.errorMessage = 'Identifiants incorrects ou problème serveur';
      },
    });
  }
  
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
