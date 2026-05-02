import { useState, useEffect, useContext } from 'react';
import { getDaysInMonth, format, startOfMonth } from 'date-fns';
import { Plus, Trash2, StickyNote, X, BookOpen } from 'lucide-react';
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
    <div className="p-8 pb-20 max-w-7xl mx-auto min-h-screen bg-editorial-50">
      
      {/* Note Modal */}
      {noteModal.isOpen && (
        <div className="fixed inset-0 bg-editorial-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative border border-editorial-200">
             <button onClick={() => setNoteModal({...noteModal, isOpen: false})} className="absolute top-6 right-6 text-editorial-400 hover:text-editorial-600"><X /></button>
             <h3 className="text-2xl font-serif text-editorial-900 mb-2 flex items-center gap-3">
                <StickyNote className="w-6 h-6 text-primary-500"/> Daily Journal
             </h3>
             <p className="text-editorial-500 text-sm mb-6 uppercase tracking-widest font-bold">{noteModal.date}</p>
             <textarea 
               autoFocus
               className="w-full h-32 p-4 rounded-xl border border-editorial-200 bg-editorial-50 focus:ring-2 focus:ring-primary-500 outline-none mb-6 resize-none text-editorial-900 placeholder:text-editorial-400"
               placeholder="Why did you skip? Or did you go above and beyond?"
               value={noteModal.note}
               onChange={e => setNoteModal({...noteModal, note: e.target.value})}
             ></textarea>
             <button onClick={saveNote} className="w-full bg-editorial-900 hover:bg-editorial-800 text-white font-bold py-3.5 rounded-full transition-colors shadow-sm">Save Note</button>
          </div>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Tracker Matrix
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-editorial-900 mb-3">{format(currentDate, 'MMMM yyyy')}</h1>
          <p className="text-editorial-500 font-medium text-lg max-w-md">The compounding effect of tiny, daily improvements. Right-click any cell to add context or a journal note.</p>
        </div>
        
        {/* Right side form & illustration */}
        <div className="flex flex-col md:items-end gap-6 relative z-10 w-full lg:w-auto mt-4 lg:mt-0">
          <img src="/new-assests/undraw_mindfulness_d853.svg" alt="Mindfulness" className="h-24 lg:absolute lg:-top-6 lg:-left-40 object-contain hidden lg:block drop-shadow-md" />
          
          <form onSubmit={(e) => { e.preventDefault(); addHabit(newHabitTitle); setNewHabitTitle(''); }} className="flex items-center gap-2 bg-editorial-50 p-1.5 rounded-2xl border border-editorial-200 w-full lg:w-auto">
            <input 
              type="text" 
              placeholder="New habit..." 
              className="px-4 py-3 rounded-xl bg-transparent focus:outline-none flex-1 lg:w-56 text-editorial-900 placeholder:text-editorial-400 font-medium"
              value={newHabitTitle}
              onChange={e => setNewHabitTitle(e.target.value)}
            />
            <button type="submit" className="bg-primary-500 text-editorial-900 p-3 rounded-xl hover:bg-primary-600 transition-colors shadow-sm font-bold">
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Add Row */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {suggestions.map((title, i) => (
           <button 
             key={i} 
             onClick={() => addHabit(title)}
             className="px-5 py-2.5 bg-white border border-editorial-200 rounded-full shrink-0 text-sm font-medium hover:border-primary-400 hover:shadow-sm text-editorial-600 transition-colors flex items-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
           >
             <Plus className="w-4 h-4 text-primary-500" /> {title}
           </button>
        ))}
      </div>

      {/* Tracker Table */}
      <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 overflow-x-auto relative z-20">
        <table className="w-full text-sm text-left text-editorial-600">
          <thead className="text-xs text-editorial-500 bg-editorial-50/50 uppercase border-b border-editorial-200">
            <tr>
              <th scope="col" className="px-6 py-5 w-64 sticky left-0 bg-editorial-50 border-r border-editorial-200 shadow-[1px_0_0_0_#e5e7eb] z-20 font-bold tracking-wider">
                Habits & Rituals
              </th>
              {daysArray.map(day => (
                <th key={day} className="px-2 py-5 text-center font-bold border-r border-editorial-200 min-w-[40px] max-w-[40px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, index) => (
              <tr key={habit._id} className="bg-white border-b border-editorial-100 hover:bg-editorial-50/30 group">
                <th scope="row" className="px-6 py-4 font-medium text-editorial-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-editorial-50/80 border-r border-editorial-200 shadow-[1px_0_0_0_#e5e7eb] flex justify-between items-center z-10">
                  <span className="truncate w-48 text-base">{habit.icon || '📍'} {habit.title}</span>
                  <button onClick={() => deleteHabit(habit._id)} className="text-editorial-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </th>
                {daysArray.map(day => {
                  const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
                  const log = logs.find(l => l.habit === habit._id && l.date === dateStr);
                  const isChecked = log ? log.status : false;
                  const hasNote = log && log.note && log.note.length > 0;
                  
                  return (
                    <td key={day} className="border-r border-editorial-100 p-0 text-center relative hover:bg-editorial-50 transition-colors">
                      <div 
                        className="w-full h-full cursor-pointer flex items-center justify-center p-3 relative group/cell"
                        onClick={() => toggleLog(habit._id, day)}
                        onContextMenu={(e) => openNoteModal(e, habit._id, day)}
                      >
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isChecked ? 'bg-sage-500 border-sage-500 shadow-sm scale-110' : 'bg-editorial-50 border-editorial-200 group-hover/cell:border-editorial-300'}`}>
                          {isChecked && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        {hasNote && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full shadow-sm ring-2 ring-white" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Empty Rows Padding */}
            {Array.from({ length: Math.max(0, 8 - habits.length) }).map((_, i) => (
               <tr 
                 key={`empty-${i}`} 
                 className="bg-white border-b border-editorial-100 cursor-pointer hover:bg-editorial-50 transition-colors group"
                 onClick={() => {
                   const title = window.prompt(`Add a habit to Row ${habits.length + i + 1}`);
                   if (title) addHabit(title);
                 }}
               >
                 <th scope="row" className="px-6 py-4 font-medium text-editorial-300 whitespace-nowrap sticky left-0 bg-white border-r border-editorial-200 shadow-[1px_0_0_0_#e5e7eb] group-hover:bg-editorial-50 z-10 flex items-center">
                   <span className="w-6 text-center">{habits.length + i + 1}.</span> 
                   <span className="opacity-0 group-hover:opacity-100 text-primary-500 font-bold ml-2 transition-opacity flex items-center gap-1"><Plus className="w-4 h-4"/> Add Ritual</span>
                 </th>
                 {daysArray.map(day => (
                   <td key={day} className="border-r border-editorial-100 p-0 text-center relative bg-editorial-50/10"></td>
                 ))}
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Row at bottom */}
      <div className="mt-8 bg-editorial-900 rounded-2xl shadow-xl overflow-hidden border border-editorial-800 relative z-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="overflow-x-auto min-w-max relative z-10">
          <table className="w-full text-sm text-center text-white/90">
             <tbody>
              <tr>
                   <th scope="row" className="px-6 py-4 font-serif text-lg whitespace-nowrap sticky left-0 bg-editorial-900 border-r border-editorial-800 shadow-[1px_0_0_0_#3f3f46] w-64 text-right pr-6">
                     Daily Completion
                   </th>
                   {daysArray.map(day => (
                     <td key={day} className="font-bold border-r border-editorial-800 min-w-[40px] max-w-[40px] py-4">
                       <span className="text-editorial-400 text-xs block mb-1">{day}</span>
                       <span className={`text-lg ${getDayScore(day) === habits.length && habits.length > 0 ? 'text-primary-400' : 'text-white'}`}>
                         {getDayScore(day)}
                       </span>
                     </td>
                   ))}
              </tr>
             </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Tracker;
