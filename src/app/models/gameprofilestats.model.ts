export interface GameProfileStats {
    gameId: number;
    gameName: string;
    personalBest: string | number | null; 
    globalLeaderboard: { username: string, score: string | number }[];
}