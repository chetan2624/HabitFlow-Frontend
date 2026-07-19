import { useState } from 'react';
import { X, Clock, Check } from 'lucide-react';

const CATEGORIES = [
  { name: 'Fitness', icon: '🏋️', color: 'text-sage-muted bg-white' },
  { name: 'Mind', icon: '🧘', color: 'text-earth-dark bg-earth-dark text-white' },
  { name: 'Work', icon: '💼', color: 'text-sunlight-amber bg-white' },
  { name: 'Health', icon: '❤️', color: 'text-secondary-container bg-white' },
];

const NewRitualModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [selectedCategory, setSelectedCategory] = useState('Mind');
  const [reminderTime, setReminderTime] = useState('07:00 AM');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Get the emoji of the selected category
    const categoryObj = CATEGORIES.find(c => c.name === selectedCategory);
    const emoji = categoryObj ? categoryObj.icon : '📌';

    // Prepend emoji to title for seamless rendering
    const finalTitle = `${emoji} ${title.trim()}`;
    onSave(finalTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fdf9f6] text-on-background animate-in slide-in-from-bottom duration-300">
      {/* Top App Bar */}
      <header className="flex justify-between items-center w-full px-6 py-4 bg-[#fdf9f6] border-b border-surface-container-low sticky top-0 z-10">
        <button 
          onClick={onClose}
          aria-label="Close" 
          className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container transition-colors text-primary"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex-grow text-center">
          <h1 className="text-xl font-serif font-bold text-earth-dark">New Ritual</h1>
        </div>
        <div className="w-10"></div> {/* Spacer to balance header */}
      </header>

      {/* Main Content Form */}
      <main className="flex-1 flex flex-col items-center overflow-y-auto px-6 py-6 pb-32">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[#ffffff] rounded-3xl p-6 border border-outline-variant/20 shadow-[0_8px_32px_0_rgba(64,48,29,0.05)] flex flex-col gap-6">
          
          {/* Ritual Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-outline uppercase tracking-widest" htmlFor="habit-name">Ritual Name</label>
            <input 
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-earth-dark focus:ring-0 text-xl font-serif text-earth-dark placeholder:text-outline-variant py-2 transition-colors outline-none" 
              id="habit-name" 
              placeholder="e.g., Morning Meditation" 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Frequency Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-outline uppercase tracking-widest">Frequency</label>
            <div className="flex bg-[#f1edea] p-1 rounded-full relative">
              {['Daily', 'Weekly', 'Custom'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  className={`flex-1 py-2 text-center text-sm font-semibold rounded-full transition-all relative z-10 ${
                    frequency === freq 
                      ? 'bg-white text-earth-dark shadow-sm' 
                      : 'text-outline hover:text-earth-dark'
                  }`}
                  onClick={() => setFrequency(freq)}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-outline uppercase tracking-widest">Category</label>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 py-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[70px] border transition-all ${
                      isSelected 
                        ? 'bg-earth-dark border-earth-dark text-white' 
                        : 'bg-[#f7f3f0] border-transparent text-on-surface-variant hover:border-earth-dark/20'
                    }`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-lg ${
                      isSelected ? 'bg-white/10' : 'bg-white'
                    }`}>
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Picker Trigger */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-outline uppercase tracking-widest">When should we remind you?</label>
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowTimePicker(!showTimePicker)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[#f7f3f0] border border-outline-variant/30 hover:border-earth-dark/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3 text-earth-dark">
                  <Clock className="w-5 h-5 text-outline" />
                  <span className="text-base font-semibold">{reminderTime}</span>
                </div>
              </button>
              
              {showTimePicker && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-outline-variant/20 rounded-xl shadow-lg z-20 flex gap-2 justify-center">
                  <input 
                    type="time" 
                    className="border border-outline-variant/30 rounded px-2 py-1 outline-none text-earth-dark"
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const ampm = hours >= 12 ? 'PM' : 'AM';
                      const formattedHours = hours % 12 || 12;
                      setReminderTime(`${String(formattedHours).padStart(2, '0')}:${minutes} ${ampm}`);
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowTimePicker(false)}
                    className="bg-earth-dark text-white px-4 py-1 rounded text-sm font-bold"
                  >
                    Set
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </main>

      {/* Floating Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent flex justify-center">
        <button 
          onClick={handleSubmit}
          className="w-full max-w-lg bg-[#40301d] text-[#af977e] hover:bg-opacity-90 active:scale-95 transition-all text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg"
        >
          <span>Create Ritual</span>
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NewRitualModal;
