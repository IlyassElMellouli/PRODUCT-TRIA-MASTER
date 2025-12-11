import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from 'app/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from "app/cart/data-access/cart.service";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, CommonModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  public readonly authService = inject(AuthService);
  private cartService = inject(CartService);
  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  onAddToCart(product: Product) {
        this.cartService.addToCart(product.id, 1).subscribe({
            next: (updatedCart) => {
                console.log("Panier mis à jour. Nouveaux items:", updatedCart);
                alert(`${product.name} a été ajouté au panier !`);
            },
            error: (err) => {
                if (err.status === 401) {
                    alert("Vous devez vous connecter pour ajouter des produits au panier.");
                    // Redirection vers le login (ou laisser l'intercepteur le faire)
                } else {
                    console.error("Erreur lors de l'ajout au panier:", err);
                }
            }
        });
    }
}
