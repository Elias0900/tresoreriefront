import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('user_token'); // Récupérer le token sous forme de chaîne de caractères

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Ajout du token dans l'en-tête Authorization
      }
    });
  }

  return next(req); // Continuer avec la requête modifiée
};
