import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = environment.apiURL;
  
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token')); 
  private emailSubject = new BehaviorSubject<string | null>(null);
  email$ = this.emailSubject.asObservable();

  constructor(private http: HttpClient) {}

  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }
  setEmail(email: string) {
    this.emailSubject.next(email);
  }
  
  register(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/account`, user);
  }

  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API_URL}/token`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.loggedIn.next(true);
        this.setEmail(credentials.email)
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.emailSubject.next(null);
  }

  isAdmin(): boolean {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const decodedToken: any = jwtDecode(token);
            return decodedToken.email === 'admin@admin.com'; 
        } catch (error) {
            console.error("Erreur de décodage JWT", error);
            return false;
        }
    }
}