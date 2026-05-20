import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private auth = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    loading = signal(false);
    errorMessage = signal('');

    async onSubmit() {
        this.loading.set(true);
        const success = await this.auth.login(this.email, this.password);
        if(!success) this.errorMessage.set('Credenciales incorrectas');
        else {
            this.router.navigate(['/home']);
        }
        this.loading.set(false);
    }

    async quickAccess(email: string, password: string) {
        this.email = email;
        this.password = password;

        this.onSubmit();

    }
    
}
