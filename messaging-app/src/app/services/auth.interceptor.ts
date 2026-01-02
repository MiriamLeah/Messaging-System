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
console.log('Sending token:', token);
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
        alert('נשלחו יותר מדי בקשות. המערכת עמוסה, נא להמתין מספר שניות ולנסות שוב.');
        console.warn('Rate limit exceeded');
      }
     
      return throwError(() => err);
    })
  );
};