import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
    private auth = inject(AuthService);
    private router = inject(Router);

    loading = signal<boolean>(false);
    email = '';
    name = '';
    birthdate = '';
    password = '';
    errorMessage = signal('');

    async onSubmit() {
        this.loading.set(true);
        const result = await this.auth.createUserDatabase(this.email, this.name, this.birthdate, this.password);
        if(!result.succes) {
            this.errorMessage.set(result.errorMessage || 'No se pudo crear la cuenta. Verifica tus datos o intenta con otro correo.');
        }
        else {
            this.router.navigate(['/home']);
        }
        this.loading.set(false);

    }

}
