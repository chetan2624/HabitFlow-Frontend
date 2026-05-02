import { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Line } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subYears, format } from 'date-fns';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Award, Calendar, Lightbulb } from 'lucide-react';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, logsRes, correlationRes] = await Promise.all([
           api.get('/analytics/stats'),
           api.get('/logs'),
           api.get('/analytics/correlation')
        ]);
        setStats(statsRes.data);
        setCorrelationData(correlationRes.data.reverse());
        
        const counts = {};
        logsRes.data.forEach(log => {
          if (log.status) {
            counts[log.date] = (counts[log.date] || 0) + 1;
          }
        });
        
        const mappedData = Object.keys(counts).map(date => ({
          date: date,
          count: counts[date]
        }));
        
        setHeatmapData(mappedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!stats) return <div className="p-8 min-h-screen bg-editorial-50 flex items-center justify-center text-editorial-500 font-medium">Gathering your insights... (Make sure MongoDB is running!)</div>;

  const today = new Date();
  const startDate = subYears(today, 1);

  // Safely format chart data
  const chartData = stats.weekStats?.map(d => ({
    day: d.date.slice(5).replace('-', '/'),
    score: d.score
  })) || [];

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto min-h-screen bg-editorial-50">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" /> Performance Analytics
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-editorial-900 mb-3">Measure what matters</h1>
          <p className="text-editorial-500 font-medium text-lg max-w-md">Your consistency over time visualized in beautiful clarity.</p>
        </div>
        
        <div className="flex items-end relative z-10 w-full lg:w-auto mt-4 lg:mt-0">
          <img src="/new-assests/undraw_healthy-habit_2ata.svg" alt="Analytics" className="h-32 lg:absolute lg:-top-10 lg:-left-48 object-contain hidden lg:block drop-shadow-md" />
        </div>
      </div>

      {/* Top 3 KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-editorial-500 font-medium text-sm tracking-widest uppercase">Weekly Completion</span>
          </div>
          <h3 className="text-5xl font-serif text-editorial-900">
            {stats.weekStats?.length > 0 ? Math.round((stats.weekStats.filter(d=>d.score>0).length / 7) * 100) : 0}%
          </h3>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-editorial-500 font-medium text-sm tracking-widest uppercase">Total Rituals</span>
          </div>
          <h3 className="text-5xl font-serif text-editorial-900">{stats.totalHabits}</h3>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-editorial-500 font-medium text-sm tracking-widest uppercase">Month to Date</span>
          </div>
          <h3 className="text-5xl font-serif text-editorial-900">
            {heatmapData.filter(d => d.date.startsWith(format(today, 'yyyy-MM'))).reduce((a, b) => a + b.count, 0)}
            <span className="text-lg text-editorial-400 font-sans font-medium ml-2">Logs</span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Weekly Performance Bar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200">
           <h3 className="text-2xl font-serif text-editorial-900 mb-8">Weekly Performance</h3>
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#8b8a87', fontSize: 12}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#8b8a87', fontSize: 12}} dx={-10} />
                 <RechartsTooltip cursor={{fill: '#faf9f7'}} contentStyle={{borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontFamily: 'Inter'}} />
                 <Bar dataKey="score" fill="#F5A623" radius={[8, 8, 0, 0]} maxBarSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Dynamic Insights */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-5">
              <Lightbulb className="w-64 h-64" />
            </div>
            <h3 className="text-2xl font-serif text-editorial-900 mb-6 relative z-10">Dynamic Insights</h3>
            <div className="bg-editorial-50 border border-editorial-200 p-8 rounded-2xl relative z-10 shadow-inner">
              <p className="text-editorial-700 mb-5 font-medium leading-relaxed">
                {user?.profileInfo?.healthConditions?.length > 0
                  ? `With your health condition (${user.profileInfo.healthConditions.join(', ')}), consistency is key.`
                  : "Based on your recent logs, tracking habits steadily improves your mood."}
              </p>
              <div className="h-px w-full bg-editorial-200 mb-5"></div>
              <p className="text-editorial-700 font-medium leading-relaxed">
                {correlationData.some(d => d.energyLevel > 0)
                  ? "We observed a positive correlation between completing your habits and elevated energy levels on your mood tracker. Keep it up!"
                  : "Start logging your mood to uncover how your habits impact your daily energy levels."}
              </p>
            </div>
        </div>
      </div>

      {/* Correlation Chart */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 mb-12">
        <h3 className="text-2xl font-serif text-editorial-900 mb-8">Habit Completion vs. Energy Level (14 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#8b8a87', fontSize: 12}} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#8b8a87', fontSize: 12}} dx={-10} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#8b8a87', fontSize: 12}} dx={10} />
              <RechartsTooltip cursor={{fill: '#faf9f7'}} contentStyle={{borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontFamily: 'Inter'}} />
              <Bar yAxisId="left" dataKey="habitsCompleted" fill="#a4b49b" radius={[8, 8, 0, 0]} maxBarSize={40} name="Rituals Completed" />
              <Line yAxisId="right" type="monotone" dataKey="energyLevel" stroke="#1f2421" strokeWidth={3} dot={{r: 5, strokeWidth: 2, fill: '#fff'}} name="Energy Level (1-100)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-editorial-200 overflow-x-auto relative">
        <h3 className="text-2xl font-serif text-editorial-900 mb-10 text-center">Your Consistency Map</h3>
        <div className="min-w-[800px] max-w-4xl mx-auto px-4">
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={heatmapData}
            classForValue={(value) => {
              if (!value || value.count === 0) return 'fill-editorial-100';
              if (value.count === 1) return 'fill-sage-200';
              if (value.count === 2) return 'fill-sage-400';
              if (value.count === 3) return 'fill-sage-600';
              return 'fill-sage-800';
            }}
            showWeekdayLabels={true}
          />
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .react-calendar-heatmap rect { rx: 4; ry: 4; stroke: #fff; stroke-width: 2.5px; }
          .react-calendar-heatmap text { font-size: 8px; fill: #8b8a87; font-family: 'Inter', sans-serif; font-weight: 600; }
        `}} />
      </div>

    </div>
  );
};

export default Analytics;
