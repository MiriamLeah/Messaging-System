import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);


  userId: string = '';
  errorMessage: string = '';


  onLogin() {
    this.authService.login(this.userId).subscribe({
      next: () => {       
        this.router.navigate(['/chat']);
      },
      error: (err) => {        
        this.errorMessage = 'Error';
        console.error(err);
      }
    });
  }


  onlyNumbers(event: any) {
  const pattern = /[0-9]/;
  const inputChar = String.fromCharCode(event.charCode);
  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }
}
}



