import { Component, inject, NgZone, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
    private auth = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private ngZone = inject(NgZone);

    today = new Date().toISOString().split('T')[0];
    loading = signal<boolean>(false);
    email = '';
    name = '';
    birthdate = '';
    password = '';
    sex = '';
    errorMessage = signal('');

    registerForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        birthdate: ['', [Validators.required]],
        sex: ['', [Validators.required]]
    });

    async onSubmit() {
        this.loading.set(true);

        const {username, email, password, birthdate, sex} = this.registerForm.value;

        const result = await this.auth.createUserDatabase(email ?? '', username ?? '', birthdate ?? '', password ?? '', sex ?? 'O');
        if(!result.success) {
            this.errorMessage.set(result.errorMessage || 'No se pudo crear la cuenta. Verifica tus datos o intenta con otro correo.');
            console.log('Hubo un error');
            console.log(this.errorMessage());
        }
        else {
            console.log('Nos vamos a casita :V')
            this.ngZone.run(() => {
                this.router.navigate(['/login']);
            });
        }
        this.loading.set(false);

    }

}
