import { useState, useEffect } from 'react';
import { SmilePlus, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';

const MOODS = [
  { emoji: '🤩', label: 'Great', value: 5, color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { emoji: '🙂', label: 'Good', value: 4, color: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300' },
  { emoji: '😐', label: 'Okay', value: 3, color: 'bg-slate-100 hover:bg-slate-200 border-slate-300' },
  { emoji: '😞', label: 'Bad', value: 2, color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { emoji: '😫', label: 'Terrible', value: 1, color: 'bg-red-100 hover:bg-red-200 border-red-300' }
];

const Mood = () => {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [energy, setEnergy] = useState(50);
  const [savedToday, setSavedToday] = useState(false);
  const todayDate = format(new Date(), 'yyyy-MM-dd');

  const fetchMoods = async () => {
    try {
      const res = await api.get('/moods');
      setMoods(res.data);
      if (res.data.length > 0 && res.data[0].date === todayDate) {
        setSavedToday(true);
        setSelectedMood(res.data[0].emoji);
        setEnergy(res.data[0].energy);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const saveMood = async () => {
    if (!selectedMood) return;
    try {
      await api.post('/moods', { emoji: selectedMood, energy, date: todayDate });
      setSavedToday(true);
      fetchMoods();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Daily Reflection</h1>
        <p className="text-slate-500 font-medium text-lg">Check in with yourself. How are you feeling today?</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 mb-12">
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-6 text-center text-slate-700 dark:text-white">1. Select your Mood</h3>
          <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
            {MOODS.map(m => (
              <button 
                key={m.label}
                onClick={() => setSelectedMood(m.emoji)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedMood === m.emoji ? m.color + ' scale-110 shadow-md' : 'bg-transparent border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 opacity-60 hover:opacity-100'}`}
              >
                <span className="text-5xl">{m.emoji}</span>
                <span className="font-bold text-slate-600 dark:text-slate-300">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 max-w-lg mx-auto">
          <h3 className="text-xl font-bold mb-6 text-center text-slate-700 dark:text-white">2. Energy Level ({energy}%)</h3>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={energy} 
            onChange={(e) => setEnergy(e.target.value)} 
            className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <div className="flex justify-between text-slate-400 text-sm mt-3 font-semibold uppercase tracking-wider">
            <span>Exhausted</span>
            <span>Energetic</span>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={saveMood}
            disabled={!selectedMood}
            className={`flex justify-center items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg text-white mx-auto transition-all shadow-xl ${savedToday ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-900 hover:bg-slate-800'} disabled:opacity-50`}
          >
            {savedToday ? <><CheckCircle2 /> Logged for Today</> : 'Save Reflection'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2"><SmilePlus className="text-primary-500" /> Recent History</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moods.map((m, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{m.emoji}</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{format(new Date(m.date), 'MMMM do')}</h4>
                  <p className="text-sm font-medium text-slate-500">Energy: {m.energy}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mood;
