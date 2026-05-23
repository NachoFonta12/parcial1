import { inject, Injectable, signal } from "@angular/core";
import { Message } from "../models/message.model";
import { SupabaseService } from "./supabase";

@Injectable({
    providedIn: 'root',
})

export class ChatService {
    public messages = signal<Message[]>([]);
    private client = inject(SupabaseService).getClient();

    constructor() {
        this.loadMessages();
        this.listenMessages();
    }

    async loadMessages() {
        const {data} = await this.client
        .from('messages')
        .select('*, users(name)')
        .order('created_at', {ascending: true});
    
        if (data) {
            this.messages.set(data as Message[])
        }
    }

    listenMessages() {
        this.client.channel('Sala de chat').on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'messages'}, (payload) => {
            this.loadMessages();
        }).subscribe();
    }

    async sendMessage(name: string, text: string) {
        console.log('nombre en service', name);
        const {data : users} = await this.client.from('users').select('id').eq('name', name).single();
        let userId: string;
        console.log(users);
        if (users) {
            userId = users.id;

            const {data, error} = await this.client.from('messages').insert({content: text, user_id: userId});

            if (error) {
                console.log(error);
            }
        }
        else {
            console.error('No se puede guardar el mensaje');
        }
    }
}