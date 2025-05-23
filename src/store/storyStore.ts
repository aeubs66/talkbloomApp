import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Story {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  completed: boolean;
  frames: Frame[];
}

export interface Frame {
  id: number;
  storyId: number;
  order: number;
  text: string;
  imageSrc?: string;
  audioSrc?: string;
}

interface StoryStore {
  stories: Story[];
  currentStory: Story | null;
  currentFrameIndex: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadStories: () => Promise<void>;
  loadStory: (storyId: number) => Promise<void>;
  nextFrame: () => void;
  previousFrame: () => void;
  setFrameIndex: (index: number) => void;
  completeStory: (storyId: number) => Promise<void>;
  clearError: () => void;
}

// Mock data for development
const mockStories: Story[] = [
  {
    id: 1,
    title: 'The Little Bird',
    description: 'A story about a little bird learning to fly',
    imageSrc: '/assets/story1.jpg',
    completed: false,
    frames: [
      {
        id: 1,
        storyId: 1,
        order: 1,
        text: 'Once upon a time, there was a little bird who lived in a nest high up in a tree.',
        imageSrc: '/assets/frame1.jpg',
        audioSrc: '/assets/frame1.mp3',
      },
      {
        id: 2,
        storyId: 1,
        order: 2,
        text: 'The little bird was afraid to fly because the ground looked so far away.',
        imageSrc: '/assets/frame2.jpg',
        audioSrc: '/assets/frame2.mp3',
      },
      {
        id: 3,
        storyId: 1,
        order: 3,
        text: 'One day, the mother bird encouraged the little bird to try flying.',
        imageSrc: '/assets/frame3.jpg',
        audioSrc: '/assets/frame3.mp3',
      },
      {
        id: 4,
        storyId: 1,
        order: 4,
        text: 'With courage, the little bird spread its wings and took its first flight!',
        imageSrc: '/assets/frame4.jpg',
        audioSrc: '/assets/frame4.mp3',
      },
    ],
  },
  {
    id: 2,
    title: 'The Magic Garden',
    description: 'A magical adventure in an enchanted garden',
    imageSrc: '/assets/story2.jpg',
    completed: false,
    frames: [
      {
        id: 5,
        storyId: 2,
        order: 1,
        text: 'In a secret garden, flowers could talk and trees could dance.',
        imageSrc: '/assets/frame5.jpg',
        audioSrc: '/assets/frame5.mp3',
      },
      {
        id: 6,
        storyId: 2,
        order: 2,
        text: 'A young girl discovered this magical place one sunny afternoon.',
        imageSrc: '/assets/frame6.jpg',
        audioSrc: '/assets/frame6.mp3',
      },
      {
        id: 7,
        storyId: 2,
        order: 3,
        text: 'The flowers taught her about kindness and the trees about patience.',
        imageSrc: '/assets/frame7.jpg',
        audioSrc: '/assets/frame7.mp3',
      },
    ],
  },
  {
    id: 3,
    title: 'The Friendly Dragon',
    description: 'A tale of friendship with an unlikely companion',
    imageSrc: '/assets/story3.jpg',
    completed: true,
    frames: [
      {
        id: 8,
        storyId: 3,
        order: 1,
        text: 'Everyone in the village was afraid of the dragon on the mountain.',
        imageSrc: '/assets/frame8.jpg',
        audioSrc: '/assets/frame8.mp3',
      },
      {
        id: 9,
        storyId: 3,
        order: 2,
        text: 'But one brave child decided to visit the dragon and make friends.',
        imageSrc: '/assets/frame9.jpg',
        audioSrc: '/assets/frame9.mp3',
      },
    ],
  },
];

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      stories: [],
      currentStory: null,
      currentFrameIndex: 0,
      isLoading: false,
      error: null,
      
      loadStories: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would be an API call
          // const response = await fetch('/api/stories');
          // const stories = await response.json();
          
          set({ 
            stories: mockStories,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load stories',
            isLoading: false 
          });
        }
      },
      
      loadStory: async (storyId: number) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { stories } = get();
          const story = stories.find(s => s.id === storyId);
          
          if (!story) {
            throw new Error('Story not found');
          }
          
          set({ 
            currentStory: story,
            currentFrameIndex: 0,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load story',
            isLoading: false 
          });
        }
      },
      
      nextFrame: () => {
        const { currentStory, currentFrameIndex } = get();
        if (currentStory && currentFrameIndex < currentStory.frames.length - 1) {
          set({ currentFrameIndex: currentFrameIndex + 1 });
        }
      },
      
      previousFrame: () => {
        const { currentFrameIndex } = get();
        if (currentFrameIndex > 0) {
          set({ currentFrameIndex: currentFrameIndex - 1 });
        }
      },
      
      setFrameIndex: (index: number) => {
        const { currentStory } = get();
        if (currentStory && index >= 0 && index < currentStory.frames.length) {
          set({ currentFrameIndex: index });
        }
      },
      
      completeStory: async (storyId: number) => {
        try {
          // Simulate API call
          // await fetch(`/api/stories/${storyId}/complete`, { method: 'POST' });
          
          const { stories } = get();
          const updatedStories = stories.map(story => 
            story.id === storyId 
              ? { ...story, completed: true }
              : story
          );
          
          set({ stories: updatedStories });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to complete story' });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'story-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        stories: state.stories,
      }),
    }
  )
);