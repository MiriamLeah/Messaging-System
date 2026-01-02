import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  

  private apiUrl = `${environment.apiBaseUrl}/auth`; 
  

  private tokenKey = 'auth_token';



  login(userId: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { userId }).pipe(
     
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

 
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  // logout() {
  //   localStorage.removeItem(this.tokenKey);
  // }
}