import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Course {
  id: number;
  title: string;
  imageSrc: string;
  units: Unit[];
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  unitId: number;
  order: number;
  completed: boolean;
  challenges: Challenge[];
}

export interface Challenge {
  id: number;
  lessonId: number;
  type: 'SELECT' | 'ASSIST' | 'FILL_IN_THE_BLANK';
  question: string;
  options?: string[];
  correctOption?: string;
  order: number;
}

interface LearningStore {
  courses: Course[];
  activeCourse: Course | null;
  currentLesson: Lesson | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadCourses: () => Promise<void>;
  setActiveCourse: (courseId: number) => void;
  loadLesson: (lessonId: number) => Promise<void>;
  completeLesson: (lessonId: number) => Promise<void>;
  clearError: () => void;
}

// Mock data for development
const mockCourses: Course[] = [
  {
    id: 1,
    title: 'English for Beginners',
    imageSrc: '/assets/en.svg',
    units: [
      {
        id: 1,
        title: 'Unit 1: Basic Greetings',
        description: 'Learn how to greet people in English',
        order: 1,
        lessons: [
          {
            id: 1,
            title: 'Hello and Goodbye',
            unitId: 1,
            order: 1,
            completed: false,
            challenges: [
              {
                id: 1,
                lessonId: 1,
                type: 'SELECT',
                question: 'How do you say "hello" in English?',
                options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
                correctOption: 'Hello',
                order: 1,
              },
              {
                id: 2,
                lessonId: 1,
                type: 'SELECT',
                question: 'How do you say "goodbye" in English?',
                options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
                correctOption: 'Goodbye',
                order: 2,
              },
            ],
          },
          {
            id: 2,
            title: 'Nice to Meet You',
            unitId: 1,
            order: 2,
            completed: false,
            challenges: [
              {
                id: 3,
                lessonId: 2,
                type: 'FILL_IN_THE_BLANK',
                question: 'Nice to ___ you!',
                correctOption: 'meet',
                order: 1,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: 'Unit 2: Numbers',
        description: 'Learn numbers from 1 to 10',
        order: 2,
        lessons: [
          {
            id: 3,
            title: 'Numbers 1-5',
            unitId: 2,
            order: 1,
            completed: false,
            challenges: [
              {
                id: 4,
                lessonId: 3,
                type: 'SELECT',
                question: 'What number is this: "three"?',
                options: ['1', '2', '3', '4'],
                correctOption: '3',
                order: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      courses: [],
      activeCourse: null,
      currentLesson: null,
      isLoading: false,
      error: null,
      
      loadCourses: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would be an API call
          // const response = await fetch('/api/courses');
          // const courses = await response.json();
          
          set({ 
            courses: mockCourses,
            activeCourse: mockCourses[0],
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load courses',
            isLoading: false 
          });
        }
      },
      
      setActiveCourse: (courseId: number) => {
        const { courses } = get();
        const course = courses.find(c => c.id === courseId);
        if (course) {
          set({ activeCourse: course });
        }
      },
      
      loadLesson: async (lessonId: number) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { courses } = get();
          let lesson: Lesson | null = null;
          
          for (const course of courses) {
            for (const unit of course.units) {
              const foundLesson = unit.lessons.find(l => l.id === lessonId);
              if (foundLesson) {
                lesson = foundLesson;
                break;
              }
            }
            if (lesson) break;
          }
          
          if (!lesson) {
            throw new Error('Lesson not found');
          }
          
          set({ 
            currentLesson: lesson,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load lesson',
            isLoading: false 
          });
        }
      },
      
      completeLesson: async (lessonId: number) => {
        try {
          // Simulate API call
          // await fetch(`/api/lessons/${lessonId}/complete`, { method: 'POST' });
          
          const { courses } = get();
          const updatedCourses = courses.map(course => ({
            ...course,
            units: course.units.map(unit => ({
              ...unit,
              lessons: unit.lessons.map(lesson => 
                lesson.id === lessonId 
                  ? { ...lesson, completed: true }
                  : lesson
              ),
            })),
          }));
          
          set({ courses: updatedCourses });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to complete lesson' });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'learning-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        courses: state.courses,
        activeCourse: state.activeCourse,
      }),
    }
  )
);