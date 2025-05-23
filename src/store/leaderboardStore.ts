import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LeaderboardEntry {
  id: number;
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
  rank: number;
}

export type LeaderboardPeriod = 'week' | 'month' | 'all';

interface LeaderboardStore {
  leaderboard: LeaderboardEntry[];
  currentPeriod: LeaderboardPeriod;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadLeaderboard: (period: LeaderboardPeriod) => Promise<void>;
  setPeriod: (period: LeaderboardPeriod) => void;
  clearError: () => void;
}

// Mock data for development
const mockLeaderboardData: Record<LeaderboardPeriod, LeaderboardEntry[]> = {
  week: [
    {
      id: 1,
      userId: 'user_123',
      userName: 'Language Learner',
      userImageSrc: '',
      points: 150,
      rank: 15,
    },
    {
      id: 2,
      userId: 'user_456',
      userName: 'Study Master',
      userImageSrc: '',
      points: 280,
      rank: 8,
    },
    {
      id: 3,
      userId: 'user_789',
      userName: 'Quick Learner',
      userImageSrc: '',
      points: 320,
      rank: 5,
    },
    {
      id: 4,
      userId: 'user_101',
      userName: 'Grammar Guru',
      userImageSrc: '',
      points: 450,
      rank: 2,
    },
    {
      id: 5,
      userId: 'user_102',
      userName: 'Vocab Wizard',
      userImageSrc: '',
      points: 500,
      rank: 1,
    },
    {
      id: 6,
      userId: 'user_103',
      userName: 'Pronunciation Pro',
      userImageSrc: '',
      points: 380,
      rank: 3,
    },
    {
      id: 7,
      userId: 'user_104',
      userName: 'Fluency Fighter',
      userImageSrc: '',
      points: 350,
      rank: 4,
    },
    {
      id: 8,
      userId: 'user_105',
      userName: 'Syntax Solver',
      userImageSrc: '',
      points: 300,
      rank: 6,
    },
    {
      id: 9,
      userId: 'user_106',
      userName: 'Reading Rocket',
      userImageSrc: '',
      points: 290,
      rank: 7,
    },
    {
      id: 10,
      userId: 'user_107',
      userName: 'Writing Warrior',
      userImageSrc: '',
      points: 270,
      rank: 9,
    },
  ],
  month: [
    {
      id: 1,
      userId: 'user_123',
      userName: 'Language Learner',
      userImageSrc: '',
      points: 850,
      rank: 12,
    },
    {
      id: 2,
      userId: 'user_456',
      userName: 'Study Master',
      userImageSrc: '',
      points: 1200,
      rank: 6,
    },
    {
      id: 3,
      userId: 'user_789',
      userName: 'Quick Learner',
      userImageSrc: '',
      points: 1450,
      rank: 3,
    },
    {
      id: 4,
      userId: 'user_101',
      userName: 'Grammar Guru',
      userImageSrc: '',
      points: 1800,
      rank: 1,
    },
    {
      id: 5,
      userId: 'user_102',
      userName: 'Vocab Wizard',
      userImageSrc: '',
      points: 1650,
      rank: 2,
    },
  ],
  all: [
    {
      id: 1,
      userId: 'user_123',
      userName: 'Language Learner',
      userImageSrc: '',
      points: 2150,
      rank: 25,
    },
    {
      id: 2,
      userId: 'user_456',
      userName: 'Study Master',
      userImageSrc: '',
      points: 3200,
      rank: 8,
    },
    {
      id: 3,
      userId: 'user_789',
      userName: 'Quick Learner',
      userImageSrc: '',
      points: 4450,
      rank: 3,
    },
    {
      id: 4,
      userId: 'user_101',
      userName: 'Grammar Guru',
      userImageSrc: '',
      points: 5800,
      rank: 1,
    },
    {
      id: 5,
      userId: 'user_102',
      userName: 'Vocab Wizard',
      userImageSrc: '',
      points: 5200,
      rank: 2,
    },
  ],
};

export const useLeaderboardStore = create<LeaderboardStore>()(
  persist(
    (set, get) => ({
      leaderboard: [],
      currentPeriod: 'week',
      isLoading: false,
      error: null,
      
      loadLeaderboard: async (period: LeaderboardPeriod) => {
        set({ isLoading: true, error: null, currentPeriod: period });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would be an API call
          // const response = await fetch(`/api/leaderboard?period=${period}`);
          // const leaderboard = await response.json();
          
          const leaderboard = mockLeaderboardData[period] || [];
          
          set({ 
            leaderboard,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load leaderboard',
            isLoading: false 
          });
        }
      },
      
      setPeriod: (period: LeaderboardPeriod) => {
        const { currentPeriod, loadLeaderboard } = get();
        if (currentPeriod !== period) {
          loadLeaderboard(period);
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'leaderboard-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        currentPeriod: state.currentPeriod,
      }),
    }
  )
);