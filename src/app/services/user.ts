import { inject, Injectable, signal } from "@angular/core";
import { SupabaseService } from "./supabase";
import { User } from "../models/user.model";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { UserMetadata } from "../models/usermetadata.model";
import { AuthService } from "./auth";


@Injectable ({providedIn: 'root'})
export class UserService {
    private supabase = inject(SupabaseService);
    errorMessage = '';

    auth = inject(AuthService);
    user = signal<User | null>(null);
    loading  = signal(false);
    error = signal<AuthError | PostgrestError | null>(null);

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
                birthdate: metadata.birthdate,
                gender: metadata.gender
            }
            this.user.set(finalUser);
        }
    }

    getUser() {
        return this.user;
    }

    async loadUser() {
        const userId = (await this.supabase.getUser()).data.user?.id;

        if (!userId) {
            console.error("No hay usuario logueado para cargar los datos");
            return;
        }
        console.log(userId);

        const {data, error} = await this.supabase.getClient().from("users").select("*").eq("id", userId).maybeSingle();
        console.log(data);

        if (error) {
            this.error.set(error);
        }
        else {
            const finalUser: User = {
                id: data.id,
                name: data.name,
                email: data.email,
                birthdate: data.birthdate,
                gender: data.gender
            }
            this.user.set(finalUser);
        }
    }
    
}