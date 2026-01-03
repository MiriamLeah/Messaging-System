import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'; 
import { inject } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs'; 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  const token = authService.getToken();
    const router = inject(Router); 


  let requestToHandle = req;

  if (token) {  
    requestToHandle = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
        
      }
    });   
  }
  

  return next(requestToHandle).pipe(
    catchError((err: HttpErrorResponse) => {
      
      
      if (err.status === 401) {
        console.log('Token expired! Redirecting to login...');        
        localStorage.removeItem('auth_token');        
        router.navigate(['/login']);
      }

      if (err.status === 429) {        
        alert('To many request were sent , please wait a fiew minutes');
        console.warn('Rate limit exceeded');
      }
     
      return throwError(() => err);
    })
  );
};