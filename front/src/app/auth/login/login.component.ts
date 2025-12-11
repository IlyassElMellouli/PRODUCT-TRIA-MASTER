import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Connexion</h2>
      <form (ngSubmit)="onLogin()">
        <div>
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required>
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit">Se connecter</button>
        <p *ngIf="error" class="error">{{ error }}</p>
      </form>
    </div>
  `,
  styles: [`
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    button { width: 100%; padding: 0.8rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    .login-container { max-width: 400px; margin: 2rem auto; padding: 1rem; border: 1px solid #ccc; }
    .error { color: red; }
    div { margin-bottom: 1rem; }
    input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => this.error = 'Identifiants invalides'
    });
  }
}