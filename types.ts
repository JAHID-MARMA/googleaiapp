
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum AppView {
  HOME,
  LESSON_VIEW,
  GENERATING_QUIZ,
  QUIZ_VIEW,
  SUMMARY_VIEW,
}

export enum Language {
  ENGLISH = 'English',
  BANGLA = 'Bangla',
}
