import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUESTS } from '../constants/quests';

export interface Quest {
  id: number;
  title: string;
  description: string;
  value: number;
  reward: number;
  type: 'points' | 'lessons' | 'streak';
  progress: number;
  completed: boolean;
  claimed: boolean;
}

interface QuestStore {
  quests: Quest[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadQuests: () => Promise<void>;
  updateQuestProgress: (questId: number, progress: number) => void;
  claimReward: (questId: number) => Promise<void>;
  resetQuests: () => void;
  clearError: () => void;
}

// Convert constants to quest format
const createQuestsFromConstants = (): Quest[] => {
  return QUESTS.map(quest => ({
    ...quest,
    progress: 0,
    completed: false,
    claimed: false,
  }));
};

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => ({
      quests: [],
      isLoading: false,
      error: null,
      
      loadQuests: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real app, this would be an API call
          // const response = await fetch('/api/quests');
          // const quests = await response.json();
          
          const { quests } = get();
          
          // If no quests exist, create them from constants
          if (quests.length === 0) {
            set({ 
              quests: createQuestsFromConstants(),
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load quests',
            isLoading: false 
          });
        }
      },
      
      updateQuestProgress: (questId: number, progress: number) => {
        const { quests } = get();
        const updatedQuests = quests.map(quest => {
          if (quest.id === questId) {
            const newProgress = Math.min(progress, quest.value);
            const completed = newProgress >= quest.value;
            return {
              ...quest,
              progress: newProgress,
              completed,
            };
          }
          return quest;
        });
        
        set({ quests: updatedQuests });
      },
      
      claimReward: async (questId: number) => {
        try {
          // Simulate API call
          // await fetch(`/api/quests/${questId}/claim`, { method: 'POST' });
          
          const { quests } = get();
          const quest = quests.find(q => q.id === questId);
          
          if (!quest || !quest.completed || quest.claimed) {
            throw new Error('Quest cannot be claimed');
          }
          
          const updatedQuests = quests.map(q => 
            q.id === questId 
              ? { ...q, claimed: true }
              : q
          );
          
          set({ quests: updatedQuests });
          
          // Return the reward amount for the calling component to handle
          return quest.reward;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to claim reward' });
          throw error;
        }
      },
      
      resetQuests: () => {
        set({ quests: createQuestsFromConstants() });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'quest-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ quests: state.quests }),
    }
  )
);