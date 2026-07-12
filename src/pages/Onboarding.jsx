import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, GraduationCap, Dumbbell, Star, User, ArrowRight } from 'lucide-react';
import { useUser, useAuth } from '@clerk/react';
import api from '../api/axios';

const userTypes = [
  { id: 'Student', icon: GraduationCap, description: 'Track study habits & assignments' },
  { id: 'Working Professional', icon: Briefcase, description: 'Work-life balance & career goals' },
  { id: 'Business Owner', icon: Star, description: 'Productivity & team management' },
  { id: 'Fitness Enthusiast', icon: Dumbbell, description: 'Workouts, diet & recovery' },
  { id: 'Other', icon: User, description: 'General self-improvement' },
];

const illustrations = [
  { id: 'boy', path: '/new-assests/boy-1.png', label: 'Mindful' },
  { id: 'women', path: '/new-assests/woman-1.png', label: 'Active' },
  { id: 'man', path: '/new-assests/man-1.png', label: 'Explorer' },
  { id: 'girl', path: '/new-assests/girl-1.png', label: 'Planner' },
];
 
const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedIllustration, setSelectedIllustration] = useState('');
  
  const { updateOnboarding, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    // If they already have a userType, they shouldn't be here
    if (isLoaded && isSignedIn && clerkUser?.publicMetadata?.onboardingComplete) {
       navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, clerkUser, navigate]);

  const handleCompleteSetup = async () => {
    if (!selectedType || !selectedIllustration) return;
    
    try {
      // 1. Temporarily store illustration so AuthContext syncUser can pick it up
      localStorage.setItem('pendingIllustration', illustrations.find(i => i.id === selectedIllustration)?.path || '');
      
      // 2. Call AuthContext's updateOnboarding method
      await updateOnboarding(selectedType);
      
      // 3. Since AuthContext handles fetching from our DB, now it's synced.
      // We explicitly call sync here if we want to be 100% sure the illustration is saved immediately:
      const token = await getToken();
      await api.post('/auth/sync', { 
         email: clerkUser.primaryEmailAddress?.emailAddress,
         name: clerkUser.fullName || clerkUser.firstName || 'User',
         customIllustration: illustrations.find(i => i.id === selectedIllustration)?.path 
      }, {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clean up
      localStorage.removeItem('pendingIllustration');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update preferences', error);
    }
  };

  return (
    <div className="min-h-screen bg-editorial-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white p-10 md:p-16 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-editorial-200">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12 max-w-xs mx-auto">
           <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-editorial-200'}`}></div>
           <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-editorial-200'}`}></div>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-serif text-editorial-900 mb-4">How do you describe yourself?</h1>
              <p className="text-lg text-editorial-500">We'll tailor your HabitFlow experience based on your selection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    selectedType === type.id 
                      ? 'border-primary-500 bg-primary-50 shadow-sm' 
                      : 'border-editorial-200 bg-white hover:border-editorial-300 hover:bg-editorial-50'
                  }`}
                >
                  <type.icon className={`w-8 h-8 mb-4 ${selectedType === type.id ? 'text-primary-600' : 'text-editorial-400'}`} />
                  <h3 className={`text-xl font-bold mb-1 font-serif ${selectedType === type.id ? 'text-editorial-900' : 'text-editorial-700'}`}>{type.id}</h3>
                  <p className={`text-sm ${selectedType === type.id ? 'text-primary-700' : 'text-editorial-500'}`}>{type.description}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedType}
                className="px-10 py-4 bg-editorial-900 text-white rounded-full font-bold text-lg hover:bg-editorial-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-serif text-editorial-900 mb-4">Choose an Avatar Illustration</h1>
              <p className="text-lg text-editorial-500">This will be your personal banner on the dashboard.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {illustrations.map((illus) => (
                <button
                  key={illus.id}
                  onClick={() => setSelectedIllustration(illus.id)}
                  className={`p-4 rounded-3xl border-2 text-center transition-all flex flex-col items-center gap-4 ${
                    selectedIllustration === illus.id 
                      ? 'border-primary-500 bg-primary-50 shadow-md' 
                      : 'border-editorial-200 bg-white hover:border-editorial-300 hover:bg-editorial-50'
                  }`}
                >
                  <img src={illus.path} alt={illus.label} className="h-24 w-24 object-contain" />
                  <span className={`font-bold uppercase tracking-widest text-xs ${selectedIllustration === illus.id ? 'text-primary-700' : 'text-editorial-500'}`}>
                    {illus.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 text-editorial-500 font-bold hover:text-editorial-900 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCompleteSetup}
                disabled={!selectedIllustration || loading}
                className="px-10 py-4 bg-primary-500 text-editorial-900 rounded-full font-bold text-lg hover:bg-primary-600 transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
