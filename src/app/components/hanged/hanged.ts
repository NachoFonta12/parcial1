import { Component, inject, signal } from '@angular/core';
import { HangedService } from '../../services/hanged';

@Component({
    selector: 'app-hanged',
    imports: [],
    templateUrl: './hanged.html',
    styleUrl: './hanged.css',
})
export class Hanged {
    hangedService = inject(HangedService);

    hiddenSecretWord = this.hangedService.hiddenSecretWord;
    alphabet = this.hangedService.alphabet;
    gameState = this.hangedService.gameState;
    time = this.hangedService.time;
    chosenWord = this.hangedService.chosenWord;
    mistakes = this.hangedService.mistakes;
    victory = this.hangedService.victory;
    guessedLetters = this.hangedService.guessedLetters;
    leaderboard = this.hangedService.leaderboard;

    print(printed: any) {
        console.log(printed);
    }

    tryLetter(letter: string) {
        console.log(letter);
        this.hangedService.tryLetter(letter);
    }

    formatTime(time: number): string {
        return this.hangedService.formatTime(time);
    }

    ngOnDestroy() {
        this.hangedService.restartGame(); 
    }
}
