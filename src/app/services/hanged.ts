import { inject, Injectable, signal } from "@angular/core";
import { GameService } from "./game";

@Injectable({
    providedIn: 'root',
})
export class HangedService {
    alphabet = signal<string[]>([ 'A', 'B', 'C', 'D', 'E', 'F', 'G',
        'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z'
    ]);

    private gameService = inject(GameService);
    private wordList = ['CANGURO','LINCE', 'MONARQUIA', 'OLA', 'VIRREINATO'];
    private startTime = 0;
    private endTime = 0;
    
    guessedLetters = signal<string[]>([]);
    chosenWord = signal<string>('');
    secretWord = signal<string[]>([]);
    hiddenSecretWord = signal<string[]>([]);
    mistakes = signal<number>(0);
    gameState = signal<'start' | 'playing' | 'gameover'>('start');
    time = signal<string>('');
    victory = signal<boolean>(false);
    leaderboard = signal<{ username: string; score: number }[] | undefined>([])



    findConcurrences(letter: string): number[] {
        let concurrences: number[] = [];
        this.secretWord().forEach((secretLetter, index) => {
            if (secretLetter === letter) {
                concurrences.push(index);
            }
        });
        return concurrences;
    }

    hideSecretWord() {
        this.secretWord().forEach((letter) => {
            this.hiddenSecretWord().push('_');
        });
    }

    createSecretWord(word: string){
        this.secretWord.set([...word]);
    }

    revealWord(letter: string, indexes: number[]) {
        for (let i = 0; i < indexes.length; i++) {
                this.hiddenSecretWord()[indexes[i]] = letter;

        }
    }

    tryLetter(letter: string) {
        let concurrences = this.findConcurrences(letter);
        console.log(concurrences);
        if (concurrences.length === 0) {
            this.mistakes.update(live => live + 1);
        }
        else {
            this.revealWord(letter, concurrences);
        }
        this.guessedLetters.update(prev => [...prev, letter]);

        if (this.checkEnd()) {
            this.endGame();
        }
    }

    checkEnd(): boolean {
        console.log(this.mistakes());
        if (this.mistakes() === 6) {
            this.victory.set(false);
            return true;
        }
        for (let i = 0; i < this.secretWord().length; i++) {
            if (this.secretWord()[i] !== this.hiddenSecretWord()[i]) {
                return false;
            } 
        }
        this.victory.set(true);
        return true;
    }

    startGame() {
        this.gameState.set('playing');
        console.log(this.gameState());
        this.startTime = Date.now();
        this.chooseRandomWord();
        this.createSecretWord(this.chosenWord());
        this.hideSecretWord();
    }

    chooseRandomWord() {
        let maxValue = this.wordList.length - 1;
        let randomNumber = Math.floor(Math.random() * (maxValue + 1));
        console.log(this.wordList[randomNumber]);
        this.chosenWord.set(this.wordList[randomNumber]);;
    }

    async endGame() {
        this.gameState.set('gameover');
        this.endTime= Date.now() - this.startTime;
        this.time.set(this.formatTime(this.endTime));
        console.log(this.time());
        console.log(this.chosenWord());
        await this.gameService.insertResult(3, this.endTime);
        this.leaderboard.set(await this.gameService.getHighScores(3, 3, true));


    }

    formatTime(time: number){
        let timeFormatted = '';
        let milliseconds = Math.floor((time % 1000) / 10);
        let seconds = Math.floor((time / 1000) % 60);
        let minutes = Math.floor((time / (1000 * 60)) % 60);

        if (seconds > 9){
            timeFormatted = `${minutes}:${seconds}:${milliseconds}`;
        }
        else {
            timeFormatted = `${minutes}:0${seconds}:${milliseconds}`;
        }
        return timeFormatted;
    }

    restartGame() {
        this.gameState.set('start');

        this.mistakes.set(0);
        this.secretWord.set([]);
        this.hiddenSecretWord.set([]);
        this.chosenWord.set("");
        this.guessedLetters.set([]);

        this.startTime = 0;
        this.endTime = 0;
        this.time.set('');
    }
}