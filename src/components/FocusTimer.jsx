import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Settings2 } from 'lucide-react';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      // Auto-switch mode when time is up
      const beep = new Audio('https://www.soundjay.com/button/beep-07.wav');
      beep.play().catch(() => {});
      setIsActive(false);
      setIsWork(!isWork);
      setTimeLeft(!isWork ? WORK_TIME : BREAK_TIME);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWork]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isWork ? WORK_TIME : BREAK_TIME);
  };
  const switchMode = (mode) => {
    setIsActive(false);
    setIsWork(mode === 'work');
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform z-50 flex items-center gap-2 group"
      >
        <Timer className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold">
          <span className="px-2">{minutes}:{seconds}</span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 w-80 z-50 animate-in slide-in-from-bottom-5">
       <div className="flex justify-between items-center mb-6">
         <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary-500" /> Focus Mode
         </h3>
         <button onClick={() => setIsMinimized(true)} className="text-slate-400 hover:text-slate-600 transition-colors">
           <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"></path></svg>
         </button>
       </div>

       <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
         <button onClick={() => switchMode('work')} className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${isWork ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Work</button>
         <button onClick={() => switchMode('break')} className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${!isWork ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Break</button>
       </div>

       <div className="text-center mb-8">
         <div className={`text-6xl font-extrabold font-mono tracking-tighter ${isActive ? 'text-primary-600' : 'text-slate-800 dark:text-white'}`}>
           {minutes}:{seconds}
         </div>
       </div>

       <div className="flex justify-center gap-4">
         <button onClick={resetTimer} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">
            <RotateCcw className="w-6 h-6" />
         </button>
         <button onClick={toggleTimer} className={`p-3 rounded-full text-white transition-colors flex items-center justify-center w-14 h-14 shadow-lg ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary-500 hover:bg-primary-600'}`}>
            {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
         </button>
         <button className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">
            <Settings2 className="w-6 h-6" />
         </button>
       </div>
    </div>
  );
};

export default FocusTimer;
