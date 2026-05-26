import { inject, Injectable, signal } from "@angular/core";
import { GameService } from "./game";
import { GameProfileStats } from "../models/gameprofilestats.model";
import { UserService } from "./user";
import { SupabaseService } from "./supabase";

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private gameService = inject(GameService);
    private userService = inject(UserService);
    private supabaseService = inject(SupabaseService);


    leaderboards = signal<{game: number, gameName: string, leaderboard: { username: string; score: number }[]}[]>([]);
    profileStats = signal<GameProfileStats[]>([]);
    user = this.userService.getUser()
    client = this.supabaseService.getClient();


    async getScores(gameId: number, ascending: boolean = false) {
        const data = await this.gameService.getHighScores(gameId, 3, ascending);
        
        return data; 
    }


    async getScoresAllGames() {
        this.leaderboards.set([]);
        const gameNames: Record<number, string> = {
            1: 'Mayor o Menor',
            2: 'Preguntados',
            3: 'Ahorcado',
            4: 'Farkle'
        };

        for (let gameId = 1; gameId <= 4; gameId++) {
            const isAscending = (gameId === 3 || gameId === 4); 
            const gameLeaderboard = await this.getScores(gameId, isAscending);
            
            if (gameLeaderboard) {
                this.leaderboards.update(currentList => {
                    return [...currentList, { game: gameId, gameName: gameNames[gameId], leaderboard: gameLeaderboard }];
                });
            }
        }
        
        console.log("¡Todas las tablas cargadas!", this.leaderboards());
    }

    loadProfileStats() {
        this.profileStats.set([]);
    }


    getUserScores(game: number, ascending: boolean = false) {
        this.gameService.getHighScoreUser(this.user()?.id!, game, 3, ascending)
    }

    getUserScoresAllGames() {
        for (let i = 0; i < 4; i++) {
            if (i === 3 || i === 4) {
                this.gameService.getHighScoreUser(this.user()?.id!, i + 1, 3, true);
            }
            else {
                this.gameService.getHighScoreUser(this.user()?.id!, i + 1, 3, false);
            }
        }
    }

}