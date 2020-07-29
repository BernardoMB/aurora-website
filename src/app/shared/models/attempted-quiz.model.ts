export interface AttemptedQuiz {
    id: string;
    quiz: string;
    completedAssesments?: string[];
    correct?: string[];
    skipped?: string[];
    wrong?: string[];
    createdAt: string;
    updatedAt: string;
}
