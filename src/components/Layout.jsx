import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LineChart, Target, CalendarDays, Smile, Settings, LogOut, PanelLeftClose, PanelLeftOpen, Menu, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '@clerk/react';
import FocusTimer from './FocusTimer';

const Sidebar = ({ isOpen, setIsOpen, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      logout();
      navigate('/home');
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
    <aside className={`fixed inset-y-0 left-0 bg-editorial-900 border-r border-editorial-900 px-4 py-8 flex flex-col justify-between transition-all duration-300 shadow-2xl z-50 
      ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
      md:translate-x-0 
      ${isOpen ? 'md:w-64' : 'md:w-20'}`}
    >
      <div>
        <div className={`flex items-center justify-between mb-10 ${isOpen ? 'px-2' : 'justify-center'}`}>
          <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 shrink-0">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 21v-5h5"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            {(isOpen || isMobileOpen) && <span className="text-2xl font-black tracking-widest uppercase font-serif text-white">HabitFlow</span>}
          </Link>
          {isMobileOpen && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-editorial-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-primary-500 text-editorial-900 font-bold' 
                    : 'text-editorial-400 hover:text-white hover:bg-white/5'
                } ${(!isOpen && !isMobileOpen) && 'justify-center'}`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {(isOpen || isMobileOpen) && item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <NavLink 
          to="/settings" 
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-editorial-400 hover:text-white hover:bg-white/5 transition-colors font-medium ${(!isOpen && !isMobileOpen) && 'justify-center'}`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {(isOpen || isMobileOpen) && "Settings"}
        </NavLink>
        <button 
          onClick={() => { setIsMobileOpen(false); handleLogout(); }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-editorial-400 hover:bg-red-500/10 hover:text-red-400 transition-colors font-medium w-full text-left ${(!isOpen && !isMobileOpen) && 'justify-center'}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(isOpen || isMobileOpen) && "Sign Out"}
        </button>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`mt-4 hidden md:flex items-center gap-3 px-3 py-2.5 rounded-xl text-editorial-400 hover:text-white hover:bg-white/5 transition-colors font-medium ${!isOpen && 'justify-center'}`}
        >
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-editorial-900 font-sans transition-colors duration-200 flex flex-col md:flex-row">
      {/* Mobile Top App Bar */}
      {user && (
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-editorial-900 border-b border-editorial-800 flex items-center justify-between px-6 z-40 text-white shadow-md">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 shrink-0">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 21v-5h5"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span className="text-xl font-bold tracking-widest uppercase font-serif text-white">HabitFlow</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white hover:opacity-80 active:scale-95 transition-all p-1"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>
      )}

      {/* Backdrop for Mobile Drawer */}
      {user && isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-editorial-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {user && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
        />
      )}

      <main className={`${user ? (isSidebarOpen ? 'md:ml-64' : 'md:ml-20') : 'ml-0'} ml-0 w-full relative min-h-screen transition-all duration-300 pt-16 md:pt-0`}>
        <Outlet />
        <FocusTimer />
      </main>
    </div>
  );
};

export default Layout;
