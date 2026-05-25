export interface Question {
    category: string,
    question: string,
    correctAnswer: string,
    incorrectAnswers: string[],
    allAnswers: string[];
}