'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Beat, Genre } from '@/types';
import { INITIAL_BEATS } from '@/data/seedBeats';
import { generateBeatAudioUrl } from '@/utils/audioGenerator';

interface AudioContextType {
  beats: Beat[];
  activeBeat: Beat | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  isCrossfade: boolean;
  crossfadeDuration: number;
  activeSurface: 'marketplace' | 'cypher';
  selectedGenre: Genre | 'All' | 'Sponsored';
  likedBeatIds: string[];
  playBeat: (beat: Beat) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleCrossfade: () => void;
  setCrossfadeDuration: (seconds: number) => void;
  addNewBeat: (beat: Beat) => void;
  markExclusiveSold: (beatId: string) => void;
  toggleLikeBeat: (beatId: string) => void;
  setActiveSurface: (surface: 'marketplace' | 'cypher') => void;
  setSelectedGenre: (genre: Genre | 'All' | 'Sponsored') => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [beats, setBeats] = useState<Beat[]>(INITIAL_BEATS);
  const [activeBeat, setActiveBeat] = useState<Beat | null>(INITIAL_BEATS[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isCrossfade, setIsCrossfade] = useState(true);
  const [crossfadeDuration, setCrossfadeDuration] = useState(3);
  const [activeSurface, setActiveSurface] = useState<'marketplace' | 'cypher'>('marketplace');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All' | 'Sponsored'>('All');
  const [likedBeatIds, setLikedBeatIds] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const crossfadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize beats and synthesized audio URLs
  useEffect(() => {
    // Load liked beat ids
    try {
      const savedLikes = localStorage.getItem('beats_bazaar_likes');
      if (savedLikes) {
        setLikedBeatIds(JSON.parse(savedLikes));
      }
    } catch (e) {}

    const saved = localStorage.getItem('beats_bazaar_catalog');
    let loadedBeats: Beat[] = [];
    if (saved) {
      try {
        loadedBeats = JSON.parse(saved);
      } catch (e) {
        loadedBeats = INITIAL_BEATS;
      }
    } else {
      loadedBeats = INITIAL_BEATS;
    }

    // Ensure all seed beats have valid audio URLs and likes
    const initializedBeats = loadedBeats.map((b) => {
      const seedMatch = INITIAL_BEATS.find(sb => sb.id === b.id);
      return {
        ...b,
        likes: b.likes ?? (seedMatch?.likes || 0),
        audioUrl: b.audioUrl || generateBeatAudioUrl(b.genre, b.bpm)
      };
    });

    setBeats(initializedBeats);
    if (initializedBeats.length > 0 && !activeBeat) {
      setActiveBeat(initializedBeats[0]);
    }
  }, []);

  // Sync beats to localStorage
  const saveBeats = (updated: Beat[]) => {
    setBeats(updated);
    try {
      localStorage.setItem('beats_bazaar_catalog', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  // Setup audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);

      // Handle Crossfade near end of track
      if (isCrossfade && audio.duration && (audio.duration - audio.currentTime) <= crossfadeDuration && (audio.duration - audio.currentTime) > 0.3) {
        const remaining = audio.duration - audio.currentTime;
        const fadeRatio = Math.max(0, remaining / crossfadeDuration);
        audio.volume = volume * fadeRatio;
      }
    };

    const onEnded = () => {
      nextTrack();
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
    };
  }, [volume, isCrossfade, crossfadeDuration, beats, activeBeat, isShuffle, activeSurface, selectedGenre]);

  const playBeat = (beat: Beat) => {
    if (!audioRef.current) return;
    setActiveBeat(beat);
    if (!beat.audioUrl) {
      beat.audioUrl = generateBeatAudioUrl(beat.genre, beat.bpm);
    }

    audioRef.current.src = beat.audioUrl;
    audioRef.current.volume = volume;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.log('Autoplay deferred by browser policy:', err));
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!audioRef.current.src && activeBeat) {
        playBeat(activeBeat);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log('Play triggered:', err));
      }
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const getFilteredQueue = () => {
    let pool = activeSurface === 'cypher' ? beats.filter(b => b.inCypher) : beats;
    if (selectedGenre !== 'All') {
      pool = pool.filter(b => b.genre === selectedGenre);
    }
    return pool.length > 0 ? pool : beats;
  };

  const nextTrack = () => {
    const queue = getFilteredQueue();
    if (queue.length === 0) return;

    if (isShuffle) {
      const remaining = queue.filter(b => b.id !== activeBeat?.id);
      const next = remaining.length > 0 ? remaining[Math.floor(Math.random() * remaining.length)] : queue[0];
      playBeat(next);
      return;
    }

    const currentIndex = queue.findIndex(b => b.id === activeBeat?.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playBeat(queue[nextIndex]);
  };

  const prevTrack = () => {
    const queue = getFilteredQueue();
    if (queue.length === 0) return;
    const currentIndex = queue.findIndex(b => b.id === activeBeat?.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playBeat(queue[prevIndex]);
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);
  const toggleCrossfade = () => setIsCrossfade(prev => !prev);

  const addNewBeat = (newBeat: Beat) => {
    if (!newBeat.audioUrl) {
      newBeat.audioUrl = generateBeatAudioUrl(newBeat.genre, newBeat.bpm);
    }
    const updated = [newBeat, ...beats];
    saveBeats(updated);
  };

  const markExclusiveSold = (beatId: string) => {
    const updated = beats.map(b => b.id === beatId ? { ...b, isSoldExclusive: true } : b);
    saveBeats(updated);
    if (activeBeat?.id === beatId) {
      setActiveBeat(prev => prev ? { ...prev, isSoldExclusive: true } : null);
    }
  };

  const toggleLikeBeat = (beatId: string) => {
    const isCurrentlyLiked = likedBeatIds.includes(beatId);
    const newLikedIds = isCurrentlyLiked 
      ? likedBeatIds.filter(id => id !== beatId) 
      : [...likedBeatIds, beatId];
    
    setLikedBeatIds(newLikedIds);
    try {
      localStorage.setItem('beats_bazaar_likes', JSON.stringify(newLikedIds));
    } catch (e) {}

    const updatedBeats = beats.map(b => {
      if (b.id === beatId) {
        const currentLikes = b.likes || 0;
        return {
          ...b,
          likes: isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
        };
      }
      return b;
    });

    saveBeats(updatedBeats);
  };

  return (
    <AudioContext.Provider value={{
      beats,
      activeBeat,
      isPlaying,
      currentTime,
      duration,
      volume,
      isShuffle,
      isCrossfade,
      crossfadeDuration,
      activeSurface,
      selectedGenre,
      likedBeatIds,
      playBeat,
      togglePlay,
      seek,
      setVolume,
      nextTrack,
      prevTrack,
      toggleShuffle,
      toggleCrossfade,
      setCrossfadeDuration,
      addNewBeat,
      markExclusiveSold,
      toggleLikeBeat,
      setActiveSurface,
      setSelectedGenre
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
}
