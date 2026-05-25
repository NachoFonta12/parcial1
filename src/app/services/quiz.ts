import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Question } from "../models/question.model";
import { GameService } from "./game";

@Injectable({
    providedIn: 'root',
})
export class QuizService {
    private http: HttpClient = inject(HttpClient);
    private apiURL: string = 'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple';
    private gameService = inject(GameService);

    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    private questions = signal<Question[]>([]);
    gameState = signal<'start' | 'playing' | 'gameover'>('start');
    score = signal<number>(0);
    leaderboard = signal<{ username: string; score: number }[] | undefined>([])
    round = signal<number>(0);



    loadQuestions() {
        this.loading.set(true);
        this.error.set(null);


        this.http.get<any>(this.apiURL).subscribe({
            next: (data) => {
                
                const questionsAPI = data.results.map((apiQuestion: any) => {
                    const combinedAnswers = [...apiQuestion.incorrect_answers, apiQuestion.correct_answer];
                    console.log(combinedAnswers);
                    const shuffledAnswers = combinedAnswers.sort(() => Math.random() - 0.5);
                    console.log(shuffledAnswers);
                    return {
                        category: apiQuestion.category,
                        question: apiQuestion.question,
                        correctAnswer: apiQuestion.correct_answer,
                        incorrectAnswers: apiQuestion.incorrect_answers,
                        allAnswers: shuffledAnswers
                    }
                });
                
                console.log('PREGUNTAS:', questionsAPI);
                this.questions.set(questionsAPI);
                this.loading.set(false);
                console.log('PREGUNTAS.......', this.questions()[0].allAnswers);
            },
            error: (err) => {
                this.error.set('Error al cargar preguntas');
                this.loading.set(false);
            }
        });
    }

    getQuestions() {
        return this.questions.asReadonly();
    }

    checkAnswer(question: Question, answer: string): boolean {
        if (answer === question.correctAnswer) {
            return true;
        }
        else {
            return false;
        }
    }

    addPoint() {
        this.score.update(point => point += 1);
    }

    startGame() {
        this.loadQuestions();
        this.gameState.set('playing');
        this.round.set(1);
        console.log(this.questions()[this.round()]);
    }

    playRound(answer: string) {
        let isCorrect = this.checkAnswer(this.questions()[this.round()-1], answer);
        
        if (isCorrect) {
            this.addPoint();
        }
        
        this.round.update(round => round + 1);
        if (this.checkEnd()) {
            this.endGame();
        }
    }

    async endGame() {
        this.gameState.set('gameover');
        await this.gameService.insertResult(2, this.score());
        this.leaderboard.set(await this.gameService.getHighScores(2));

    }

    checkEnd(): boolean {
        if (this.round() - 1 === this.questions().length) {
            return true;
        }
        else {
            return false;
        }
    }

    restartGame() {
        this.score.set(0);
        this.round.set(0);
        this.gameState.set('start');
    }

}