import { create } from 'zustand';

interface AudioState {
  currentTrackId: string | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  setCurrentTrack: (id: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrackId: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  setCurrentTrack: (id) => set({ currentTrackId: id }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  reset: () => set({ currentTrackId: null, isPlaying: false, currentTime: 0, duration: 0 }),
}));
