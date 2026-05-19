import { inject, Injectable, signal } from "@angular/core";
import { SupabaseService } from "./supabase";
import { User } from "../models/user.model";
import { AuthError } from "@supabase/supabase-js";
import { UserMetadata } from "../models/usermetadata.model";

@Injectable ({providedIn: 'root'})
export class UserService {
    private supabase = inject(SupabaseService);
    errorMessage = '';

    user = signal<User | null>(null);
    loading  = signal(false);
    error = signal<AuthError | null>(null);

    async createUserDatabase(email: string, name: string, birthdate: string, password: string) {

        this.loading.set(true);
        const { data, error } = await this.supabase.getClient().auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    birthdate: birthdate,
                    }
                }
        });

        if (error) {
            console.error('No se pudo crear el usuario');
        }
        else {
            const metadata = data.user?.user_metadata as UserMetadata;
            const finalUser: User = {
                id: data.user?.id,
                email: data.user?.email,
                name: metadata.name,
                birthdate: metadata.birthdate
            }
            this.user.set(finalUser);
        }
    }

    
}