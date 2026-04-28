import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Music, Gamepad2, Info } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans static-noise selection:bg-neon-magenta selection:text-white">
      <div className="scanline" />
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header: System Status */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center bg-black border-b border-neon-cyan/30">
        <div className="flex items-center gap-4 glitch-tear">
          <div className="w-12 h-12 bg-neon-cyan flex items-center justify-center">
            <Gamepad2 className="text-black w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase leading-none">
              NET_RUNNER <span className="text-neon-cyan">[001]</span>
            </h1>
            <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">
              STATUS: NOMINAL // LINK_STABLE
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-12 text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-600">
          <span className="text-neon-cyan cursor-crosshair hover:text-white">&gt; INITIALIZE</span>
          <span className="cursor-crosshair hover:text-white">&gt; AUDIO_FEED</span>
          <span className="cursor-crosshair hover:text-white">&gt; DATA_LOG</span>
          <div className="w-24 h-1 bg-zinc-900 overflow-hidden">
            <div className="h-full w-1/3 bg-neon-magenta animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Framework */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row p-4 gap-4 max-w-[1600px] mx-auto w-full">
        {/* Module A: Central Core */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 glass flex flex-col items-center justify-center p-8 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-neon-cyan/20" />
          <div className="mb-6 w-full flex justify-between items-end border-b border-white/5 pb-2">
            <h2 className="text-[10px] text-neon-cyan uppercase tracking-[0.5em] font-bold">ARCADE_BUFFER</h2>
            <span className="text-[8px] text-zinc-600 font-mono">0x4F_PROCESS: ACTIVE</span>
          </div>
          <SnakeGame />
        </motion.section>

        {/* Module B: Audio Engine */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-[450px] flex flex-col gap-4"
        >
          <div className="glass flex-1 p-8 relative overflow-hidden">
             <div className="absolute inset-x-0 top-0 h-1 bg-neon-magenta/20" />
             <div className="mb-6 w-full flex justify-between items-end border-b border-white/5 pb-2">
                <h2 className="text-[10px] text-neon-magenta uppercase tracking-[0.5em] font-bold">SYNTH_CORE</h2>
                <span className="text-[8px] text-zinc-600 font-mono">BPM: SYNCED</span>
             </div>
             
             <div className="mb-8 p-4 bg-neon-magenta/5 border-l-4 border-neon-magenta">
                <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                  [CAUTION] AUDIO FEED IS AI-GENERATED. FREQUENCIES MAY INDUCE TEMPORAL DISPLACEMENT.
                </p>
             </div>

             <MusicPlayer />
          </div>

          {/* Module C: System Metrics */}
          <div className="h-48 glass p-6 flex flex-col justify-between">
            <h3 className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">SYSTEM_LOGS</h3>
            <div className="space-y-1 font-mono text-[9px] text-zinc-700">
               <p>&gt; MEMORY_ALLOC: 4096KB</p>
               <p>&gt; KERNEL_DUMP: NO_ERRORS</p>
               <p className="text-neon-cyan animate-pulse">&gt; ANALYZING_USER_INPUT...</p>
            </div>
            <div className="flex gap-1 h-2">
               {Array.from({length: 20}).map((_, i) => (
                 <div key={i} className={`flex-1 ${i < 12 ? 'bg-neon-cyan/20' : 'bg-zinc-900'}`} />
               ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer: Terminal Info */}
      <footer className="relative z-10 px-6 py-4 flex justify-between items-center bg-black border-t border-white/5 text-[9px] font-mono text-zinc-600 tracking-widest uppercase">
        <p>RE-INPUT: 2026 // FABRICATED BY_MACHINE</p>
        <div className="flex gap-8">
           <span className="text-neon-magenta hover:text-white transition-colors cursor-pointer">/ SOURCE_LINK</span>
           <span className="text-neon-cyan hover:text-white transition-colors cursor-pointer">/ CRYPTO_KEY</span>
        </div>
      </footer>
    </div>
  );
}
