import { useState, useEffect, useContext } from 'react';
import { getDaysInMonth, format, startOfMonth } from 'date-fns';
import { Plus, Trash2, StickyNote, X } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const SUGGESTIONS = {
  'Student': ['Study 2 hours', 'Read 10 pages', 'Review Flashcards', 'Sleep 8 hours'],
  'Working Professional': ['Inbox Zero', 'Code for 1 hour', 'Stretch at desk', 'Drink Water'],
  'Fitness Enthusiast': ['Workout 45 mins', 'Track Macros', 'Stretch/Yoga', 'Drink 3L Water'],
  'Business Owner': ['Plan tomorrow', 'Review Finances', 'Read industry news', 'Meditate 10 mins'],
  'Influencer': ['Post Content', 'Engage comments', 'Plan ideas', 'Digital Detox'],
  'Other': ['Drink Water', 'Read 10 pages', 'Exercise 30 mins', 'Meditate 10 mins']
};

const Tracker = () => {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [noteModal, setNoteModal] = useState({ isOpen: false, habitId: null, date: null, note: '', status: false });
  
  const currentDate = new Date();
  const daysInMonth = getDaysInMonth(currentDate);
  const yearMonth = format(currentDate, 'yyyy-MM');
  
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const suggestions = user ? SUGGESTIONS[user.userType || 'Other'] : [];

  const fetchData = async () => {
    try {
      const [habitsRes, logsRes] = await Promise.all([
        api.get('/habits'),
        api.get(`/logs?month=${format(currentDate, 'MM')}&year=${format(currentDate, 'yyyy')}`)
      ]);
      setHabits(habitsRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error('Failed to fetch tracking data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addHabit = async (title) => {
    if (!title.trim()) return;
    try {
      await api.post('/habits', { title });
      fetchData();
    } catch (error) {
      console.error('Failed to add habit');
    }
  };

  const deleteHabit = async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete habit');
    }
  };

  const toggleLog = async (habitId, day, newStatusCallback = null) => {
    const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
    const logStr = logs.find(l => l.habit === habitId && l.date === dateStr);
    const currentStatus = logStr ? logStr.status : false;
    const newStatus = newStatusCallback !== null ? newStatusCallback : !currentStatus;

    setLogs(prev => {
      const existing = prev.find(l => l.habit === habitId && l.date === dateStr);
      if (existing) {
        return prev.map(l => l._id === existing._id ? { ...l, status: newStatus } : l);
      }
      return [...prev, { habit: habitId, date: dateStr, status: newStatus, note: '' }];
    });

    try {
      await api.post('/logs', { habitId, date: dateStr, status: newStatus });
      fetchData(); 
    } catch (error) {
      fetchData(); 
    }
  };

  const openNoteModal = (e, habitId, day) => {
    e.preventDefault(); // On right click
    const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
    const logStr = logs.find(l => l.habit === habitId && l.date === dateStr);
    setNoteModal({ 
      isOpen: true, 
      habitId, 
      date: dateStr, 
      note: logStr?.note || '',
      status: logStr?.status || false
    });
  };

  const saveNote = async () => {
    try {
      await api.post('/logs', { 
        habitId: noteModal.habitId, 
        date: noteModal.date, 
        status: noteModal.status,
        note: noteModal.note 
      });
      setNoteModal({ isOpen: false, habitId: null, date: null, note: '', status: false });
      fetchData();
    } catch (error) {
      console.error('Failed to save note');
    }
  };

  const getDayScore = (day) => {
    const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
    return logs.filter(l => l.date === dateStr && l.status).length;
  };

  return (
    <div className="p-8 pb-20 max-w-[100vw] overflow-x-auto">
      {noteModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
             <button onClick={() => setNoteModal({...noteModal, isOpen: false})} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><StickyNote className="w-5 h-5 text-primary-500"/> Daily Journal / Note</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Date: {noteModal.date}</p>
             <textarea 
               autoFocus
               className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none mb-4 resize-none"
               placeholder="Why did you skip? Or did you go above and beyond?"
               value={noteModal.note}
               onChange={e => setNoteModal({...noteModal, note: e.target.value})}
             ></textarea>
             <button onClick={saveNote} className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-colors">Save Note</button>
          </div>
        </div>
      )}

      {/* Quick Add Row */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {suggestions.map((title, i) => (
           <button 
             key={i} 
             onClick={() => addHabit(title)}
             className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shrink-0 text-sm font-semibold hover:border-primary-400 hover:shadow-sm text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1"
           >
             <Plus className="w-4 h-4 text-primary-500" /> {title}
           </button>
        ))}
      </div>

      <div className="flex justify-between items-end mb-8 min-w-[800px]">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Monthly Habit Tracker</h1>
          <p className="text-slate-500 font-medium text-lg">{format(currentDate, 'MMMM yyyy')} • Right-click a cell to add notes</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); addHabit(newHabitTitle); setNewHabitTitle(''); }} className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="New custom habit..." 
            className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 dark:bg-slate-800 dark:border-slate-700"
            value={newHabitTitle}
            onChange={e => setNewHabitTitle(e.target.value)}
          />
          <button type="submit" className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto min-w-max">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
          <thead className="text-xs text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 uppercase border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th scope="col" className="px-4 py-4 w-64 sticky left-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_#334155]">
                HABITS / PROTOCOLS
              </th>
              {daysArray.map(day => (
                <th key={day} className="px-2 py-4 text-center font-bold border-r border-slate-200 dark:border-slate-700 min-w-[40px] max-w-[40px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, index) => (
              <tr key={habit._id} className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700 group">
                <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap sticky left-0 bg-white dark:bg-slate-800 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_#334155] flex justify-between items-center group-hover:pr-2">
                  <span className="truncate w-48">{index + 1}. {habit.title}</span>
                  <button onClick={() => deleteHabit(habit._id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </th>
                {daysArray.map(day => {
                  const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
                  const log = logs.find(l => l.habit === habit._id && l.date === dateStr);
                  const isChecked = log ? log.status : false;
                  const hasNote = log && log.note && log.note.length > 0;
                  
                  return (
                    <td key={day} className="border-r border-slate-200 dark:border-slate-700 p-0 text-center relative hover:bg-slate-100 dark:hover:bg-slate-700">
                      <div 
                        className="w-full h-full cursor-pointer flex items-center justify-center p-2 relative"
                        onClick={() => toggleLog(habit._id, day)}
                        onContextMenu={(e) => openNoteModal(e, habit._id, day)}
                      >
                        <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${isChecked ? 'bg-primary-500 border-primary-500 shadow-inner' : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600'}`}>
                          {isChecked && <div className="w-2.5 h-2.5 bg-white rounded-[1px]" />}
                        </div>
                        {hasNote && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 10 - habits.length) }).map((_, i) => (
               <tr 
                 key={`empty-${i}`} 
                 className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 group transition-colors"
                 onClick={() => {
                   const title = window.prompt(`Add a habit to Row ${habits.length + i + 1}`);
                   if (title) addHabit(title);
                 }}
               >
                 <th scope="row" className="px-4 py-3 font-medium text-slate-400 whitespace-nowrap sticky left-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_#334155] group-hover:bg-slate-50 dark:group-hover:bg-slate-700">
                   {habits.length + i + 1}. <span className="opacity-0 group-hover:opacity-100 text-primary-500 font-bold ml-2 transition-opacity">+ Add</span>
                 </th>
                 {daysArray.map(day => (
                   <td key={day} className="border-r border-slate-200 dark:border-slate-700 p-0 text-center relative bg-slate-50/20 dark:bg-slate-900/20"></td>
                 ))}
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto min-w-max">
        <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
           <tbody>
            <tr className="bg-slate-900 border-b border-slate-800 text-white">
                 <th scope="row" className="px-4 py-2 font-bold whitespace-nowrap sticky left-0 bg-slate-900 border-r border-slate-800 shadow-[1px_0_0_0_#1e293b] w-64 text-right pr-4">
                   Done! Daily Score
                 </th>
                 {daysArray.map(day => (
                   <td key={day} className="font-bold border-r border-slate-800 min-w-[40px] max-w-[40px]">
                     {day}
                   </td>
                 ))}
               </tr>
             <tr className="bg-primary-50 dark:bg-slate-800">
               <th scope="row" className="px-4 py-3 font-bold text-slate-900 dark:text-primary-400 whitespace-nowrap sticky left-0 bg-primary-50 dark:bg-slate-800 border-r border-primary-200 dark:border-slate-700 shadow-[1px_0_0_0_#bfdbfe] dark:shadow-[1px_0_0_0_#334155] w-64 text-right pr-4">
                  Score
               </th>
               {daysArray.map(day => (
                 <td key={day} className={`font-bold border-r dark:border-slate-700 ${getDayScore(day) > 0 ? 'text-primary-700 dark:text-primary-500 bg-primary-100 dark:bg-primary-900/20' : 'text-slate-400'}`}>
                   {getDayScore(day) > 0 ? getDayScore(day) : '-'}
                 </td>
               ))}
             </tr>
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tracker;
