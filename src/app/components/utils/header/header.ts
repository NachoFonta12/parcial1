import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
    private auth = inject(AuthService);
    userLogged = this.auth.isAuthenticated;

    logOut() {
      console.log('Cerrar sesion');
      this.auth.logout();
    }

    
}
