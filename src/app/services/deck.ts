import { Injectable, signal } from "@angular/core";
import { Card } from "../models/card.model";

@Injectable({
    providedIn: 'root',
})
export class DeckService {
    private imageURL = 'https://raw.githubusercontent.com/mcmd/playingcards.io-spanish.playing.cards/refs/heads/master/img/';
    private palos = ['espadas', 'bastos', 'copas', 'oros'];
    private values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    deck = signal<Card[]>([]);
    discardedCards = signal<Card[]>([]);

    constructor() {
        console.log(this.deck());
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
                this.deck().push(card);
            })
        })
        
/*         this.deck().forEach(card => {
            console.log(card);  
        }) */
    }

    showFirstCard() {
        return this.deck().pop();
    }

    discardCard(card: Card) {
        this.discardedCards().push(card);
    }

    shuffleDeck() {
        for (let i = this.deck().length - 1; 1 > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            console.log('Antes de mezclar', this.deck()[i], this.deck()[j]);
            [this.deck()[i], this.deck()[j]] = [this.deck()[j], this.deck()[i]];
            console.log('Antes de mezclar', this.deck()[i], this.deck()[j]);
        }
    }
}