import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../api/axios';
import { Target, Trophy, Flame, AlertCircle } from 'lucide-react';

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
      setSuccessMsg('Review saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-20">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Monthly Review</h1>
        <p className="text-slate-500 font-medium text-lg">Format: {currentMonth}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 mb-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Reflect on {format(new Date(), 'MMMM')}</h2>
        
        {successMsg && <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 font-medium">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 text-center">
              Overall Rating: <span className="text-primary-500 text-xl">{formData.rating}</span> / 10
            </label>
            <input 
              type="range" 
              min="1" max="10" 
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <Trophy className="w-5 h-5 text-green-500"/> Biggest Wins (1 per line)
              </label>
              <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                value={formData.wins}
                onChange={e => setFormData({...formData, wins: e.target.value})}
                placeholder="Finished that big project&#10;Ran 10 miles"
              ></textarea>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <AlertCircle className="w-5 h-5 text-red-500"/> Where did I fall short?
              </label>
              <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                value={formData.losses}
                onChange={e => setFormData({...formData, losses: e.target.value})}
                placeholder="Ate junk food on Wednesday&#10;Skipped workout"
              ></textarea>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              <Flame className="w-5 h-5 text-primary-500"/> Key Lessons Learned
            </label>
            <textarea 
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[100px]"
              value={formData.lessons}
              onChange={e => setFormData({...formData, lessons: e.target.value})}
              placeholder="What will I change next month?"
            ></textarea>
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition-all">
            Save Review
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Archive</h3>
        <div className="space-y-4">
          {reviews.filter(r => r.month !== currentMonth).map(review => (
            <div key={review._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{review.month}</h4>
                <p className="text-slate-500 text-sm line-clamp-1">{review.lessons}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center font-bold text-xl text-primary-500 border border-slate-200 dark:border-slate-600">
                {review.rating}
              </div>
            </div>
          ))}
          {reviews.filter(r => r.month !== currentMonth).length === 0 && (
             <p className="text-slate-400 text-center py-4">No past reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
