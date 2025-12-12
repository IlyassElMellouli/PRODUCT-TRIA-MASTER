import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from './shared/ui/panel-menu/panel-menu.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { CartService } from './cart/data-access/cart.service';
import { AsyncPipe } from '@angular/common';
import { CartDialogComponent } from './shared/ui/panel-menu/cart-dialog/cart-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, CommonModule, CartDialogComponent],
})
export class AppComponent {
  title = 'ALTEN SHOP';
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);

    cartTotalQuantity$ = this.cartService.cartTotalQuantity$;
    isCartDialogOpen = false;

  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  //email$: Observable<string | null> = this.authService.email$;
  email$ = this.authService.email$;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  openCartDialog() {
        this.isCartDialogOpen = true;
    }
    
    closeCartDialog() {
        this.isCartDialogOpen = false;
    }

    ngOnInit(): void {
        this.cartService.loadCart(); 
    }
}