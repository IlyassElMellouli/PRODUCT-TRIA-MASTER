import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from 'app/cart/data-access/cart.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  template: `
    <p-dialog header="Votre Panier" 
              [modal]="true" 
              [visible]="isVisible()" 
              (onHide)="close.emit()" 
              [style]="{ width: '400px' }">

      @if ((items$ | async); as items) {
          @if (items.length > 0) {
              <div class="cart-list">
                  @for (item of items; track item.productId) {
                      <div class="cart-item">
                          <div class="item-details">
                              Produit ID: {{ item.productId }} - Quantity : {{ item.quantity }}
                          </div>
                          <p-button 
                              icon="pi pi-trash" 
                              severity="danger" 
                              [rounded]="true" 
                              [outlined]="true"
                              (onClick)="removeItem(item.productId)" 
                              [style]="{ width: '30px', height: '30px' }"
                          />
                      </div>
                  }
              </div>
          } @else {
              <p class="text-center">Votre panier est vide.</p>
          }
      }
      
      <div class="mt-4 text-right">
        <p-button label="Fermer" (onClick)="close.emit()" />
      </div>

    </p-dialog>
  `,
  styles: [`
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }
    .item-details {
        font-weight: 500;
    }
  `]
})
export class CartDialogComponent {
  // Input pour contrôler l'affichage du dialog
  isVisible = input.required<boolean>();
  // Output pour notifier le composant parent quand il faut fermer
  close = output<void>();

  private cartService = inject(CartService);
  
  // Le contenu du panier est récupéré directement de l'observable du service
  items$: Observable<CartItem[]> = this.cartService.cartItems$;

  removeItem(productId: number): void {
    // Supprimer l'item complètement
    this.cartService.removeFromCart(productId).subscribe({
        next: () => { console.log(`Produit ${productId} retiré`); },
        error: (err) => console.error("Erreur de suppression:", err)
    });
  }
}