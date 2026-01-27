import { useEffect, useRef, useState } from 'react';
import { useAudioStore } from '@/stores/audioStore';

interface UseAudioPlayerOptions {
  trackId: string;
  audioUrl: string;
  isActive?: boolean;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export const useAudioPlayer = ({
  trackId,
  audioUrl,
  isActive = false,
  autoPlay = false,
  onEnded,
}: UseAudioPlayerOptions) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    currentTrackId, 
    isPlaying, 
    volume,
    setCurrentTrack, 
    setIsPlaying,
    setCurrentTime,
    setDuration 
  } = useAudioStore();

  const isCurrentTrack = currentTrackId === trackId;

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    // Event listeners
    const handleLoadedMetadata = () => {
      setIsLoading(false);
      setDuration(audio.duration);
    };

    const handleError = () => {
      setError('Не удалось загрузить аудио');
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (isCurrentTrack) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.src = '';
    };
  }, [audioUrl, trackId, isCurrentTrack, setCurrentTime, setDuration, setIsPlaying, onEnded, volume]);

  // Handle active state and autoplay
  useEffect(() => {
    if (!audioRef.current) return;

    if (isActive && autoPlay) {
      setCurrentTrack(trackId);
      setIsPlaying(true);
      audioRef.current.play().catch(() => {
        setError('Не удалось воспроизвести аудио');
      });
    } else if (!isActive && isCurrentTrack) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive, autoPlay, trackId, isCurrentTrack, setCurrentTrack, setIsPlaying]);

  // Sync playing state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isCurrentTrack && isPlaying) {
      audioRef.current.play().catch(() => {
        setError('Не удалось воспроизвести аудио');
      });
    } else if (isCurrentTrack && !isPlaying) {
      audioRef.current.pause();
    } else if (!isCurrentTrack && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isCurrentTrack, isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = () => {
    if (audioRef.current && !isLoading) {
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current && isCurrentTrack) {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isCurrentTrack && isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return {
    play,
    pause,
    togglePlayPause,
    isPlaying: isCurrentTrack && isPlaying,
    isLoading,
    error,
    audioRef,
  };
};
