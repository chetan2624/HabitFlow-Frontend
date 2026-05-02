import { useState, useContext, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const ProfileModal = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    age: '',
    birthday: '',
    healthConditions: '',
    routine: '',
    hobbies: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.profileInfo) {
          setFormData({
            age: res.data.profileInfo.age || '',
            birthday: res.data.profileInfo.birthday || '',
            healthConditions: res.data.profileInfo.healthConditions?.join(', ') || '',
            routine: res.data.profileInfo.routine || '',
            hobbies: res.data.profileInfo.hobbies?.join(', ') || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        healthConditions: formData.healthConditions.split(',').map(item => item.trim()).filter(Boolean),
        hobbies: formData.hobbies.split(',').map(item => item.trim()).filter(Boolean),
        age: formData.age ? Number(formData.age) : undefined,
      };
      await api.put('/auth/profile', payload);
      onClose();
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm relative">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-lg p-8 relative overflow-hidden h-fit max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Complete Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g. 28"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Birthday</label>
            <input 
              type="date" 
              name="birthday" 
              value={formData.birthday} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Health Conditions (comma separated)</label>
            <input 
              type="text" 
              name="healthConditions" 
              value={formData.healthConditions} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g. asthma, diabetes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Routine Type</label>
            <select
              name="routine"
              value={formData.routine}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">Select Routine</option>
              <option value="Morning Person">Morning Person</option>
              <option value="Night Owl">Night Owl</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hobbies (comma separated)</label>
            <input 
              type="text" 
              name="hobbies" 
              value={formData.hobbies} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g. Reading, Gaming, Hiking"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
