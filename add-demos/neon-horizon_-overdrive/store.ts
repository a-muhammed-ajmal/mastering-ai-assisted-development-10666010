import { create } from 'zustand';

interface GameState {
  status: 'MENU' | 'PLAYING' | 'GAME_OVER';
  score: number;
  speed: number;
  highScore: number;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  increaseScore: (amount: number) => void;
  setSpeed: (speed: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'MENU',
  score: 0,
  speed: 0,
  highScore: 0,
  startGame: () => set({ status: 'PLAYING', score: 0, speed: 15 }),
  endGame: () => set((state) => ({ status: 'GAME_OVER', speed: 0, highScore: Math.max(state.score, state.highScore) })),
  resetGame: () => set({ status: 'MENU', score: 0, speed: 0 }),
  increaseScore: (amount) => set((state) => ({ score: state.score + amount })),
  setSpeed: (speed) => set({ speed }),
}));