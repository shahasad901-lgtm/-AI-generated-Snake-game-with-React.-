import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic, Music } from 'lucide-react';
import { Song, DUMMY_SONGS } from '../constants';

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const currentSong = DUMMY_SONGS[currentSongIndex];

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(t => {
          if (t >= currentSong.duration) {
            handleNext();
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % DUMMY_SONGS.length);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[400px] glass p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
         <button 
           onClick={() => setShowPlaylist(!showPlaylist)}
           className={`p-2 transition-colors ${showPlaylist ? 'bg-neon-magenta text-black shadow-[0_0_10px_#ff00ff]' : 'text-zinc-500 hover:text-white'}`}
         >
           <ListMusic className="w-5 h-5" />
         </button>
      </div>

      <AnimatePresence mode="wait">
        {!showPlaylist ? (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
               <div className={`absolute -inset-1 bg-neon-cyan opacity-20 ${isPlaying ? 'animate-pulse' : ''}`}></div>
               <motion.img
                 key={currentSong.coverUrl}
                 src={currentSong.coverUrl}
                 alt={currentSong.title}
                 className="w-48 h-48 rounded-none object-cover relative z-10 border border-white/10 grayscale hover:grayscale-0 transition-all duration-500"
               />
            </div>

            <div className="text-center mb-8 w-full">
              <motion.h3 
                key={currentSong.title}
                className="text-lg font-black neon-text-cyan truncate uppercase italic tracking-tighter"
              >
                {currentSong.title}
              </motion.h3>
              <motion.p 
                key={currentSong.artist}
                className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]"
              >
                // {currentSong.artist}
              </motion.p>
            </div>

            <div className="w-full mb-8">
              <div className="h-1 w-full bg-zinc-900 overflow-hidden relative mb-2">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-neon-magenta"
                  style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono tracking-widest text-zinc-600">
                <span>[{formatTime(currentTime)}]</span>
                <span>[{formatTime(currentSong.duration)}]</span>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <button onClick={handlePrev} className="text-zinc-500 hover:text-neon-cyan transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button 
                onClick={handleTogglePlay}
                className="w-16 h-16 bg-white text-black flex items-center justify-center hover:bg-neon-cyan transition-colors"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
              </button>

              <button onClick={handleNext} className="text-zinc-500 hover:text-neon-cyan transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="playlist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col w-full"
          >
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-mono mb-6 px-2">AVAILABLE_TRANSFERS</h3>
            <div className="space-y-3">
              {DUMMY_SONGS.map((song, idx) => (
                <button
                  key={song.id}
                  onClick={() => {
                    setCurrentSongIndex(idx);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`w-full flex items-center gap-4 p-3 transition-all border ${idx === currentSongIndex ? 'bg-neon-magenta/10 border-neon-magenta' : 'hover:bg-white/5 border-transparent'}`}
                >
                  <img src={song.coverUrl} className="w-12 h-12 grayscale object-cover" alt="" />
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-[11px] font-bold uppercase tracking-tight truncate ${idx === currentSongIndex ? 'text-neon-magenta' : 'text-white'}`}>{song.title}</p>
                    <p className="text-[8px] text-zinc-600 font-mono uppercase tracking-widest">{song.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-center gap-4 opacity-30">
        <Volume2 className="w-4 h-4 text-zinc-500" />
        <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-2/3 bg-white/20" />
        </div>
      </div>
    </div>
  );
}
