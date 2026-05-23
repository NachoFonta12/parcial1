import { Injectable, signal } from "@angular/core";
import { Card } from "../models/card.model";

@Injectable({
    providedIn: 'root',
})
export class DeckService {
    private imageURL = 'https://raw.githubusercontent.com/mcmd/playingcards.io-spanish.playing.cards/refs/heads/master/img/';
    private palos = ['espadas', 'bastos', 'copas', 'oros'];
    private values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    playing = signal<boolean>(false);
    deck = signal<Card[]>([]);
    discardedCards = signal<Card[]>([]);
    currentCard = signal<Card|undefined>(undefined);
    nextCard = signal<Card|undefined>(undefined);
    score = signal<number>(0);

    constructor() {
        console.log(this.deck());
    }

    addCard(deck: Card[], card: Card) {
        deck.push(card);
    }

    loadDeck() {
        let stringBuilder: string;
        let card: Card;
        this.palos.forEach( palo => {
            this.values.forEach( value => {
                if (value <= 9) {
                    stringBuilder = this.imageURL + '0' + value + '-' + palo + '.png';
                }
                else {
                    stringBuilder = this.imageURL + value + '-' + palo + '.png';
                }
                let card = {value: value, palo: palo, url: stringBuilder}
                this.addCard(this.deck(), card);
            })
        })
    }

    showDeck() {
        this.deck().forEach(card => {
            console.log(card);  
        });
    }

    drawOneCard() {
        return this.deck().pop();
    }

    discardCard(card: Card) {
        console.log(card.value, 'de', card.palo);
        this.discardedCards().push(card);
        this.discardedCards().forEach(card => {
            console.log(card.value, 'de', card.palo);
        })
    }

    shuffleDeck() {
        for (let i = this.deck().length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            console.log('Antes de mezclar', this.deck()[i], this.deck()[j]);
            [this.deck()[i], this.deck()[j]] = [this.deck()[j], this.deck()[i]];
            console.log('Despues de mezclar', this.deck()[i], this.deck()[j]);
        }
    }

    playRound(guess: number) {
        let keepPlaying = this.checkEnd();

        if (keepPlaying) {
            this.endGame();
        }

        else {
            this.nextCard.set(this.drawOneCard());
    
            const currentCard = this.currentCard();
            const nextCard = this.nextCard();
    
            if (!currentCard || !nextCard) {
                console.error("Faltan cartas para poder jugar");
                return; 
            }
    
            const result = this.validateGuess(guess);
    
            if (result) {
                this.addPoint();
                console.log("Correcto");
            }
            else {
                console.log('Te has equivocado');
            }
    
            this.discardCard(currentCard);
            this.currentCard.set(nextCard);
            this.nextCard.set(undefined);
        }
    }

    validateGuess(guess: number): boolean {
        const currentCard = this.currentCard();
        const nextCard = this.nextCard()

        let result = false;
        if (!currentCard || !nextCard) {
            console.error("Faltan cartas para poder jugar");
            return result; 
        }

        switch (guess) {
            case 0:   
            if (nextCard.value < currentCard.value) {
                result = true;
            }
            else {
                result = false;
            }
            break;
            case 1:
                if (nextCard.value === currentCard.value ) {
                    result = true;
                }
                else {
                    result = false;
                }
                break;
            case 2:
                if (nextCard.value > currentCard.value) {
                    result = true;
                }
                else {
                    result = false;
                }
        }
        
        return result;
    }

    startGame() {
        this.playing.set(true);
        this.loadDeck();
        this.shuffleDeck();
        this.currentCard.set(this.drawOneCard());
    }

    checkEnd(): boolean {
        if (this.deck().length === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    endGame() {
        this.playing.set(false);
    }

    restartGame() {
        this.score.set(0);
        this.startGame();
    }

    addPoint() {
        this.score.update(score => score += 1);
    }
}