import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Flame, CheckCircle2, TrendingUp, ArrowRight, Award, PlusCircle, Shield, Zap, Target, UserCheck } from 'lucide-react';
import api from '../api/axios';
import ProfileModal from '../components/ProfileModal';

const BADGES = {
  BRONZE: { name: 'Bronze Flame', days: 3, color: 'text-amber-600', bg: 'bg-amber-100', threshold: 3 },
  SILVER: { name: 'Silver Shield', days: 7, color: 'text-slate-400', bg: 'bg-slate-100', threshold: 7 },
  GOLD: { name: 'Golden Focus', days: 14, color: 'text-yellow-500', bg: 'bg-yellow-100', threshold: 14 },
  DIAMOND: { name: 'Iron Will', days: 30, color: 'text-cyan-400', bg: 'bg-cyan-100', threshold: 30 }
};

const SUGGESTIONS = {
  'Student': ['Study 2 hours', 'Read 10 pages', 'Review Flashcards', 'Sleep 8 hours'],
  'Working Professional': ['Inbox Zero', 'Code for 1 hour', 'Stretch at desk', 'Drink Water'],
  'Fitness Enthusiast': ['Workout 45 mins', 'Track Macros', 'Stretch/Yoga', 'Drink 3L Water'],
  'Business Owner': ['Plan tomorrow', 'Review Finances', 'Read industry news', 'Meditate 10 mins'],
  'Influencer': ['Post Content', 'Engage comments', 'Plan ideas', 'Digital Detox'],
  'Other': ['Drink Water', 'Read 10 pages', 'Exercise 30 mins', 'Meditate 10 mins']
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ todaysScore: 0, weekStats: [], totalHabits: 0 });
  const [streak, setStreak] = useState(0);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const res = await api.get('/analytics/stats');
        setStats(res.data);
        
        // Calculate mock streak from weekStats
        let currentStreak = 0;
        const reversed = [...res.data.weekStats].reverse(); // from today backwards
        for (const day of reversed) {
          if (day.score > 0) currentStreak++;
          else break;
        }
        setStreak(currentStreak);
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, [user]);

  const addSuggestedHabit = async (title) => {
    try {
      await api.post('/habits', { title });
      alert(`Added "${title}" to your habits! Head to tracker to see it.`);
    } catch (err) {
      console.error(err);
    }
  };

  const getBadge = () => {
    if (streak >= 30) return BADGES.DIAMOND;
    if (streak >= 14) return BADGES.GOLD;
    if (streak >= 7) return BADGES.SILVER;
    if (streak >= 3) return BADGES.BRONZE;
    return null;
  };

  const currentBadge = getBadge();
  const suggestions = user ? SUGGESTIONS[user.userType || 'Other'] : [];

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <header className="pt-20 pb-24 text-center px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Design Your <span className="text-primary-500">Perfect Day.</span>
            </h1>
            <p className="text-2xl text-slate-500 dark:text-slate-400 mb-10">
              HabitFlow is the premium tracking experience built to help you forge unbreakable habits, 
              understand your mood, and achieve your most ambitious goals.
            </p>
            <div className="flex gap-4 justify-center">
               <Link to="/signup" className="flex items-center gap-2 bg-slate-900 dark:bg-primary-500 hover:bg-slate-800 dark:hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-all hover:scale-105">
                  Join HabitFlow Free <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
          </div>
        </header>

        <section className="py-20 bg-slate-50 dark:bg-slate-800 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
              <div>
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Interactive Matrix Tracker</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
                  Map your entire month at a glance. Our signature spreadsheet-styled tracker lets you rapidly log your habits with ultra-satisfying checkboxes and instantly calculates your daily score.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent"></div>
                {/* Mock UI visualization */}
                <div className="w-full space-y-4">
                  <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-full flex gap-2 p-1">
                    <div className="h-full w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-full w-8 bg-slate-200 dark:bg-slate-700 rounded ml-auto"></div>
                    <div className="h-full w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-full w-8 bg-primary-400 rounded"></div>
                    <div className="h-full w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-full flex gap-2 p-1">
                    <div className="h-full w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-full w-8 bg-primary-400 rounded ml-auto"></div>
                    <div className="h-full w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-full w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-full w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32 md:flex-row-reverse">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 aspect-video flex items-center justify-center relative overflow-hidden order-last md:order-first">
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/10 to-transparent"></div>
                {/* Mock UI visualization */}
                <div className="grid grid-cols-12 gap-1 w-full h-32">
                   {Array.from({length: 60}).map((_, i) => (
                     <div key={i} className={`rounded-sm ${Math.random() > 0.7 ? 'bg-primary-500' : Math.random() > 0.4 ? 'bg-primary-300' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                   ))}
                </div>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-6">
                  <Flame className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Heatmap Analytics</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
                  Never break the chain. Watch your consistency visually manifest over a beautiful 365-day GitHub-style heatmap. Correlate your tracking streaks with an integrated energy and mood graph.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 mb-6">
                  <Zap className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Pomodoro & Focus Tools</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
                  Execute on your habits instantly with the built-in, floating Pomodoro timer. Transition smoothly into deep work and build momentum without ever leaving the dashboard.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent"></div>
                <div className="text-center">
                  <div className="text-6xl font-black text-slate-900 dark:text-white mb-4">25:00</div>
                  <div className="w-16 h-16 rounded-full bg-amber-500 mx-auto flex items-center justify-center text-white">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 dark:text-white">
            Hello, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-lg">Let's make today count. Here is your overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all"
          >
            <UserCheck className="w-5 h-5" /> Complete Profile
          </button>
          <Link to="/tracker" className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all">
            Start Tracking <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
          <div className="flex items-center gap-6 relative z-10">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${currentBadge ? currentBadge.bg + ' ' + currentBadge.color : 'bg-orange-50 text-orange-500'}`}>
                {currentBadge ? <Award className="w-8 h-8" /> : <Flame className="w-8 h-8" />}
             </div>
             <div>
               <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Current Streak</p>
               <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{streak} Days</h3>
             </div>
          </div>
          {currentBadge && (
            <div className={`absolute -right-4 -bottom-4 pt-10 pl-10 pr-6 pb-6 rounded-tl-full opacity-20 ${currentBadge.bg} ${currentBadge.color} z-0 pointer-events-none transition-transform group-hover:scale-110`}>
              <Award className="w-20 h-20" />
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Today's Score</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.todaysScore} <span className="text-lg text-slate-400 font-medium">/ {stats.totalHabits}</span></h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Weekly Potential</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Active</h3>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Curated for 
          <span className="text-primary-600 bg-primary-50 dark:bg-primary-900/40 px-3 py-1 rounded-lg ml-2">{user.userType}</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestions.map((title, i) => (
            <button 
              key={i} 
              onClick={() => addSuggestedHabit(title)}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-300 hover:shadow-md transition-all text-left text-slate-700 dark:text-slate-200 font-medium group"
            >
              <span>{title}</span>
              <PlusCircle className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {isProfileModalOpen && (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
