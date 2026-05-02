import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LineChart, Target, CalendarDays, Smile, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import FocusTimer from './FocusTimer';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tracker', path: '/tracker', icon: CheckSquare },
    { name: 'Analytics', path: '/analytics', icon: LineChart },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Review', path: '/review', icon: CalendarDays },
    { name: 'Mood', path: '/mood', icon: Smile },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 bg-editorial-900 border-r border-editorial-900 px-4 py-8 flex flex-col justify-between transition-all duration-300 shadow-2xl z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div>
        <Link to="/home" className={`flex items-center gap-2 mb-10 hover:opacity-80 transition-opacity ${isOpen ? 'px-2' : 'justify-center'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 shrink-0">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 21v-5h5"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          {isOpen && <span className="text-2xl font-black tracking-widest uppercase font-serif text-white">HabitFlow</span>}
        </Link>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-primary-500 text-editorial-900 font-bold' 
                    : 'text-editorial-400 hover:text-white hover:bg-white/5'
                } ${!isOpen && 'justify-center'}`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isOpen && item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <NavLink to="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-editorial-400 hover:text-white hover:bg-white/5 transition-colors font-medium ${!isOpen && 'justify-center'}`}>
          <Settings className="w-5 h-5 shrink-0" />
          {isOpen && "Settings"}
        </NavLink>
        <button onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-editorial-400 hover:bg-red-500/10 hover:text-red-400 transition-colors font-medium w-full text-left ${!isOpen && 'justify-center'}`}>
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && "Sign Out"}
        </button>
        <button onClick={() => setIsOpen(!isOpen)} className={`mt-4 flex items-center gap-3 px-3 py-2.5 rounded-xl text-editorial-400 hover:text-white hover:bg-white/5 transition-colors font-medium ${!isOpen && 'justify-center'}`}>
          {isOpen ? <PanelLeftClose className="w-5 h-5 shrink-0" /> : <PanelLeftOpen className="w-5 h-5 shrink-0" />}
          {isOpen && "Collapse"}
        </button>
      </div>
    </aside>
  );
};

const Layout = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-transparent text-editorial-900 font-sans transition-colors duration-200 flex">
      {user && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
      <main className={`${user ? (isSidebarOpen ? 'ml-64' : 'ml-20') : 'ml-0'} w-full relative min-h-screen transition-all duration-300`}>
        <Outlet />
        <FocusTimer />
      </main>
    </div>
  );
};

export default Layout;
