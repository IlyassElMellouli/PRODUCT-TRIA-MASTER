import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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

  constructor() {
    this.loadCart();
  }
  
  loadCart() {
    this.http.get<CartItem[]>(`${this.API_URL}/cart`).subscribe({
        next: (items) => this.cartItems.next(items),
        error: (err) => {
            console.error("Erreur de chargement du panier", err);
            this.cartItems.next([]);
        }
    });
  }

  addToCart(productId: number, quantity: number): Observable<CartItem[]> {
    const itemToAdd: CartItem = { productId, quantity };
    
    return this.http.post<CartItem[]>(`${this.API_URL}/cart`, itemToAdd).pipe(
        tap(updatedCart => this.cartItems.next(updatedCart))
    );
  }
}