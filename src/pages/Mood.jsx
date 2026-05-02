import { useState, useEffect } from 'react';
import { SmilePlus, CheckCircle2, Heart } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';

const MOODS = [
  { emoji: '🤩', label: 'Great', value: 5, color: 'bg-sage-100 hover:bg-sage-200 border-sage-300 text-sage-800' },
  { emoji: '🙂', label: 'Good', value: 4, color: 'bg-primary-100 hover:bg-primary-200 border-primary-300 text-primary-800' },
  { emoji: '😐', label: 'Okay', value: 3, color: 'bg-editorial-100 hover:bg-editorial-200 border-editorial-300 text-editorial-800' },
  { emoji: '😞', label: 'Bad', value: 2, color: 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800' },
  { emoji: '😫', label: 'Terrible', value: 1, color: 'bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-800' }
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
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-editorial-50 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" /> Daily Check-in
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-editorial-900 mb-3">Daily Reflection</h1>
          <p className="text-editorial-500 font-medium text-lg max-w-md">Check in with yourself. Acknowledging how you feel is the first step to mastering your habits.</p>
        </div>
        
        <div className="flex items-end relative z-10 w-full lg:w-auto mt-4 lg:mt-0">
          <img src="/new-assests/Skate buddies-rafiki.svg" alt="Friends" className="h-32 lg:absolute lg:-top-10 lg:-left-40 object-contain hidden lg:block drop-shadow-md" />
        </div>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 mb-12 relative overflow-hidden">
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-editorial-50 rounded-tr-full opacity-50 z-0 pointer-events-none"></div>

        <div className="mb-12 relative z-10">
          <h3 className="text-2xl font-serif text-editorial-900 mb-8 text-center">1. Select your Mood</h3>
          <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
            {MOODS.map(m => (
              <button 
                key={m.label}
                onClick={() => setSelectedMood(m.emoji)}
                className={`flex flex-col items-center gap-3 p-6 w-32 rounded-3xl border-2 transition-all duration-300 ${selectedMood === m.emoji ? m.color + ' scale-110 shadow-lg' : 'bg-transparent border-editorial-100 hover:bg-editorial-50 hover:border-editorial-200 opacity-60 hover:opacity-100'}`}
              >
                <span className="text-6xl drop-shadow-sm">{m.emoji}</span>
                <span className="font-bold text-sm tracking-widest uppercase">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12 max-w-2xl mx-auto relative z-10 bg-editorial-50 p-8 rounded-3xl border border-editorial-200">
          <h3 className="text-2xl font-serif text-editorial-900 mb-8 text-center">2. Energy Level <span className="text-primary-600">({energy}%)</span></h3>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={energy} 
            onChange={(e) => setEnergy(e.target.value)} 
            className="w-full h-3 bg-editorial-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <div className="flex justify-between text-editorial-400 text-sm mt-4 font-bold uppercase tracking-widest">
            <span>Exhausted</span>
            <span>Energetic</span>
          </div>
        </div>

        <div className="text-center relative z-10">
          <button 
            onClick={saveMood}
            disabled={!selectedMood}
            className={`flex justify-center items-center gap-3 px-12 py-5 rounded-full font-bold text-lg text-editorial-900 mx-auto transition-all shadow-sm ${savedToday ? 'bg-sage-300 hover:bg-sage-400' : 'bg-primary-500 hover:bg-primary-600'} disabled:opacity-50`}
          >
            {savedToday ? <><CheckCircle2 className="w-6 h-6" /> Logged for Today</> : 'Save Reflection'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-serif text-editorial-900 mb-6 pl-2 border-l-4 border-primary-500">Recent History</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {moods.map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-editorial-200 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-5">
                <span className="text-5xl drop-shadow-sm">{m.emoji}</span>
                <div>
                  <h4 className="font-serif font-bold text-xl text-editorial-900 mb-1">{format(new Date(m.date), 'MMMM do')}</h4>
                  <p className="text-sm font-medium text-editorial-500 uppercase tracking-widest">Energy: <span className="text-primary-600 font-bold">{m.energy}%</span></p>
                </div>
              </div>
            </div>
          ))}
          {moods.length === 0 && (
             <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-editorial-200 border-dashed">
               <p className="text-editorial-400 italic">No moods logged yet. Check in above!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mood;
