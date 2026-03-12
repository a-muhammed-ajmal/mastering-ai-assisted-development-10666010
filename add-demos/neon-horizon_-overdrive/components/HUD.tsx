import React from 'react';
import { useGameStore } from '../store';
import { Play, RotateCcw, Trophy, Zap } from 'lucide-react';

export const HUD: React.FC = () => {
  const { status, score, highScore, speed, startGame, resetGame } = useGameStore();

  if (status === 'MENU') {
      return (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
              <div className="text-center p-8 border-4 border-cyan-500 rounded-xl bg-black/80 shadow-[0_0_50px_rgba(0,243,255,0.4)]">
                  <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 font-[Orbitron] mb-2 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
                      NEON HORIZON
                  </h1>
                  <h2 className="text-3xl text-pink-500 font-[Rajdhani] font-bold tracking-widest mb-8 drop-shadow-[0_0_5px_rgba(255,0,85,0.8)]">
                      OVERDRIVE
                  </h2>
                  
                  <div className="flex flex-col gap-4 items-center">
                    <button 
                        onClick={startGame}
                        className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-md transition-all hover:scale-105 active:scale-95"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center gap-2 text-white font-bold text-xl uppercase tracking-wider font-[Orbitron]">
                            <Play className="w-6 h-6 fill-current" />
                            Start Engine
                        </div>
                    </button>
                    
                    <div className="text-cyan-300 font-[Rajdhani] mt-4 flex items-center gap-2">
                         <Trophy className="w-4 h-4" /> High Score: {highScore}
                    </div>
                  </div>
                  
                  <div className="mt-8 text-gray-400 text-sm font-[Rajdhani]">
                      Use <span className="text-white border border-gray-600 px-1 rounded">←</span> <span className="text-white border border-gray-600 px-1 rounded">→</span> or <span className="text-white border border-gray-600 px-1 rounded">A</span> <span className="text-white border border-gray-600 px-1 rounded">D</span> to steer
                  </div>
              </div>
          </div>
      )
  }

  if (status === 'GAME_OVER') {
      return (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-red-900/40 backdrop-blur-sm">
             <div className="text-center">
                  <h1 className="text-7xl font-black text-white font-[Orbitron] mb-4 drop-shadow-[0_0_25px_rgba(255,0,0,0.8)] tracking-tighter">
                      CRASHED
                  </h1>
                  <div className="text-2xl text-cyan-300 font-[Rajdhani] mb-8">
                      Final Score: <span className="text-white font-bold text-4xl ml-2">{score}</span>
                  </div>
                  <button 
                        onClick={resetGame}
                        className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-md transition-all hover:scale-105"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-90"></div>
                        <div className="relative flex items-center gap-2 text-white font-bold text-xl uppercase tracking-wider font-[Orbitron]">
                            <RotateCcw className="w-6 h-6" />
                            Retry
                        </div>
                    </button>
             </div>
          </div>
      )
  }

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-40">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <div className="text-cyan-400 font-[Orbitron] text-sm uppercase tracking-widest opacity-80">Score</div>
                <div className="text-white font-[Orbitron] text-4xl font-bold drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
                    {score.toString().padStart(6, '0')}
                </div>
            </div>
            
             <div className="flex flex-col items-end">
                <div className="text-pink-500 font-[Orbitron] text-sm uppercase tracking-widest opacity-80">Speed</div>
                <div className="text-white font-[Orbitron] text-4xl font-bold drop-shadow-[0_0_10px_rgba(255,0,85,0.8)] flex items-baseline gap-1">
                    {Math.floor(speed * 2)} <span className="text-lg text-gray-400 font-normal">KM/H</span>
                </div>
            </div>
        </div>
        
        {/* Bottom Elements */}
        <div className="w-full flex justify-center pb-8 opacity-50">
           {/* Decorative elements */}
           <div className="h-1 w-64 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>
    </div>
  );
};