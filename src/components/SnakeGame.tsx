import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Pause, Play, Zap, Crown } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 80;
const SPEED_INCREMENT = 1.5;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: 0 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: 0 });
    setNextDirection({ x: 0, y: 0 });
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setGameStarted(true);
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameStarted && !isGameOver) setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameStarted, isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused || !gameStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check self-collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            setIsGameOver(true);
            if (score > highScore) setHighScore(score);
            return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        setDirection(nextDirection);

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          return newSnake;
        } else {
          newSnake.pop();
          return newSnake;
        }
      });
    };

    const speed = Math.max(40, INITIAL_SPEED - (score / 20) * SPEED_INCREMENT);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [nextDirection, food, isGameOver, isPaused, gameStarted, score, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear canvas with deep space black
    ctx.fillStyle = '#050505';
    ctx.shadowBlur = 0;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (ultra-subtle)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(canvas.width, i * size);
        ctx.stroke();
    }

    // Draw snake with GLOW TRAIL
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const opacity = Math.max(0.2, 1 - (index / snake.length) * 0.8);
      const segmentSize = isHead ? size : size * (1 - (index / snake.length) * 0.3);
      
      const x = segment.x * size + (size - segmentSize) / 2;
      const y = segment.y * size + (size - segmentSize) / 2;

      // 1. Outer Glow Pass
      ctx.shadowBlur = isHead ? 25 : 15;
      ctx.shadowColor = isHead ? '#00f3ff' : `rgba(0, 163, 171, ${opacity})`;
      ctx.fillStyle = isHead ? 'rgba(0, 243, 255, 0.2)' : `rgba(0, 163, 171, ${opacity * 0.2})`;
      ctx.beginPath();
      ctx.roundRect(x - 2, y - 2, segmentSize + 4, segmentSize + 4, 6);
      ctx.fill();

      // 2. Main Body Pass
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.fillStyle = isHead ? '#00f3ff' : `rgba(0, 163, 171, ${opacity})`;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, segmentSize - 2, segmentSize - 2, 4);
      ctx.fill();

      // 3. Highlight/Core Pass
      if (isHead) {
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(x + 5, y + 5, 4, 4, 2);
        ctx.roundRect(x + segmentSize - 9, y + 5, 4, 4, 2);
        ctx.fill();
      }
    });

    // Draw food with pulsing core
    const time = Date.now() / 200;
    const pulse = Math.sin(time) * 5;
    
    ctx.shadowBlur = 20 + pulse;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * size + size / 2,
      food.y * size + size / 2,
      size / 3 + (pulse / 10),
      0,
      Math.PI * 2
    );
    ctx.fill();

    // inner core of food
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(
      food.x * size + size / 2,
      food.y * size + size / 2,
      size / 6,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] items-center mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-cyan/10 border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <Zap className="w-6 h-6 text-neon-cyan animate-pulse fill-neon-cyan/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-500 font-mono font-bold leading-tight">SCORE_UNIT</span>
            <span className="text-4xl font-black text-neon-cyan neon-text-cyan font-sans leading-none glitch-tear">
              {score.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-500 font-mono font-bold leading-tight">MAX_BUFFER</span>
            <span className="text-4xl font-black text-neon-magenta neon-text-magenta font-sans leading-none glitch-tear">
              {highScore.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="p-2 bg-neon-magenta/10 border border-neon-magenta/30 shadow-[0_0_15px_rgba(255,0,255,0.3)]">
            <Crown className="w-6 h-6 text-neon-magenta animate-pulse fill-neon-magenta/20" />
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black rounded-lg neon-border-cyan cursor-none touch-none aspect-square"
          style={{ width: 'min(90vw, 400px)', height: 'min(90vw, 400px)' }}
        />

        <AnimatePresence>
          {(!gameStarted || isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
            >
              {!gameStarted && (
                <div className="text-center p-8">
                  <h2 className="text-5xl font-black mb-4 neon-text-cyan glitch-text italic tracking-tighter">NEON <span className="text-white">SNAKE</span></h2>
                  <p className="text-zinc-400 mb-8 font-mono text-[10px] uppercase tracking-[0.4em] opacity-80">PRESS ARROW KEYS TO START</p>
                  <div className="grid grid-cols-3 gap-2 w-32 mx-auto opacity-40">
                    <div className="col-start-2 border border-neon-cyan rounded p-2"><div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-neon-cyan mx-auto"></div></div>
                    <div className="row-start-2 border border-neon-cyan rounded p-2"><div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-neon-cyan mx-auto"></div></div>
                    <div className="row-start-2 border border-neon-cyan rounded p-2"><div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-neon-cyan mx-auto"></div></div>
                    <div className="row-start-2 border border-neon-cyan rounded p-2"><div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-neon-cyan mx-auto"></div></div>
                  </div>
                </div>
              )}

              {isGameOver && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <Trophy className="w-16 h-16 text-neon-yellow mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,240,31,0.5)]" />
                  <h2 className="text-4xl font-black text-red-500 mb-2 glitch-tear">FATAL_ERROR</h2>
                  <p className="text-sm text-zinc-500 font-mono mb-6 uppercase">CORE_DUMP: {score}_UNITS</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-cyan text-black font-bold border border-white/20 hover:scale-105 transition-transform"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    REINITIALIZE
                  </button>
                </motion.div>
              )}

              {isPaused && (
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-8 neon-text-cyan">PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-20 h-20 rounded-full border-2 border-neon-cyan flex items-center justify-center hover:bg-neon-cyan/10 transition-colors"
                  >
                    <Play className="w-10 h-10 text-neon-cyan fill-neon-cyan" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <button
           onClick={() => { if(gameStarted && !isGameOver) setIsPaused(p => !p) }}
           className="p-3 rounded-full glass hover:bg-white/10 transition-colors border border-white/5"
           disabled={!gameStarted || isGameOver}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
        <button
          onClick={resetGame}
          className="p-3 rounded-full glass hover:bg-white/10 transition-colors border border-white/5"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
