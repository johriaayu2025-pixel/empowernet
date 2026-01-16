import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { ShieldAlert, CheckCircle2, TrendingUp, Search, Filter, Calendar, Eye, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const HistoryAnalytics: React.FC = () => {

  /* ===============================
     SAFE STORE ACCESS
  ================================ */
  const rawScans = useAppStore(state => state.scans);
  const scans = Array.isArray(rawScans) ? rawScans : [];

  /* ===============================
     DERIVED STATS
  ================================ */
  const threatCount = scans.filter(s => s.status !== 'safe').length;
  const safeCount = scans.filter(s => s.status === 'safe').length;
  const threatRate = scans.length > 0
    ? ((threatCount / scans.length) * 100).toFixed(1)
    : '0';

  /* ===============================
     AREA CHART DATA
  ================================ */
  const activityData = useMemo(() => {
    const daily: Record<string, { scans: number; threats: number }> = {};

    scans.forEach(s => {
      const dateKey = s.date?.split(',')[0] ?? 'Unknown';
      if (!daily[dateKey]) daily[dateKey] = { scans: 0, threats: 0 };
      daily[dateKey].scans += 1;
      if (s.status !== 'safe') daily[dateKey].threats += 1;
    });

    return Object.entries(daily)
      .map(([name, vals]) => ({ name, ...vals }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
      .slice(-7);
  }, [scans]);

  /* ===============================
     BAR CHART DATA
  ================================ */
  const distributionData = useMemo(() => {
    const counts: Record<string, number> = {
      'Deepfakes': 0,
      'Phishing': 0,
      'Safe Content': 0,
      'Other': 0
    };

    scans.forEach(s => {
      if (s.status === 'safe') counts['Safe Content'] += 1;
      else if (s.tag === 'Deepfake') counts['Deepfakes'] += 1;
      else if (s.tag === 'Fraudulent') counts['Phishing'] += 1;
      else counts['Other'] += 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [scans]);

  /* ===============================
     CSV EXPORT
  ================================ */
  const exportCSV = () => {
    if (scans.length === 0) return;

    const headers = ['Date', 'Type', 'Label', 'Status', 'Confidence', 'Evidence Hash'];
    const rows = scans.map(s => [
      s.date, s.type, s.label, s.status, s.confidence, s.hash
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') + '\n' +
      rows.map(r => r.join(',')).join('\n');

    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `EmpowerNet_Report_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white transition-colors">Scan History & Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400">Track your security scans and threat patterns</p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 dark:bg-violet-500 text-white rounded-xl font-bold hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Scans', value: scans.length, icon: <Search />, color: 'violet' },
          { label: 'Threats Detected', value: threatCount, icon: <ShieldAlert />, color: 'red' },
          { label: 'Safe Content', value: safeCount, icon: <CheckCircle2 />, color: 'green' },
          { label: 'Threat Rate', value: `${threatRate}%`, icon: <TrendingUp />, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <h3 className="text-2xl font-bold dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <h3 className="font-bold mb-4 dark:text-white">Scan Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} />
                <Area type="monotone" dataKey="scans" stroke="#8b5cf6" fillOpacity={0.2} fill="#8b5cf6" />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <h3 className="font-bold mb-4 dark:text-white">Threat Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* HISTORY LIST */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
        <h3 className="font-bold mb-4 dark:text-white">Live History Feed ({scans.length})</h3>

        {scans.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500">No scans recorded yet.</p>
        )}

        <div className="space-y-3">
          {scans.map((row, i) => (
            <div key={i} className="flex justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-transparent dark:border-gray-700 hover:border-violet-100 dark:hover:border-violet-900/50 transition-all">
              <div className="flex items-center gap-4">
                <Eye className="text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="font-bold dark:text-gray-200">{row.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{row.date}</p>
                </div>
              </div>
              <span className={`text-xs font-bold ${row.status === 'safe' ? 'text-green-500' : 'text-red-500'}`}>
                {row.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HistoryAnalytics;
