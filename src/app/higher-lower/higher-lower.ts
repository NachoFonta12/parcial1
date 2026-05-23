import { Component, inject, signal } from '@angular/core';
import { Card } from '../models/card.model';
import { DeckService } from '../services/deck';
@Component({
    selector: 'app-higher-lower',
    imports: [],
    templateUrl: './higher-lower.html',
    styleUrl: './higher-lower.css',
})

export class HigherLower {
    deckService = inject(DeckService);
    deck = this.deckService.deck;


    loadDeck = this.deckService.loadDeck();
    firstCard = signal<Card|undefined>(this.deckService.showFirstCard());
}
