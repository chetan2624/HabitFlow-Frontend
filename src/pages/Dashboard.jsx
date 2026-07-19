import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Flame, Target, Zap, PlusCircle, Check } from 'lucide-react';
import api from '../api/axios';
import ProfileModal from '../components/ProfileModal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ todaysScore: 0, weekStats: [], totalHabits: 0 });
  const [streak, setStreak] = useState(0);
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const statsRes = await api.get('/analytics/stats');
        setStats(statsRes.data);

        // Calculate mock streak from weekStats
        let currentStreak = 0;
        const reversed = [...statsRes.data.weekStats].reverse(); // from today backwards
        for (const day of reversed) {
          if (day.score > 0) currentStreak++;
          else break;
        }
        setStreak(currentStreak);

        const d = new Date();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        const [habitsRes, logsRes] = await Promise.all([
          api.get('/habits'),
          api.get(`/logs?month=${month}&year=${year}`)
        ]);
        setHabits(habitsRes.data);
        setLogs(logsRes.data);
      } catch (error) {
        console.error('Failed to fetch data');
      }
    };
    fetchData();
  }, [user]);

  const toggleHabit = async (habitId) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const existingLog = logs.find(l => l.habit === habitId && l.date === todayStr);
      const isCompleted = existingLog ? existingLog.status : false;

      await api.post('/logs', { habitId, date: todayStr, status: !isCompleted });

      // Refresh data
      const d = new Date();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();

      const [logsRes, statsRes] = await Promise.all([
        api.get(`/logs?month=${month}&year=${year}`),
        api.get('/analytics/stats')
      ]);
      setLogs(logsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const percentage = stats.totalHabits > 0 ? Math.round((stats.todaysScore / stats.totalHabits) * 100) : 0;
  const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;

  return (
    <div className="min-h-screen bg-editorial-50 pb-20 md:p-8 md:pb-8 max-w-7xl mx-auto">
      {/* ========================================================
          DESKTOP VIEW (md and up)
         ======================================================== */}
      <div className="hidden md:block">
        <header className="mb-10">
          <p className="text-sm font-bold tracking-widest text-editorial-500 uppercase mb-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-4xl font-serif text-editorial-900 mb-2">
            Good morning, {user?.name?.split(' ')[0] || 'friend'}
          </h1>
        </header>

        {/* Top Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Large Hero Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex flex-col md:flex-row justify-between items-center relative overflow-hidden min-h-[340px] gap-6">
            <div className="z-10 relative md:max-w-[60%] flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4 md:mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500"></span> On track this week
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-editorial-900 mb-3 md:mb-4 leading-tight">
                  You've nurtured {stats.todaysScore} of {stats.totalHabits || 0} rituals today.
                </h2>
              </div>
              <p className="text-editorial-500 text-base md:text-lg leading-relaxed max-w-sm md:max-w-full">
                Keep it gentle. Tap a habit below to mark it done — no pressure to be perfect.
              </p>
            </div>
            <div className="w-full md:w-[35%] h-48 md:h-full relative flex items-center justify-center">
              <img src="/new-assests/Coach-cuate.svg" alt="Coach Illustration" className="max-h-full object-contain drop-shadow-xl" />
            </div>
          </div>

          {/* Right Column Features */}
          <div className="flex flex-col gap-6 md:h-[340px]">
            <Link to="/tracker" className="bg-primary-500 hover:bg-primary-600 text-editorial-900 font-bold text-lg py-5 px-6 rounded-2xl w-full flex items-center gap-3 shadow-sm transition-all hover:-translate-y-1">
              <PlusCircle className="w-5 h-5" /> Add a new ritual
            </Link>

            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex-1 flex flex-col justify-center items-center text-center">
              <img src="/new-assests/undraw_yoga_i399.svg" alt="Yoga Intention" className="h-28 mb-6 object-contain" />
              <h3 className="font-serif text-xl text-editorial-900 mb-2 font-semibold">Daily intention</h3>
              <p className="text-editorial-500 text-sm italic leading-relaxed">"Slow is smooth, smooth is steady."</p>
            </div>
          </div>
        </div>

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Streak */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-editorial-500 font-medium text-sm">Longest streak</span>
            </div>
            <div>
              <h3 className="text-3xl font-serif text-editorial-900 mb-1">{streak} days</h3>
              <p className="text-xs text-editorial-400">Current active streak</p>
            </div>
          </div>

          {/* Weekly Completion */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-editorial-500 font-medium text-sm">Weekly completion</span>
            </div>
            <div>
              <h3 className="text-3xl font-serif text-editorial-900 mb-1">
                {stats.weekStats?.length > 0 ? Math.round((stats.weekStats.filter(d => d.score > 0).length / 7) * 100) : 0}%
              </h3>
              <p className="text-xs text-editorial-400">
                {stats.weekStats?.filter(d => d.score > 0).length || 0} of 7 days active
              </p>
            </div>
          </div>

          {/* Today's Progress */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-editorial-500 font-medium text-sm">Today's progress</span>
            </div>
            <div>
              <h3 className="text-3xl font-serif text-editorial-900 mb-1">{stats.todaysScore}/{stats.totalHabits}</h3>
              <p className="text-xs text-editorial-400">Habits completed</p>
            </div>
          </div>
        </div>

        {/* Today's Habits Section */}
        <div>
          <h2 className="text-2xl font-serif text-editorial-900 mb-6">Today's habits</h2>
          <div className="flex flex-wrap gap-4">
            {habits.length > 0 ? habits.map((habit) => {
              const isDone = logs.some(l => l.habit === habit._id && l.date === todayStr && l.status);
              return (
                <button
                  key={habit._id}
                  onClick={() => toggleHabit(habit._id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-full font-medium transition-all ${isDone
                      ? 'bg-sage-100 text-sage-900 border border-sage-300 hover:bg-sage-200 shadow-sm'
                      : 'bg-white text-editorial-700 border border-editorial-200 hover:border-editorial-400 shadow-sm'
                    }`}
                >
                  <span className="text-lg opacity-80">{habit.icon || '📌'}</span>
                  {habit.title}
                  {isDone && <Check className="w-4 h-4 text-sage-600 ml-1" />}
                </button>
              );
            }) : (
              <p className="text-editorial-400 italic text-sm">No habits added yet. Add a new ritual to get started!</p>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW (less than md)
         ======================================================== */}
      <div className="md:hidden flex flex-col gap-6">
        {/* Mobile Header with Image Background */}
        <div className="relative h-64 rounded-b-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(64,48,29,0.12)] -mx-4 -mt-16 z-0">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida/AP1WRLuYBBEZO4K1NGkIZIj4RsZx4Ox0E3hilmV8nifZNoEuARctSkAEm9QiRpLD9OdBGqhKetlaawTAXDYRZTQa3nfhBlAFmWNPEuzM5lzywp4nASamdyY8O2Lz7FfNQhf-jGFs2XX-OgzUeHanAuI7zGGKL9beUOiFm6CxLT-jig-zhEWMBgWa5diRy5PiaerNZqbqe9aBsgOqiA8OqR-KICvkEXcP2ZacAmd0z0Mkw-KL7YOnCbxryPKR"
            alt="Mindful Morning Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-editorial-900/60 to-editorial-900/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <p className="text-xs font-bold text-primary-500 mb-1 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <h2 className="text-3xl font-serif text-white font-semibold">Daily Zen</h2>
          </div>
        </div>

        <div className="px-4 flex flex-col gap-6 -mt-4 relative z-10">
          {/* Progress Section */}
          <section className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-[0_4px_24px_rgba(64,48,29,0.06)] border border-editorial-100">
            <div>
              <h3 className="text-xl font-serif text-editorial-900 mb-1">Today's Flow</h3>
              <p className="text-sm text-editorial-500">You've completed {stats.todaysScore} of {stats.totalHabits || 0} rituals.</p>
            </div>
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle className="text-editorial-100 stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                {/* Progress circle */}
                <circle
                  className="text-sage-500 stroke-current transition-all duration-500"
                  cx="50" cy="50" fill="transparent" r="40"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-editorial-900">{percentage}%</span>
              </div>
            </div>
          </section>

          {/* Quick Actions / Intention */}
          <Link to="/tracker" className="bg-primary-500 hover:bg-primary-600 text-editorial-900 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-md transition-all active:scale-95">
            <PlusCircle className="w-5 h-5" /> Add a new ritual
          </Link>

          {/* Habits List */}
          <section className="flex flex-col gap-3">
            <h3 className="text-lg font-serif text-editorial-900 mb-1">Today's rituals</h3>
            {habits.length > 0 ? habits.map((habit) => {
              const isDone = logs.some(l => l.habit === habit._id && l.date === todayStr && l.status);
              return (
                <div
                  key={habit._id}
                  onClick={() => toggleHabit(habit._id)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 active:scale-95 cursor-pointer ${isDone
                      ? 'bg-editorial-100 border-editorial-200 shadow-none'
                      : 'bg-white border-editorial-100 shadow-[0_8px_32px_rgba(64,48,29,0.06)]'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-editorial-50 flex items-center justify-center text-xl shrink-0">
                      {habit.icon || '📌'}
                    </div>
                    <div>
                      <h4 className={`text-base font-medium transition-colors duration-300 ${isDone ? 'text-editorial-400 line-through' : 'text-editorial-950 font-semibold'}`}>
                        {habit.title}
                      </h4>
                      <p className="text-xs text-editorial-400 mt-0.5">Daily</p>
                    </div>
                  </div>
                  <button
                    aria-label="Toggle habit"
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${isDone
                        ? 'bg-sage-500 border-sage-500 text-white'
                        : 'border-editorial-200 text-transparent hover:border-editorial-400'
                      }`}
                  >
                    {isDone && <Check className="w-4 h-4 text-white" />}
                  </button>
                </div>
              );
            }) : (
              <p className="text-editorial-400 italic text-sm text-center py-6 bg-white rounded-2xl border border-dashed border-editorial-200">
                No habits added yet. Click above to add!
              </p>
            )}
          </section>

          {/* Daily Intention */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex flex-col justify-center items-center text-center mb-4">
            <h3 className="font-serif text-lg text-editorial-900 mb-1 font-semibold">Daily intention</h3>
            <p className="text-editorial-500 text-sm italic leading-relaxed">"Slow is smooth, smooth is steady."</p>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
