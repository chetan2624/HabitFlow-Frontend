import { useState, useEffect } from 'react';
import { Target, Check, Trash2, ArrowRight, Lightbulb } from 'lucide-react';
import api from '../api/axios';

const SOLUTIONS = {
  health: [
    { title: 'Micro-workouts', desc: 'Do 5 squats every time you use the restroom.' },
    { title: 'Hydration Anchor', desc: 'Drink a glass of water immediately upon waking up.' }
  ],
  productivity: [
    { title: 'Pomodoro', desc: 'Work in 25-minute focused bursts with a 5-minute break.' },
    { title: '2-Minute Rule', desc: 'If a task takes less than 2 minutes, do it immediately.' }
  ],
  mental: [
    { title: 'Mindful Breathing', desc: 'Take 5 deep breaths before looking at your phone in the morning.' },
    { title: 'Digital Detox', desc: 'No screens 1 hour before bed.' }
  ],
  default: [
    { title: 'Start Small', desc: 'Focus on 1% improvements daily rather than massive leaps.' },
    { title: 'Habit Stacking', desc: 'Attach your new habit to an existing one (e.g., after brushing teeth).' }
  ]
};

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', motivation: '', impact: 'productivity' });

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    try {
      await api.post('/goals', formData);
      setShowForm(false);
      setFormData({ title: '', motivation: '', impact: 'productivity' });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const getSolutions = (impact) => SOLUTIONS[impact] || SOLUTIONS.default;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-editorial-50">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" /> North Stars
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-editorial-900 mb-3">Life Goals</h1>
          <p className="text-editorial-500 font-medium text-lg max-w-md">Define exactly what you want and why you want it. Your habits are the bridge.</p>
        </div>
        
        <div className="flex flex-col md:items-end gap-6 relative z-10 w-full md:w-auto mt-4 md:mt-0">
          <img src="/new-assests/undraw_morning-plans_5vln.svg" alt="Goals" className="h-28 md:absolute md:-top-8 md:-left-48 object-contain hidden lg:block drop-shadow-md" />
          <button onClick={() => setShowForm(!showForm)} className="bg-editorial-900 hover:bg-editorial-800 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-sm w-full md:w-auto">
            {showForm ? 'Cancel' : 'Set New Goal'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl border border-editorial-200 mb-12 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 opacity-5 pointer-events-none">
            <Target className="w-64 h-64" />
          </div>
          <h2 className="text-3xl font-serif text-editorial-900 mb-8 flex items-center gap-3 relative z-10">
             Define Your Vision
          </h2>
          <div className="space-y-6 mb-8 relative z-10">
            <div>
              <label className="block text-sm font-bold text-editorial-700 mb-2 uppercase tracking-widest">What is your goal?</label>
              <input type="text" required className="w-full p-4 rounded-xl border border-editorial-200 bg-editorial-50 focus:ring-2 focus:ring-primary-500 outline-none text-editorial-900 text-lg transition-all" placeholder="e.g., Read 20 books this year" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-editorial-700 mb-2 uppercase tracking-widest">Why do you want this? (Motivation)</label>
              <textarea required className="w-full p-4 rounded-xl border border-editorial-200 bg-editorial-50 focus:ring-2 focus:ring-primary-500 outline-none min-h-[120px] resize-none text-editorial-900 transition-all" placeholder="To learn new perspectives..." value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-editorial-700 mb-2 uppercase tracking-widest">Primary Life Impact</label>
              <div className="relative">
                <select className="w-full p-4 rounded-xl border border-editorial-200 bg-editorial-50 focus:ring-2 focus:ring-primary-500 outline-none appearance-none text-editorial-900 font-medium transition-all" value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})}>
                  <option value="productivity">Productivity & Career</option>
                  <option value="health">Physical Health</option>
                  <option value="mental">Mental & Emotional Resilience</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-editorial-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-editorial-900 font-bold w-full md:w-auto px-10 py-4 rounded-full flex justify-center items-center gap-2 transition-all shadow-sm relative z-10 text-lg">
            Commit to Goal <ArrowRight className="w-5 h-5"/>
          </button>
        </form>
      )}

      <div className="space-y-8">
        {goals.length === 0 && !showForm && (
          <div className="text-center py-24 bg-white rounded-3xl border border-editorial-200 shadow-sm flex flex-col items-center justify-center">
            <img src="/new-assests/undraw_bike-ride_ba0o.svg" alt="Empty Goals" className="h-48 mb-8 opacity-80" />
            <h3 className="text-2xl font-serif text-editorial-900 mb-2">You haven't set any goals yet!</h3>
            <p className="text-editorial-500 max-w-md">Goals give your habits direction. Take a moment to think about what you truly want to achieve.</p>
          </div>
        )}
        
        {goals.map(goal => (
          <div key={goal._id} className="bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 overflow-hidden flex flex-col md:flex-row relative group transition-all hover:shadow-md">
            <button onClick={() => deleteGoal(goal._id)} className="absolute top-6 right-6 text-editorial-300 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white rounded-full p-1"><Trash2 className="w-5 h-5" /></button>
            
            <div className="p-10 md:w-1/2 border-b md:border-b-0 md:border-r border-editorial-100 relative overflow-hidden flex flex-col justify-center">
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-800 font-bold text-xs rounded-full uppercase tracking-widest mb-6 w-max border border-primary-200">
                {goal.impact}
              </span>
              <h2 className="text-3xl font-serif text-editorial-900 mb-4">{goal.title}</h2>
              <div className="bg-editorial-50 p-5 rounded-2xl border-l-4 border-primary-400 my-4 relative">
                 <p className="text-editorial-600 italic leading-relaxed text-lg relative z-10">"{goal.motivation}"</p>
                 <Target className="absolute right-4 bottom-4 w-12 h-12 text-editorial-200 opacity-50 z-0" />
              </div>
              <div className="flex items-center gap-2 text-sm text-sage-600 font-bold uppercase tracking-widest mt-4">
                <Check className="w-5 h-5 bg-sage-100 rounded-full p-0.5" /> Active North Star
              </div>
            </div>
            
            <div className="p-10 md:w-1/2 bg-editorial-50/50 flex flex-col justify-center relative">
              <h3 className="text-xs font-bold text-editorial-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Recommended Protocols
              </h3>
              <div className="space-y-6">
                {getSolutions(goal.impact).map((sol, i) => (
                  <div key={i} className="flex gap-4 group/sol">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-editorial-200 text-primary-500 font-bold text-lg group-hover/sol:bg-primary-500 group-hover/sol:text-white transition-colors">
                      {i+1}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-editorial-900 text-lg mb-1">{sol.title}</h4>
                      <p className="text-sm text-editorial-600 leading-relaxed">{sol.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Goals;
