import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from './shared/ui/panel-menu/panel-menu.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, CommonModule],
})
export class AppComponent {
  title = 'ALTEN SHOP';
  
  private authService = inject(AuthService);
  private router = inject(Router);

  // Observable pour savoir si on est connecté (pour le HTML)
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}