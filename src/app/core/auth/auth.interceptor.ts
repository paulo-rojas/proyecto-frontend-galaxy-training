import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  if (req.url.includes('/api/gestion/')) {
    const credentials = sessionStorage.getItem('auth_credentials');
    
    if (credentials) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Basic ${credentials}`
        }
      });
      return next(authReq);
    }
  }
  
  return next(req);
};
