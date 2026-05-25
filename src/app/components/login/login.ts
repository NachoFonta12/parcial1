import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private auth = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    email = '';
    password = '';
    loading = signal(false);
    errorMessage = signal('');

    async onSubmit() {
        this.loading.set(true);
        const {email, password} = this.loginForm.value;
        const success = await this.auth.login(email ?? '', password ?? '');

        if(success) {
            this.router.navigate(['/home']);
        }
        else {
            this.errorMessage.set('Credenciales inválidas');
        }
        this.loading.set(false);

    }

    async quickAccess(email: string, password: string) {

        this.loginForm.patchValue({
            email: email,
            password: password
        })
    }
    
}
