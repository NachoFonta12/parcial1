import { Component, inject } from '@angular/core';
import { QuizService } from '../../services/quiz';

@Component({
    selector: 'app-quiz',
    imports: [],
    templateUrl: './quiz.html',
    styleUrl: './quiz.css',
})
export class Quiz {
    quizService = inject(QuizService);
    questions = this.quizService.getQuestions();
    gameState = this.quizService.gameState;
    round = this.quizService.round;
    score = this.quizService.score;
    leaderboard = this.quizService.leaderboard;


    ngOnDestroy() {
        this.quizService.restartGame(); 
    }
}
