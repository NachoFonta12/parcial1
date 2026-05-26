import { inject, Injectable, signal } from "@angular/core";
import { Dice } from "../models/dice.model";
import { GameService } from "./game";

@Injectable({
    providedIn: 'root',
})
export class farkleService {
    private gameService = inject(GameService);

    rounds = signal<number>(0);
    dices = signal<Dice[]>([]);
    totalScore = signal<number>(0);
    roundScore = signal<number>(0);
    usedDices = signal<Dice[]>([]);
    gameState = signal<'start' | 'playing' | 'gameover'>('start');
    lost = signal<boolean>(false);
    keepPlaying = signal<boolean>(false);
    leaderboard = signal<{ username: string; score: number }[] | undefined>([])

    private throwResult: Record<number, number> = {};
    private singleScores: Record<number, number> = {1: 100, 5: 50};
    private playedDicesAmount: number = 0;
    minScore = 500;
    maxScore = 5000;

    startGame() {
        this.loadDices();
        this.gameState.set('playing');
    }

    loadDices() {

        this.dices.set([]);
        //Añadir cinco dados al array de dados.
        for (let i = 0; i < 5; i++) {
            //Crar dado desde 0..
            let dice: Dice = {values: [], chosenValue: 0};
            for (let j = 0; j < 6; j++) {
                //Ponerle las cinco caras.
                dice.values[j] = (j + 1);            }
            //Meterlo en el array de dados.
            this.dices().push(dice);
            console.log('Dado numero:', i, this.dices()[i]);
        }
        console.log('Dado completo:', this.dices());
    }

    chooseRandomNumber(dice: number) {
    let maxValue = this.dices()[dice].values.length;
    let randomNumber = Math.floor(Math.random() * (maxValue) + 1);
    this.dices()[dice].chosenValue = randomNumber;
    //console.log(`El dado ${dice + 1} saco: ${this.dices()[dice].chosenValue}`);
    }

    throwDices() {
        for (let i = 0; i < this.dices().length; i++) {
            this.chooseRandomNumber(i);
        }
        console.log('--------------------------------------');
    }
    
    getThrowResults() {
        this.dices().forEach(dice => {
            this.throwResult[dice.chosenValue] = (this.throwResult[dice.chosenValue] || 0) + 1; 
        })
    }

    playingRound() {
        let points = 0;
        let roundPoints = 0;
        let currentPlayedDices = 0;
        Object.entries(this.throwResult).forEach(([valueSTR, frequency]) => {

            const value = Number(valueSTR);
            console.log(`La cara ${value} salio ${frequency} veces.`);
            const result = this.evaluateDiceGroup(value, frequency);

            points += result.points;
            currentPlayedDices += result.usedDices;

            if (result.points > 0) {
                console.log(`Cara ${value} sumó ${result.points} puntos usando ${result.usedDices} dados.`);
            }
        });

        this.playedDicesAmount = currentPlayedDices;
        if (points !== 0) {
            this.roundScore.update(score => score + points);
            console.log(`Tirada valida. Puntaje de ronda: ${this.roundScore()}`);
            console.log(`Dados a descartar: ${this.playedDicesAmount}`);

        }
        else {
            if (this.roundScore() === 0) {
                console.log('PAPA!!!!');
                this.roundScore.set(-100);
            }
            else {
                console.log('Sin jugadas válidas. Puntaje de ronda perdido.');
                this.roundScore.set(0);
            }
            this.lost.set(true);
        }
    }

    evaluateDiceGroup(value: number, frequency: number): { points: number, usedDices: number } {
        let points = 0;
        let usedDices = 0;

        if (frequency >= 3) {
            points += (value === 1) ? 1000 : (value * 100);
            usedDices += 3;
            frequency -= 3; // Restamos 3 para ver si sobran dados para evaluar individualmente
        }

        // 2. Regla de los dados sueltos (Los que sobraron del trío, o si eran menos de 3)
        const singlePointValue = this.singleScores[value] || 0; 
        
        if (singlePointValue > 0 && frequency > 0) {
            points += singlePointValue * frequency;
            usedDices += frequency;
        }

        return {points: points, usedDices: usedDices};
    }

    setScore() {
        this.totalScore.update(score => score + this.roundScore());
    }

    clearThrowResults() {
        this.throwResult = {};
    }

    discardDice(amount: number) {
        if (!amount || amount <= 0) return;
        const currentDices = this.dices();
        const safeAmount = Math.min(amount, currentDices.length);
        const cutIndex = currentDices.length - safeAmount;
        const discarded = currentDices.slice(cutIndex);
        const remaining = currentDices.slice(0, cutIndex);
        console.log(remaining);

        this.usedDices.update(used => [...used, ...discarded]);
        this.dices.set(remaining);
    }

    playAllDicesAgain() {
        this.loadDices();
        this.usedDices.set([]);
    }

    playRound() {
        this.throwDices();
        this.getThrowResults();
        this.playingRound();
        this.clearThrowResults();
        console.log(`La cantidad de dados es: ${this.dices().length}`);
        console.log(`Esta ronda se jugaron ${this.playedDicesAmount} dados.`)
        this.keepPlaying.set(true);
    }

    playRoundAgain() {
        console.log(`Se van a desccartar ${this.playedDicesAmount} dados.`)
        this.discardDice(this.playedDicesAmount);
        console.log(`Se descartaron ${this.playedDicesAmount}, por lo que solo quedan ${this.dices().length} dados.`);
        if (this.dices().length === 0) {
            this.playAllDicesAgain();
        }
        this.playRound();
    }

    stopRound() {
        this.setScore();
        this.rounds.update(round => round + 1);
        console.log(`TIRADAS: ${this.rounds()}`);
        this.playAllDicesAgain();
        this.roundScore.set(0);
        console.log(`Los puntos totales son: ${this.totalScore}`);
        this.lost.set(false);
        this.keepPlaying.set(false);
        if (this.checkEnd()) {
            this.endGame();
        }
        
    }

    checkEnd(): boolean {
        if (this.totalScore() >= this.maxScore) {
            return true;
        }
        else {
            return false;
        }
    }

    async endGame() {
        this.gameState.set('gameover');
        await this.gameService.insertResult(4, this.rounds());
        this.leaderboard.set(await this.gameService.getHighScores(4, 3, true));
    }

    restartGame() {
        this.dices.set([]);
        this.usedDices.set([]);
        this.keepPlaying.set(false);
        this.rounds.set(0);
        this.totalScore.set(0);
        this.roundScore.set(0);
        this.lost.set(false);
        this.leaderboard.set([]);
        this.gameState.set('start');
    }
    
}