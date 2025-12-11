// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <h2>Créer un compte</h2>
      <form (ngSubmit)="onRegister()" #registerForm="ngForm">
        
        <div class="form-group">
          <label>Nom d'utilisateur *</label>
          <input type="text" [(ngModel)]="user.username" name="username" required>
        </div>

        <div class="form-group">
          <label>Prénom *</label>
          <input type="text" [(ngModel)]="user.firstname" name="firstname" required>
        </div>

        <div class="form-group">
          <label>Email *</label>
          <input type="email" [(ngModel)]="user.email" name="email" required email>
        </div>

        <div class="form-group">
          <label>Mot de passe *</label>
          <input type="password" [(ngModel)]="user.password" name="password" required minlength="6">
        </div>

        <button type="submit" [disabled]="registerForm.invalid">S'inscrire</button>
        
        <p class="mt-2">
          Déjà un compte ? <a routerLink="/login">Se connecter</a>
        </p>
        
        <p *ngIf="error" class="error">{{ error }}</p>
      </form>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    button { width: 100%; padding: 0.8rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    .error { color: red; margin-top: 1rem; }
    .mt-2 { margin-top: 1rem; text-align: center; }
  `]
})
export class RegisterComponent {
  user = {
    username: '',
    firstname: '',
    email: '',
    password: ''
  };
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: () => {
        // Redirection vers le login après succès
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = "Erreur lors de l'inscription. L'email est peut-être déjà utilisé.";
        console.error(err);
      }
    });
  }
}