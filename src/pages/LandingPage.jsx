import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Award, Zap, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const heroSlides = [
    {
      image: '/photos/hero-1.jpg',
      title: 'The Art of Mindful Momentum',
      subtitle: 'Elevate your daily discipline through a premium habit tracking experience\ndesigned for the intentional mind.'
    },
    {
      image: '/photos/hero-2.jpg',
      title: 'Cultivate Deep Peace',
      subtitle: 'Find clarity in your daily routines. Log your habits seamlessly\nand uncover the patterns of your life.'
    },
    {
      image: '/photos/hero-3.jpg',
      title: 'Reflect and Grow',
      subtitle: 'Every small step builds your future. Use our weekly reviews\nto reflect on your biggest wins.'
    },
    {
      image: '/photos/hero-4.jpg',
      title: 'Stay Grounded',
      subtitle: 'Master your habits, master your life. Keep it gentle,\nno pressure to be perfect.'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Tracker', path: '/tracker' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Goals', path: '/goals' },
    { name: 'Review', path: '/review' },
    { name: 'Mood', path: '/mood' },
  ];

  return (
    <div className="bg-editorial-50 min-h-screen">
      {/* HERO SECTION */}
      <div className="relative h-screen w-full overflow-hidden bg-editorial-900">
        {/* Navbar */}
        <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8">
          <div className="flex items-center gap-12">
            <Link to="/home" className="flex items-center gap-3 text-primary-400 hover:text-primary-300 transition-colors z-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21v-5h5"></path><path d="m9 12 2 2 4-4"></path></svg>
              <span className="text-xl font-bold tracking-widest uppercase font-serif text-white">HabitFlow</span>
            </Link>
            <div className="hidden lg:flex items-center gap-6 text-white/80 font-medium text-sm">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path} className="hover:text-primary-400 transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link to="/login" className="text-white font-medium hover:text-primary-200 transition-colors">Log In</Link>
                <Link to="/signup" className="text-editorial-900 bg-primary-500 hover:bg-primary-600 px-6 py-2.5 rounded-full font-bold transition-colors">Sign Up</Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-white/80 text-sm">Welcome back, {user.name}</span>
                <Link to="/dashboard" className="text-editorial-900 bg-primary-500 hover:bg-primary-600 px-6 py-2.5 rounded-full font-bold transition-colors">Dashboard</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2 z-50 focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden absolute top-0 left-0 w-full bg-editorial-900/95 backdrop-blur-xl border-b border-white/10 z-40 flex flex-col pt-24 pb-8 px-6 gap-6 shadow-2xl transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
          <div className="flex flex-col gap-4 text-center">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} className="text-white/80 text-lg font-medium py-2 hover:text-primary-400" onClick={() => setMobileMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
          </div>
          <div className="h-px w-full bg-white/10 my-2"></div>
          <div className="flex flex-col gap-4">
            {!user ? (
              <>
                <Link to="/login" className="text-white font-medium py-3 text-center border border-white/20 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                <Link to="/signup" className="text-editorial-900 bg-primary-500 py-3 text-center rounded-xl font-bold" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <Link to="/dashboard" className="text-editorial-900 bg-primary-500 py-3 text-center rounded-xl font-bold" onClick={() => setMobileMenuOpen(false)}>Go to Dashboard</Link>
            )}
          </div>
        </div>

        {/* Carousel Backgrounds */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.image} alt={`Hero ${index + 1}`} className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-editorial-900 via-transparent to-editorial-900/50"></div>
          </div>
        ))}

        {/* Carousel Text & CTAs */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 mt-16 md:mt-0">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="mb-8 px-4 py-1.5 border border-white/20 rounded-full text-xs font-medium text-white tracking-widest uppercase flex items-center gap-2 backdrop-blur-sm bg-white/5">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              Mindful, Not Militant
            </div>
            
            {/* CSS Grid to perfectly overlap texts without absolute positioning limits */}
            <div className="grid grid-cols-1 grid-rows-1 place-items-center mb-10 w-full min-h-[160px] md:min-h-[200px]">
              {heroSlides.map((slide, index) => (
                <div key={index} className={`col-start-1 row-start-1 w-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 transform-none z-10' : 'opacity-0 translate-y-8 pointer-events-none z-0'}`}>
                  <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-4 md:mb-6 tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/80 whitespace-pre-line max-w-2xl font-light">
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate(user ? '/dashboard' : '/signup')} 
                className="bg-primary-500 hover:bg-primary-600 text-editorial-900 px-8 py-3.5 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {user ? 'Go to Dashboard' : 'Start Your Journey'} <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#features" className="border border-white/30 hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-medium transition-all backdrop-blur-sm flex items-center justify-center">
                Explore Method
              </a>
            </div>
            
            {/* Slider Dots */}
            <div className="flex gap-2 mt-12">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-primary-500' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-editorial-50 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-editorial-900 mb-4">A gentle approach to discipline</h2>
            <p className="text-xl text-editorial-500 max-w-2xl mx-auto">HabitFlow is designed to help you build consistency without the guilt. Focus on small wins, daily rituals, and long-term growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-editorial-100 border border-editorial-200 rounded-3xl p-8 flex flex-col h-full hover:shadow-lg transition-shadow group">
              <div className="mb-8 rounded-2xl bg-white aspect-[4/3] flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-primary-100 group-hover:opacity-40 transition-opacity"></div>
                <img src="/new-assests/character/Indoor bike-amico.svg" alt="Matrix Tracker" className="h-32 object-contain relative z-10" />
              </div>
              <div className="mt-auto">
                <div className="inline-flex items-center gap-2 bg-editorial-200 text-editorial-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                  Feature
                </div>
                <h3 className="text-2xl font-serif text-editorial-900 mb-3">Matrix Tracker</h3>
                <p className="text-editorial-500 leading-relaxed">Visualize your consistency with our beautiful, intuitive habit matrix. See the big picture of your progress effortlessly.</p>
              </div>
            </div>

            <div className="bg-editorial-100 border border-editorial-200 rounded-3xl p-8 flex flex-col h-full hover:shadow-lg transition-shadow group">
              <div className="mb-8 rounded-2xl bg-white aspect-[4/3] flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-sage-100 group-hover:opacity-40 transition-opacity"></div>
                <img src="/new-assests/character/Oral care-pana.svg" alt="Insights" className="h-32 object-contain relative z-10" />
              </div>
              <div className="mt-auto">
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                  Insights
                </div>
                <h3 className="text-2xl font-serif text-editorial-900 mb-3">Deep Analytics</h3>
                <p className="text-editorial-500 leading-relaxed">Understand your patterns with advanced charts. Discover which days you thrive and where you need more gentle support.</p>
              </div>
            </div>

            <div className="bg-editorial-100 border border-editorial-200 rounded-3xl p-8 flex flex-col h-full hover:shadow-lg transition-shadow group">
              <div className="mb-8 rounded-2xl bg-white aspect-[4/3] flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-blue-100 group-hover:opacity-40 transition-opacity"></div>
                <img src="/new-assests/character/Morning essential-pana.svg" alt="Focus" className="h-32 object-contain relative z-10" />
              </div>
              <div className="mt-auto">
                <div className="inline-flex items-center gap-2 bg-editorial-200 text-editorial-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                  Focus
                </div>
                <h3 className="text-2xl font-serif text-editorial-900 mb-3">Pomodoro Timer</h3>
                <p className="text-editorial-500 leading-relaxed">Enter a state of deep work with our built-in focus timer. Block out distractions and fully immerse yourself in the task.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
