import { Component, inject } from '@angular/core';
import { farkleService } from '../../services/farkle';

@Component({
    selector: 'app-farkle',
    imports: [],
    templateUrl: './farkle.html',
    styleUrl: './farkle.css',
})
export class Farkle {
    farkleService = inject(farkleService);
    gameState = this.farkleService.gameState;
    roundScore = this.farkleService.roundScore;
    dices = this.farkleService.dices;
    usedDices = this.farkleService.usedDices;
    lost = this.farkleService.lost;
    keepPlaying = this.farkleService.keepPlaying;
    totalScore = this.farkleService.totalScore;
    minScore = this.farkleService.minScore;
    maxScore = this.farkleService.maxScore;
    rounds = this.farkleService.rounds;
    leaderboard = this.farkleService.leaderboard;
}
