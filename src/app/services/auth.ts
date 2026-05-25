import { Injectable, inject, signal, computed, effect } from "@angular/core";
import { Router } from "@angular/router";
import { SupabaseService } from "./supabase";
import {UserSession} from "../models/usersession.model";
import { User } from "../models/user.model";
import { UserMetadata } from "../models/usermetadata.model";
import { ChatUiService } from "./chat-ui";

@Injectable({providedIn: 'root'})
export class AuthService {
    private router = inject(Router);
    private supabase = inject(SupabaseService);


    user = signal<User | null>(null);
    userSession = signal<UserSession | null>(null);
    isAuthenticated = computed(() => this.userSession() !== null);
    private chatUi = inject(ChatUiService);

    userEmail = computed(() => this.userSession()?.email ?? 'Invitado');

    constructor() {
        this.checkSession();
    }

    async checkSession() {
        const {data: {session}} = await this.supabase.getClient().auth.getSession();
        if (session?.user) {
            this.userSession.set({
                id: session.user.id,
                email: session.user.email?? ''
            })
        }
        else {
            this.userSession.set(null);
        }
    }

    async login(email: string, password: string): Promise<boolean> {
        const {data, error} = await this.supabase.getClient().auth.signInWithPassword({email, password});
        let success: boolean;

        if (error) {
            success = false; 
            console.log(error);
        } 

        if (data.user) {
            this.userSession.set({id: data.user.id, email: data.user.email ?? ''});
            this.router.navigate(['/home']);
            success = true;
        }
        else {
            success = false
        }

        return success;

    }

    async logout() {
        this.supabase.getClient().auth.signOut();
        this.user.set(null);
        this.userSession.set(null);
        this.chatUi.isChatHidden.set(true);
        this.router.navigate(['/login']);
    }

    async createUserDatabase(email: string, name: string, birthdate: string, password: string, sex: string): Promise<{success: boolean, errorMessage: string | null}> {
        const { data, error } = await this.supabase.getClient().auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    birthdate: birthdate,
                    sex: sex
                }
            }
        });
        
        let success: boolean;
        if (error) {
            return {success: false, errorMessage: error.message};
        }
        else {
            const metadata = data.user?.user_metadata as UserMetadata;
            const finalUser: User = {
                id: data.user?.id,
                email: data.user?.email,
                name: metadata.name,
                birthdate: metadata.birthdate,
                sex: metadata.sex
            }
            this.user.set(finalUser);
            await this.logout();
            return {success: true, errorMessage: null}
        }
    }

    async getActiveSession() {
        const {data, error} = await this.supabase.getClient().auth.getSession();

        return data.session;
    }
}
