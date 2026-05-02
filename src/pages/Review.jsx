import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../api/axios';
import { Target, Trophy, Flame, AlertCircle, BookOpen } from 'lucide-react';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [currentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [formData, setFormData] = useState({
    rating: 5,
    wins: '',
    losses: '',
    lessons: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews');
      setReviews(data);
      const currentReview = data.find(r => r.month === currentMonth);
      if (currentReview) {
        setFormData({
          rating: currentReview.rating,
          wins: currentReview.wins.join('\n'),
          losses: currentReview.losses.join('\n'),
          lessons: currentReview.lessons
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        month: currentMonth,
        rating: formData.rating,
        wins: formData.wins.split('\n').filter(Boolean),
        losses: formData.losses.split('\n').filter(Boolean),
        lessons: formData.lessons
      });
      setSuccessMsg('Reflection archived successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20 min-h-screen bg-editorial-50">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Honest Reflection
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-editorial-900 mb-3">Monthly Review</h1>
          <p className="text-editorial-500 font-medium text-lg max-w-md">Format: {currentMonth} • Pause, review your trajectory, and correct your course.</p>
        </div>
        
        <div className="flex items-end relative z-10 w-full lg:w-auto mt-4 lg:mt-0">
          <img src="/new-assests/undraw_walking-outside_7jfy.svg" alt="Walking Outside" className="h-28 lg:absolute lg:-top-6 lg:-left-40 object-contain hidden lg:block drop-shadow-md" />
        </div>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-editorial-200 mb-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-editorial-100 rounded-bl-full opacity-50 z-0 pointer-events-none"></div>
        
        <h2 className="text-3xl font-serif text-editorial-900 mb-8 relative z-10">Reflect on {format(new Date(), 'MMMM')}</h2>
        
        {successMsg && (
          <div className="bg-sage-100 text-sage-800 p-4 rounded-xl mb-8 font-medium border border-sage-200 flex items-center gap-3 relative z-10">
            <Trophy className="w-5 h-5" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="bg-editorial-50 p-6 rounded-2xl border border-editorial-200">
            <label className="block text-sm font-bold text-editorial-700 mb-6 text-center uppercase tracking-widest">
              Overall Rating: <span className="text-primary-600 text-2xl font-serif ml-2">{formData.rating}</span> <span className="text-editorial-400">/ 10</span>
            </label>
            <input 
              type="range" 
              min="1" max="10" 
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
              className="w-full h-3 bg-editorial-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="flex items-center gap-3 text-sm font-bold text-editorial-700 mb-3 uppercase tracking-widest">
                <Trophy className="w-5 h-5 text-sage-600 bg-sage-100 p-1 rounded-full"/> Biggest Wins
              </label>
              <textarea 
                className="w-full h-40 p-5 rounded-2xl border border-editorial-200 bg-white shadow-inner focus:ring-2 focus:ring-primary-500 outline-none resize-none text-editorial-900 placeholder:text-editorial-300 font-medium leading-relaxed"
                value={formData.wins}
                onChange={e => setFormData({...formData, wins: e.target.value})}
                placeholder="Finished that big project&#10;Ran 10 miles"
              ></textarea>
              <p className="text-xs text-editorial-400 mt-2 italic">Separate by new line</p>
            </div>
            <div>
              <label className="flex items-center gap-3 text-sm font-bold text-editorial-700 mb-3 uppercase tracking-widest">
                <AlertCircle className="w-5 h-5 text-amber-600 bg-amber-100 p-1 rounded-full"/> Where did I fall short?
              </label>
              <textarea 
                className="w-full h-40 p-5 rounded-2xl border border-editorial-200 bg-white shadow-inner focus:ring-2 focus:ring-primary-500 outline-none resize-none text-editorial-900 placeholder:text-editorial-300 font-medium leading-relaxed"
                value={formData.losses}
                onChange={e => setFormData({...formData, losses: e.target.value})}
                placeholder="Ate junk food on Wednesday&#10;Skipped workout"
              ></textarea>
              <p className="text-xs text-editorial-400 mt-2 italic">Separate by new line</p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 text-sm font-bold text-editorial-700 mb-3 uppercase tracking-widest">
              <Flame className="w-5 h-5 text-primary-600 bg-primary-100 p-1 rounded-full"/> Key Lessons Learned
            </label>
            <textarea 
              className="w-full p-5 rounded-2xl border border-editorial-200 bg-white shadow-inner focus:ring-2 focus:ring-primary-500 outline-none min-h-[120px] text-editorial-900 placeholder:text-editorial-300 font-medium leading-relaxed"
              value={formData.lessons}
              onChange={e => setFormData({...formData, lessons: e.target.value})}
              placeholder="What will I change next month?"
            ></textarea>
          </div>

          <button type="submit" className="w-full py-5 bg-editorial-900 hover:bg-editorial-800 text-white text-lg font-bold rounded-full shadow-lg transition-all tracking-wide">
            Save Reflection
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-2xl font-serif text-editorial-900 mb-6 pl-2 border-l-4 border-primary-500">Archive</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.filter(r => r.month !== currentMonth).map(review => (
            <div key={review._id} className="bg-white p-6 rounded-3xl border border-editorial-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="pr-4">
                <h4 className="font-serif font-bold text-xl text-editorial-900 mb-2">{review.month}</h4>
                <p className="text-editorial-500 text-sm italic line-clamp-2 leading-relaxed">"{review.lessons}"</p>
              </div>
              <div className="w-16 h-16 shrink-0 rounded-full bg-editorial-50 flex items-center justify-center font-serif font-bold text-2xl text-primary-600 border border-editorial-200 shadow-inner">
                {review.rating}
              </div>
            </div>
          ))}
          {reviews.filter(r => r.month !== currentMonth).length === 0 && (
             <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-editorial-200 border-dashed">
               <p className="text-editorial-400 italic">No past reviews yet. Your journey begins now.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
