import { useState, useEffect, useContext } from 'react';
import { getDaysInMonth, format } from 'date-fns';
import { Plus, Trash2, StickyNote, X, BookOpen, Check } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import NewRitualModal from '../components/NewRitualModal';

const SUGGESTIONS = {
  'Student': ['Study 2 hours', 'Read 10 pages', 'Review Flashcards', 'Sleep 8 hours'],
  'Working Professional': ['Inbox Zero', 'Code for 1 hour', 'Stretch at desk', 'Drink Water'],
  'Fitness Enthusiast': ['Workout 45 mins', 'Track Macros', 'Stretch/Yoga', 'Drink 3L Water'],
  'Business Owner': ['Plan tomorrow', 'Review Finances', 'Read industry news', 'Meditate 10 mins'],
  'Influencer': ['Post Content', 'Engage comments', 'Plan ideas', 'Digital Detox'],
  'Other': ['Drink Water', 'Read 10 pages', 'Exercise 30 mins', 'Meditate 10 mins']
};

const getHabitIconAndTitle = (fullTitle) => {
  const emojiRegex = /^([\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Emoji})\s*(.*)$/u;
  const match = String(fullTitle).match(emojiRegex);
  if (match) {
    return { icon: match[1], title: match[2] };
  }
  return { icon: null, title: fullTitle };
};

