import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'environments/environment';
import { tap } from 'rxjs/operators';

export interface CartItem {
    productId: number;
    quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiURL;
  private cartItems = new BehaviorSubject<CartItem[]>([]); 

  cartItems$: Observable<CartItem[]> = this.cartItems.asObservable();
  cartTotalQuantity$: Observable<number> = this.cartItems$.pipe(
        map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  constructor() {
    if (localStorage.getItem('token')) {
        this.loadCart();
    }
  }
  
  loadCart() {
    this.http.get<CartItem[]>(`${this.API_URL}/cart`).subscribe({
        next: (items) => this.cartItems.next(items),
        error: (err) => {
            // En cas de 401 (token expiré), vider l'état local du panier
            if (err.status === 401) {
                this.cartItems.next([]);
            }
            console.error("Erreur de chargement du panier", err);
        }
    });
  }

  addToCart(productId: number, quantity: number): Observable<CartItem[]> {
    const itemToAdd: CartItem = { productId, quantity };
    
    return this.http.post<CartItem[]>(`${this.API_URL}/cart`, itemToAdd).pipe(
        tap(updatedCart => this.cartItems.next(updatedCart))
    );
  }

  removeFromCart(productId: number, quantity?: number): Observable<CartItem[]> {
        let url = `${this.API_URL}/cart/${productId}`;
        if (quantity) {
            // Utiliser un paramètre de requête pour réduire la quantité
            url += `?quantity=${quantity}`;
        }
        
        // Utiliser http.delete pour supprimer (ou réduire) et mettre à jour l'état local
        return this.http.delete<CartItem[]>(url).pipe(
            tap(updatedCart => this.cartItems.next(updatedCart))
        );
    }

    clearCart(): void {
        this.cartItems.next([]);
    }
}