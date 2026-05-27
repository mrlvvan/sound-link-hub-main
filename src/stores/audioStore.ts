import { create } from 'zustand';

export type TrackMeta = {
  id: string;
  name: string;
  username: string;
  audioUrl: string;
  gradientBg: string;
};

interface AudioState {
  currentTrackId: string | null;
  currentTrackMeta: TrackMeta | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  setCurrentTrack: (id: string | null) => void;
  setCurrentTrackMeta: (meta: TrackMeta | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrackId: null,
  currentTrackMeta: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  setCurrentTrack: (id) => set({ currentTrackId: id }),
  setCurrentTrackMeta: (meta) => set({ currentTrackMeta: meta, currentTrackId: meta?.id ?? null }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  reset: () => set({ currentTrackId: null, currentTrackMeta: null, isPlaying: false, currentTime: 0, duration: 0 }),
}));