const Tracker = () => {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [noteModal, setNoteModal] = useState({ isOpen: false, habitId: null, date: null, note: '', status: false });
  
  // Mobile responsiveness additions
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [showFullMonth, setShowFullMonth] = useState(false);
  const [isNewRitualOpen, setIsNewRitualOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setViewMode('grid');
    }
  }, []);
  
  const currentDate = new Date();
  const daysInMonth = getDaysInMonth(currentDate);
  const yearMonth = format(currentDate, 'yyyy-MM');
  
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const suggestions = user ? SUGGESTIONS[user.userType || 'Other'] : [];

  // Mobile sliced days array (Only 7 days around today, or last 7 days of month)
  const today = currentDate.getDate();
  const slicedDaysArray = daysArray.filter(day => day > Math.max(0, today - 7) && day <= today);

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

  const toggleLogByDate = async (habitId, dateStr, newStatusCallback = null) => {
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

  const openNoteModalByDate = (e, habitId, dateStr) => {
    e.preventDefault();
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

  const getHabitPercentage = (habitId) => {
    const habitLogs = logs.filter(l => l.habit === habitId);
    const completed = habitLogs.filter(l => l.status).length;
    const totalDays = daysInMonth || 30;
    return Math.round((completed / totalDays) * 100);
  };

  const getHeatmapGrid = () => {
    const cells = [];
    const todayDate = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(todayDate.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLogs = logs.filter(l => l.date === dateStr && l.status);
      cells.push({
        dateStr,
        count: dayLogs.length
      });
    }
    return cells;
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const percentage = habits.length > 0 ? Math.round((logs.filter(l => l.date === selectedDateStr && l.status).length / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-editorial-50 pb-20 p-4 md:p-8 md:pb-8 max-w-7xl mx-auto">
      
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 bg-white p-6 md:p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Tracker Matrix
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-editorial-900 mb-3">{format(currentDate, 'MMMM yyyy')}</h1>
          <p className="text-editorial-500 font-medium text-lg max-w-md">The compounding effect of tiny, daily improvements. Right-click any cell to add context or a journal note.</p>
        </div>
        
        {/* Right side illustration */}
        <div className="flex flex-col md:items-end gap-6 relative z-10 w-full lg:w-auto mt-4 lg:mt-0">
          <img src="/new-assests/undraw_mindfulness_d853.svg" alt="Mindfulness" className="h-24 lg:absolute lg:-top-6 lg:-left-40 object-contain hidden lg:block drop-shadow-md" />
        </div>
      </div>

      {/* View Switcher (Only visible on mobile) */}
      <div className="flex bg-editorial-200/60 p-1 rounded-full w-full max-w-md mx-auto mb-6 md:hidden">
        <button 
          onClick={() => setViewMode('daily')}
          className={`flex-1 py-2.5 text-center text-sm font-bold rounded-full transition-all duration-200 ${viewMode === 'daily' ? 'bg-editorial-900 text-white shadow' : 'text-editorial-600'}`}
        >
          Daily Log
        </button>
        <button 
          onClick={() => setViewMode('grid')}
          className={`flex-1 py-2.5 text-center text-sm font-bold rounded-full transition-all duration-200 ${viewMode === 'grid' ? 'bg-editorial-900 text-white shadow' : 'text-editorial-600'}`}
        >
          Monthly Grid
        </button>
      </div>

      {/* ========================================================
          DAILY LOG VIEW (default on mobile, hidden on desktop)
         ======================================================== */}
      {viewMode === 'daily' && (
        <div className="md:hidden px-2 flex flex-col gap-6">
          {/* Add Ritual Button for Mobile (Mockup 5 trigger) */}
          <button 
            onClick={() => setIsNewRitualOpen(true)}
            className="w-full bg-primary-500 hover:bg-primary-600 text-editorial-900 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add a new ritual
          </button>

          {/* Week Date Carousel */}
          <div className="flex justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
            {getLast7Days().map((dayDate) => {
              const dateStr = dayDate.toISOString().split('T')[0];
              const isSelected = selectedDateStr === dateStr;
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`flex flex-col items-center justify-center p-3 w-14 rounded-2xl border transition-all duration-200 shrink-0 ${
                    isSelected 
                      ? 'bg-editorial-900 border-editorial-900 text-white shadow-md scale-105' 
                      : 'bg-white border-editorial-200 text-editorial-600 hover:border-editorial-300'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
                    {dayDate.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-bold">{dayDate.getDate()}</span>
                </button>
              );
            })}
          </div>

          {/* Daily Progress Info */}
          <div className="text-sm font-medium text-editorial-500 uppercase tracking-widest flex justify-between items-center bg-white px-5 py-3 rounded-xl border border-editorial-200">
            <span>Progress: {percentage}%</span>
            <span>{logs.filter(l => l.date === selectedDateStr && l.status).length} / {habits.length} Done</span>
          </div>

          {/* Daily Habits List */}
          <div className="flex flex-col gap-3">
            {habits.length > 0 ? habits.map((habit) => {
              const log = logs.find(l => l.habit === habit._id && l.date === selectedDateStr);
              const isDone = log ? log.status : false;
              const hasNote = log && log.note && log.note.length > 0;
              const { icon, title } = getHabitIconAndTitle(habit.title);
              const displayIcon = icon || habit.icon || '📌';
              
              return (
                <div 
                  key={habit._id}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 active:scale-95 ${
                    isDone 
                      ? 'bg-editorial-100 border-editorial-200 shadow-none' 
                      : 'bg-white border-editorial-100 shadow-[0_8px_32px_rgba(64,48,29,0.06)]'
                  }`}
                >
                  <div 
                    className="flex items-center gap-4 flex-grow cursor-pointer"
                    onClick={() => toggleLogByDate(habit._id, selectedDateStr)}
                  >
                    <div className="w-12 h-12 rounded-full bg-editorial-50 flex items-center justify-center text-xl shrink-0">
                      {displayIcon}
                    </div>
                    <div>
                      <h4 className={`text-base font-medium transition-colors duration-300 ${isDone ? 'text-editorial-400 line-through' : 'text-editorial-950 font-semibold'}`}>
                        {title}
                      </h4>
                      <p className="text-xs text-editorial-400 mt-0.5">Daily</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={(e) => openNoteModalByDate(e, habit._id, selectedDateStr)}
                      className={`p-2 rounded-xl transition-all ${hasNote ? 'text-primary-500 bg-primary-50' : 'text-editorial-300 hover:text-editorial-500 bg-editorial-50'}`}
                    >
                      <StickyNote className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => toggleLogByDate(habit._id, selectedDateStr)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isDone 
                          ? 'bg-sage-500 border-sage-500 text-white' 
                          : 'border-editorial-200 text-transparent hover:border-editorial-400'
                      }`}
                    >
                      {isDone && <Check className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                </div>
              );
            }) : (
              <p className="text-editorial-400 italic text-sm text-center py-12 bg-white rounded-2xl border border-dashed border-editorial-200">
                No habits added yet. Add a new ritual to get started!
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MONTHLY GRID VIEW (desktop by default, mobile toggleable)
         ======================================================== */}
      {(viewMode === 'grid' || window.innerWidth >= 768) && (
        <div className={`${viewMode === 'grid' ? 'block' : 'hidden md:block'}`}>
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
                  {/* Handle responsive columns based on showFullMonth on mobile */}
                  {(window.innerWidth < 768 && !showFullMonth ? slicedDaysArray : daysArray).map(day => (
                    <th key={day} className="px-2 py-5 text-center font-bold border-r border-editorial-200 min-w-[40px] max-w-[40px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map((habit, index) => {
                  const { icon, title } = getHabitIconAndTitle(habit.title);
                  const displayIcon = icon || habit.icon || '📌';
                  return (
                    <tr key={habit._id} className="bg-white border-b border-editorial-100 hover:bg-editorial-50/30 group">
                      <th scope="row" className="px-6 py-4 font-medium text-editorial-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-editorial-50/80 border-r border-editorial-200 shadow-[1px_0_0_0_#e5e7eb] flex justify-between items-center z-10">
                        <span className="truncate w-48 text-base">{displayIcon} {title}</span>
                        <button onClick={() => deleteHabit(habit._id)} className="text-editorial-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </th>
                      {(window.innerWidth < 768 && !showFullMonth ? slicedDaysArray : daysArray).map(day => {
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
                  );
                })}
                
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
                     {(window.innerWidth < 768 && !showFullMonth ? slicedDaysArray : daysArray).map(day => (
                       <td key={day} className="border-r border-editorial-100 p-0 text-center relative bg-editorial-50/10"></td>
                     ))}
                   </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* More / Less Button below table (Only on Mobile) */}
          <div className="md:hidden flex justify-center mt-6">
            <button 
              onClick={() => setShowFullMonth(!showFullMonth)}
              className="bg-editorial-900 text-white font-bold py-2.5 px-6 rounded-full text-sm shadow hover:bg-editorial-800 transition-all"
            >
              {showFullMonth ? 'Show Less (Weekly)' : 'Show More (Monthly)'}
            </button>
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
                       {(window.innerWidth < 768 && !showFullMonth ? slicedDaysArray : daysArray).map(day => (
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
      )}

      {/* ========================================================
          YOUR PATTERNS SECTION (Only visible on mobile)
         ======================================================== */}
      <div className="md:hidden mt-12 mb-8 text-center">
        <h2 className="text-3xl font-serif text-earth-dark mb-2">Your Patterns</h2>
        <p className="text-sm text-editorial-500 max-w-sm mx-auto">Observe the gentle rhythm of your daily rituals. Consistency over intensity.</p>
      </div>

      <div className="md:hidden bg-white rounded-3xl p-6 border border-editorial-200 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif text-earth-dark">Mindful Momentum</h3>
          <span className="text-[10px] font-bold text-editorial-400 uppercase tracking-widest">Last 30 Days</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
            <div key={idx} className="text-center text-[10px] font-bold text-editorial-400 uppercase">{day}</div>
          ))}
          {getHeatmapGrid().map((cell, idx) => {
            let opacityClass = 'bg-[#f1edea]';
            if (cell.count === 1) opacityClass = 'bg-[#8A9A5B]/30';
            else if (cell.count === 2) opacityClass = 'bg-[#8A9A5B]/65';
            else if (cell.count >= 3) opacityClass = 'bg-[#8A9A5B]';
            return (
              <div 
                key={idx} 
                className={`aspect-square rounded ${opacityClass} transition-all duration-300`}
                title={`${cell.dateStr}: ${cell.count} completed`}
              />
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-editorial-100 flex justify-between items-center text-xs text-editorial-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3.5 h-3.5 rounded bg-[#f1edea]" />
            <div className="w-3.5 h-3.5 rounded bg-[#8A9A5B]/30" />
            <div className="w-3.5 h-3.5 rounded bg-[#8A9A5B]/65" />
            <div className="w-3.5 h-3.5 rounded bg-[#8A9A5B]" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="md:hidden bg-[#40301D] text-white rounded-3xl p-6 relative overflow-hidden mb-6 shadow-sm">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#feae2c]">💡</span>
            <h3 className="text-lg font-serif font-semibold text-white">Insights</h3>
          </div>
          <div className="space-y-3 text-sm text-[#af977e]">
            <p>You've established a strong rhythm with your morning meditation. 14 consecutive days.</p>
            <div className="h-px bg-[#af977e]/20" />
            <p>Reading before bed is taking root. Consider keeping a book on your nightstand as a gentle nudge.</p>
          </div>
        </div>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4 mb-6">
        {habits.slice(0, 3).map((habit) => {
          const pct = getHabitPercentage(habit._id);
          const { icon, title } = getHabitIconAndTitle(habit.title);
          const displayIcon = icon || habit.icon || '📌';
          
          const radius = 35;
          const strokeWidth = 6;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (pct / 100) * circumference;

          const strokeColors = ['stroke-[#8A9A5B]', 'stroke-[#dcc2a7]', 'stroke-[#F5A623]'];
          const strokeColor = strokeColors[habits.indexOf(habit) % strokeColors.length];

          return (
            <div key={habit._id} className="bg-white rounded-3xl p-6 border border-editorial-200 text-center flex flex-col items-center justify-center shadow-sm">
              <h4 className="text-xs font-bold text-editorial-500 uppercase tracking-wider mb-4">{displayIcon} {title}</h4>
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-[#f1edea] stroke-current" cx="50" cy="50" fill="transparent" r={radius} strokeWidth={strokeWidth} />
                  <circle 
                    className={`${strokeColor} stroke-current transition-all duration-500`} 
                    cx="50" cy="50" fill="transparent" r={radius} 
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-serif font-bold text-earth-dark">{pct}%</span>
                </div>
              </div>
              <p className="text-xs text-editorial-400 mt-2">Current week</p>
            </div>
          );
        })}
      </div>

      {/* New Ritual Modal overlay for mobile */}
      {isNewRitualOpen && (
        <NewRitualModal 
          onClose={() => setIsNewRitualOpen(false)}
          onSave={addHabit}
        />
      )}

    </div>
  );
};

export default Tracker;
