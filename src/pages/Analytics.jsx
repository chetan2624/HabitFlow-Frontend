import { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Line } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
// import { Tooltip as ReactTooltip } from 'react-tooltip';
import { subYears, format } from 'date-fns';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Award, Calendar } from 'lucide-react';

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
           api.get('/logs'), // Adjust backend to return all logs if needed, or query for year
           api.get('/analytics/correlation')
        ]);
        setStats(statsRes.data);
        setCorrelationData(correlationRes.data.reverse()); // Data is provided back-to-front from API
        
        // Process logs for heatmap: [{ date: '2023-01-01', count: 3 }]
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

  if (!stats) return <div className="p-8">Loading analytics...</div>;

  const today = new Date();
  const startDate = subYears(today, 1);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Performance Analytics</h1>
        <p className="text-slate-500 font-medium text-lg">Measure what matters. Your consistency over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-sm mb-2">Weekly Completion</p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">{stats.completionRate}%</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-sm mb-2">Total Habits Tracked</p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">{stats.totalHabits}</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-sm mb-2">Month to Date</p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">{heatmapData.filter(d => d.date.startsWith(format(today, 'yyyy-MM'))).reduce((a, b) => a + b.count, 0)} Logs</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
           <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Weekly Performance</h3>
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats.weekStats}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                 <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="score" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Dynamic Insights</h3>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 p-6 rounded-2xl">
              <p className="text-slate-700 dark:text-slate-300 mb-4 font-medium">
                {user?.profileInfo?.healthConditions?.length > 0
                  ? `With your health condition (${user.profileInfo.healthConditions.join(', ')}), consistency is key.`
                  : "Based on your recent logs, tracking habits steadily improves your mood."}
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {correlationData.some(d => d.energyLevel > 0)
                  ? "We observed a positive correlation between completing your habits and elevated energy levels on your mood tracker. Keep it up!"
                  : "Start logging your mood to uncover how your habits impact your daily energy levels."}
              </p>
            </div>
        </div>
      </div>

      {/* Correlation Chart */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mb-12">
        <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Habit Completion vs. Energy Level (Last 14 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              <Bar yAxisId="left" dataKey="habitsCompleted" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} name="Habits Completed" />
              <Line yAxisId="right" type="monotone" dataKey="energyLevel" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} name="Energy Level (1-100)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
        <h3 className="text-xl font-bold mb-8 text-slate-900 dark:text-white text-center">1 Year Heatmap</h3>
        <div className="min-w-[800px]">
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={heatmapData}
            classForValue={(value) => {
              if (!value || value.count === 0) return 'fill-slate-100 dark:fill-slate-700';
              if (value.count === 1) return 'fill-primary-200';
              if (value.count === 2) return 'fill-primary-400';
              if (value.count === 3) return 'fill-primary-600';
              return 'fill-primary-800';
            }}
            showWeekdayLabels={true}
          />
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .react-calendar-heatmap rect { rx: 3; ry: 3; stroke: #fff; stroke-width: 2px; }
          .dark .react-calendar-heatmap rect { stroke: #1e293b; }
          .react-calendar-heatmap text { font-size: 8px; fill: #64748b; }
        `}} />
      </div>

    </div>
  );
};

export default Analytics;
