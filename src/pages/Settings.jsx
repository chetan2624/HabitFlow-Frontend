import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Settings as SettingsIcon, Moon, Sun, User as UserIcon, Bell, Download, Shield } from 'lucide-react';
import api from '../api/axios';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check initial state
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    } else if (localStorage.theme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  const exportData = async () => {
    try {
      const [habitsRes, logsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/logs')
      ]);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ habits: habitsRes.data, logs: logsRes.data }));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "habitflow_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch(err) {
      console.error(err);
      alert("Failed to export data");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 flex items-center gap-4">
        <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-2xl text-primary-500">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">Settings</h1>
          <p className="text-slate-500 font-medium text-lg">Manage your app preferences and profile.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full text-slate-500 dark:text-slate-400"><UserIcon className="w-6 h-6"/></div>
          <div>
            <h3 className="font-bold text-lg dark:text-white text-slate-900">Profile Details</h3>
            <p className="text-slate-500 text-sm">Your personal information</p>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2">Display Name</label>
             <input type="text" disabled value={user?.name || ''} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-slate-200 text-slate-500 cursor-not-allowed" />
           </div>
           <div>
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2">Email Address</label>
             <input type="text" disabled value={user?.email || ''} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-slate-200 text-slate-500 cursor-not-allowed" />
           </div>
           <div>
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2">Account Type</label>
             <input type="text" disabled value={user?.userType || 'Other'} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-slate-200 text-slate-500 cursor-not-allowed" />
             <p className="text-xs text-slate-400 mt-2">Cannot be changed after onboarding.</p>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
           <h3 className="font-bold text-lg dark:text-white text-slate-900 mb-1 flex items-center gap-2"><Sun className="w-5 h-5 text-amber-500"/> Appearance & Preferences</h3>
        </div>
        <div className="p-8">
           <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
             <div>
               <h4 className="font-bold text-slate-900 dark:text-white">Dark Mode</h4>
               <p className="text-slate-500 text-sm">Switch between light and dark theme globally.</p>
             </div>
             <button 
               onClick={toggleDarkMode}
               className={`w-14 h-8 rounded-full transition-colors relative flex items-center ${darkMode ? 'bg-primary-500' : 'bg-slate-300'}`}
             >
               <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'} flex items-center justify-center`}>
                  {darkMode ? <Moon className="w-4 h-4 text-primary-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
               </div>
             </button>
           </div>
           
           <div className="flex items-center justify-between">
             <div>
               <h4 className="font-bold text-slate-900 dark:text-white">Email Notifications</h4>
               <p className="text-slate-500 text-sm">Receive weekly streak updates (Demo).</p>
             </div>
             <button className="w-14 h-8 rounded-full bg-slate-300 relative flex items-center">
               <div className="w-6 h-6 rounded-full bg-white shadow-md transform translate-x-1"></div>
             </button>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
           <h3 className="font-bold text-lg dark:text-white text-slate-900 mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-red-500"/> Data & Privacy</h3>
        </div>
        <div className="p-8">
           <div className="flex items-center justify-between mb-6">
             <div>
               <h4 className="font-bold text-slate-900 dark:text-white">Export Your Data</h4>
               <p className="text-slate-500 text-sm">Download all your logs and habits as JSON.</p>
             </div>
             <button onClick={exportData} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors">
               <Download className="w-4 h-4"/> Export JSON
             </button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
