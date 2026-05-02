import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LineChart, Target, CalendarDays, Smile, Settings, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/home', icon: LayoutDashboard },
    { name: 'Tracker', path: '/tracker', icon: CheckSquare },
    { name: 'Analytics', path: '/analytics', icon: LineChart },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Review', path: '/review', icon: CalendarDays },
    { name: 'Mood', path: '/mood', icon: Smile },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 px-4 py-8 flex flex-col justify-between transition-colors duration-200">
      <div>
        <div className="flex items-center gap-2 px-2 mb-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff7b93" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 21v-5h5"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">HabitFlow.</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        {user ? (
          <>
            <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors font-medium">
              <Settings className="w-5 h-5" />
              Settings
            </NavLink>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium w-full text-left">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3 pb-2">
            <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-xl font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors">Log In</button>
            <button onClick={() => navigate('/signup')} className="w-full py-2.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors">Sign Up Free</button>
          </div>
        )}
      </div>
    </aside>
  );
};

import FocusTimer from './FocusTimer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans transition-colors duration-200">
      <Sidebar />
      <main className="ml-64 relative min-h-screen">
        <Outlet />
        <FocusTimer />
      </main>
    </div>
  );
};

export default Layout;
