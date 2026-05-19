import { inject, Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environments } from "../../environments/environments";


@Injectable({providedIn: 'root'})
export class SupabaseService {
    private client: SupabaseClient;

    constructor() {
        const supabaseURL = environments.supabaseURL;
        const supabaseKey = environments.supabaseKey;
        this.client = createClient(supabaseURL, supabaseKey, {
            auth: {
                persistSession: false
            }
        })
    }

    getClient() {
        return this.client;
    }

    getUser() {
        return this.client.auth.getUser()
    }
}