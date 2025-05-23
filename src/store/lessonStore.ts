import { create } from 'zustand';
import { Challenge } from './learningStore';

export interface LessonProgress {
  lessonId: number;
  currentChallengeIndex: number;
  correctAnswers: number;
  totalChallenges: number;
  hearts: number;
  isCompleted: boolean;
  startTime: number;
  endTime?: number;
}

interface LessonStore {
  currentLesson: {
    id: number;
    title: string;
    challenges: Challenge[];
  } | null;
  progress: LessonProgress | null;
  selectedAnswer: string | null;
  isAnswerCorrect: boolean | null;
  showResult: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startLesson: (lesson: { id: number; title: string; challenges: Challenge[] }, initialHearts: number) => void;
  selectAnswer: (answer: string) => void;
  submitAnswer: () => boolean;
  nextChallenge: () => void;
  useHeart: () => void;
  completeLesson: () => void;
  resetLesson: () => void;
  clearError: () => void;
}

export const useLessonStore = create<LessonStore>()((set, get) => ({
  currentLesson: null,
  progress: null,
  selectedAnswer: null,
  isAnswerCorrect: null,
  showResult: false,
  isLoading: false,
  error: null,
  
  startLesson: (lesson, initialHearts) => {
    set({
      currentLesson: lesson,
      progress: {
        lessonId: lesson.id,
        currentChallengeIndex: 0,
        correctAnswers: 0,
        totalChallenges: lesson.challenges.length,
        hearts: initialHearts,
        isCompleted: false,
        startTime: Date.now(),
      },
      selectedAnswer: null,
      isAnswerCorrect: null,
      showResult: false,
      error: null,
    });
  },
  
  selectAnswer: (answer) => {
    set({ selectedAnswer: answer });
  },
  
  submitAnswer: () => {
    const { currentLesson, progress, selectedAnswer } = get();
    
    if (!currentLesson || !progress || !selectedAnswer) {
      return false;
    }
    
    const currentChallenge = currentLesson.challenges[progress.currentChallengeIndex];
    const isCorrect = selectedAnswer === currentChallenge.correctOption;
    
    set({
      isAnswerCorrect: isCorrect,
      showResult: true,
      progress: {
        ...progress,
        correctAnswers: isCorrect ? progress.correctAnswers + 1 : progress.correctAnswers,
      },
    });
    
    return isCorrect;
  },
  
  nextChallenge: () => {
    const { currentLesson, progress } = get();
    
    if (!currentLesson || !progress) return;
    
    const nextIndex = progress.currentChallengeIndex + 1;
    
    if (nextIndex >= currentLesson.challenges.length) {
      // Lesson completed
      set({
        progress: {
          ...progress,
          isCompleted: true,
          endTime: Date.now(),
        },
      });
    } else {
      // Move to next challenge
      set({
        progress: {
          ...progress,
          currentChallengeIndex: nextIndex,
        },
        selectedAnswer: null,
        isAnswerCorrect: null,
        showResult: false,
      });
    }
  },
  
  useHeart: () => {
    const { progress } = get();
    
    if (!progress || progress.hearts <= 0) return;
    
    set({
      progress: {
        ...progress,
        hearts: progress.hearts - 1,
      },
    });
  },
  
  completeLesson: () => {
    const { progress } = get();
    
    if (!progress) return;
    
    set({
      progress: {
        ...progress,
        isCompleted: true,
        endTime: Date.now(),
      },
    });
  },
  
  resetLesson: () => {
    set({
      currentLesson: null,
      progress: null,
      selectedAnswer: null,
      isAnswerCorrect: null,
      showResult: false,
      error: null,
    });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));