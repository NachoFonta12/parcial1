import { Injectable, WritableSignal, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student.model'; 

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    private http: HttpClient = inject(HttpClient);
    private apiURL: string = 'https://api.github.com/users/NachoFonta12';

    //private user: WritableSignal<User | null> = signal<User | null>(null);
    private user = signal<Student | null>(null);

    private loading: WritableSignal<boolean> = signal<boolean>(false);
    private error: WritableSignal<string | null> = signal<string | null>(null);
    
    private fecha = '';

    loadUser(): void {
        this.loading.set(true);
        this.error.set(null);

        this.http.get<any>(this.apiURL).subscribe({
            next: (data) => {
                const finalUser: Student = {
                        id: data.id,
                        name: data.name,
                        userName: data.login,
                        avatarURL: data.avatar_url,
                        createdAt: data.created_at,
                        repositories: data.public_repos,
                        location: data.location,
                        followers: data.followers
                    }
                this.user.set(finalUser);
                this.loading.set(false);
            },

            error: (error) => {
                this.error.set("Error loading user" + error.message());
                this.loading.set(false);
            }
        })
    }

    getUser(): Signal<Student | null> {

        return this.user.asReadonly();
    }
}
