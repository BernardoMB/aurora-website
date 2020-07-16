export interface Assesment {
  assesmentType: string;
  prompt: { answers: string[], _id: string, question: string },
  correctResponse: number;
  questionPlain: string;
  quiz: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
