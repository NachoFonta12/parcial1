import { Component, inject, signal } from '@angular/core';
import { DeckService } from '../../services/deck';
@Component({
    selector: 'app-higher-lower',
    imports: [],
    templateUrl: './higher-lower.html',
    styleUrl: './higher-lower.css',
})

export class HigherLower {
    deckService = inject(DeckService);
    deck = this.deckService.deck;

    currentCard = this.deckService.currentCard;
    nextCard = this.deckService.nextCard;
    backCard = "https://raw.githubusercontent.com/mcmd/playingcards.io-spanish.playing.cards/refs/heads/master/img/reverso.png";
    playing = this.deckService.playing;
    discardedCards = this.deckService.discardedCards;

    startGame() {
        this.deckService.startGame();
    }
}
