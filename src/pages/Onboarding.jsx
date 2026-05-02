import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, GraduationCap, Dumbbell, Star, User } from 'lucide-react';

const userTypes = [
  { id: 'Student', icon: GraduationCap, description: 'Track study habits & assignments' },
  { id: 'Working Professional', icon: Briefcase, description: 'Work-life balance & career goals' },
  { id: 'Business Owner', icon: Star, description: 'Productivity & team management' },
  { id: 'Fitness Enthusiast', icon: Dumbbell, description: 'Workouts, diet & recovery' },
  { id: 'Other', icon: User, description: 'General self-improvement' },
];

const Onboarding = () => {
  const [selectedType, setSelectedType] = useState('');
  const { updateOnboarding, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedType) return;
    try {
      await updateOnboarding(selectedType);
      navigate('/home');
    } catch (error) {
      console.error('Failed to update preferences', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">How do you describe yourself?</h1>
          <p className="text-lg text-slate-500">We'll tailor your HabitFlow experience based on your selection.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {userTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                selectedType === type.id 
                  ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100' 
                  : 'border-slate-200 bg-white hover:border-primary-200 hover:shadow-sm'
              }`}
            >
              <type.icon className={`w-8 h-8 mb-4 ${selectedType === type.id ? 'text-primary-600' : 'text-slate-400'}`} />
              <h3 className={`text-xl font-bold mb-1 ${selectedType === type.id ? 'text-primary-800' : 'text-slate-700'}`}>{type.id}</h3>
              <p className={`text-sm ${selectedType === type.id ? 'text-primary-600/80' : 'text-slate-500'}`}>{type.description}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedType || loading}
            className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
