export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  isFavorited?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  flashcards: Flashcard[];
}

export interface Course {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface StudySession {
  courseId: string;
  subjectIds: string[];
  flashcards: Flashcard[];
}