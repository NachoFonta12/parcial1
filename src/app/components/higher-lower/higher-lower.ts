import { Component, inject, OnDestroy, signal } from '@angular/core';
import { DeckService } from '../../services/deck';
import { UserService } from '../../services/user';

@Component({
    selector: 'app-higher-lower',
    imports: [],
    templateUrl: './higher-lower.html',
    styleUrl: './higher-lower.css',
})

export class HigherLower implements OnDestroy {
    deckService = inject(DeckService);
    deck = this.deckService.deck;

    currentCard = this.deckService.currentCard;
    nextCard = this.deckService.nextCard;
    backCard = "https://raw.githubusercontent.com/mcmd/playingcards.io-spanish.playing.cards/refs/heads/master/img/reverso.png";
    playing = this.deckService.playing;
    discardedCards = this.deckService.discardedCards;
    gameState = this.deckService.gameState;
    user = inject(UserService).getUser();
    score = this.deckService.score;
    leaderboard = this.deckService.leaderboard;

    startGame() {
        this.deckService.startGame();

        console.log(this.user()?.name);
    }

    ngOnDestroy() {
        // Limpiamos todo el estado para la próxima vez que entre
        this.deckService.restartGame(); 
        
        // Opcional: También puedes vaciar el leaderboard para que 
        // no quede el de la partida anterior
        this.leaderboard.set([]);
    }
}
