import { useState, useEffect } from 'react';
import { Target, Check, Trash2, ArrowRight } from 'lucide-react';
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Life Goals</h1>
          <p className="text-slate-500 font-medium text-lg">Define exactly what you want and why you want it.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all">
          {showForm ? 'Cancel' : 'Set New Goal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 mb-10 animate-in slide-in-from-top-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white"><Target className="text-primary-500" /> Define Your Goal</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">What is your goal?</label>
              <input type="text" required className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="e.g., Read 20 books this year" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Why do you want this? (Motivation)</label>
              <textarea required className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 min-h-[80px]" placeholder="To learn new perspectives..." value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Life Impact</label>
              <select className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500" value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})}>
                <option value="productivity">Productivity & Career</option>
                <option value="health">Physical Health</option>
                <option value="mental">Mental & Emotional Resilience</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-bold w-full py-3 rounded-xl flex justify-center items-center gap-2 transition-colors">
            Save Goal <ArrowRight className="w-5 h-5"/>
          </button>
        </form>
      )}

      <div className="space-y-8">
        {goals.length === 0 && !showForm && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-500">You haven't set any goals yet!</h3>
          </div>
        )}
        
        {goals.map(goal => (
          <div key={goal._id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row relative group">
            <button onClick={() => deleteGoal(goal._id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5" /></button>
            <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700">
              <span className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900 text-primary-600 font-bold text-xs rounded-full uppercase tracking-wider mb-4">{goal.impact}</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{goal.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 italic border-l-4 border-slate-200 dark:border-slate-600 pl-4 my-6">
                "{goal.motivation}"
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Check className="w-4 h-4 text-primary-500" /> Active Goal
              </div>
            </div>
            
            <div className="p-8 md:w-1/2 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Personalized Solutions</h3>
              <div className="space-y-4">
                {getSolutions(goal.impact).map((sol, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-primary-500 font-bold text-sm">{i+1}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{sol.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{sol.desc}</p>
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
