import { inject, Injectable, signal } from "@angular/core";
import { SupabaseService } from "./supabase";
import { UserService } from "./user";

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private client = inject(SupabaseService).getClient();
    private user = inject(UserService).getUser();
    leaderboard = signal<{ username: string; score: number }[]>([]);

    async insertResult(game: number, result: number) {
        const userId = this.user()?.id;
        const {data, error} = await this.client.from('results').insert({game_id: game, user_id: userId, score: result});
        if (error) {
            console.log(error);
        }
    }

    async getHighScores(game: number, amount: number = 3) {
        const {data, error} = ((await this.client.from('results').select('users(name), score').eq('game_id', game).order('score', {ascending: false}).limit(amount)));
        
        if (error) {
            console.error(error.message);
        }
        else {
            if (data) {
                const formattedLeaderboard = data.map((row: any) => ({
                    // Extraemos el nombre del objeto anidado 'users'
                    username: row.users?.name || 'Jugador Desconocido', 
                    score: row.score
                }));
                
                // 3. Actualizamos la Signal
                this.leaderboard.set(formattedLeaderboard);
            }
        }
    }
} 