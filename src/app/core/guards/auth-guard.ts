import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const credentials = sessionStorage.getItem('auth_credentials');
  
  if (!credentials) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};
