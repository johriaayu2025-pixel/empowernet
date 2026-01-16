import React from 'react';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  Database,
  Image as ImageIcon,
  Mic,
  MessageSquare,
  ArrowUpRight,
  ExternalLink,
  Scan
} from 'lucide-react';

import { useAppStore } from '../store/useAppStore';

interface DashboardProps {
  setCurrentPage: (page: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {

  /* ===============================
     DYNAMIC STORE ACCESS
  ================================ */
  const statsData = useAppStore(state => state.stats);
  const rawAlerts = useAppStore(state => state.alerts);
  const alertsData = Array.isArray(rawAlerts) ? rawAlerts.slice(0, 3) : [];

  const stats = [
    {
      label: 'Scans Detected Today',
      value: statsData.scansToday.toString(),
      trend: statsData.scansToday > 0 ? '+12%' : '0%',
      icon: <ShieldCheck className="text-violet-600" />,
      bgColor: 'bg-violet-50'
    },
    {
      label: 'Users Protected',
      value: statsData.protectedUsers.toLocaleString(),
      trend: '+0.5%',
      icon: <Users className="text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Threats Blocked',
      value: statsData.activeThreats.toString(),
      trend: statsData.activeThreats > 0 ? '+18%' : '0%',
      icon: <AlertTriangle className="text-red-600" />,
      bgColor: 'bg-red-50'
    },
    {
      label: 'Evidence Records',
      value: statsData.evidenceRecords.toString(),
      trend: statsData.evidenceRecords > 0 ? '+5%' : '0%',
      icon: <Database className="text-green-600" />,
      bgColor: 'bg-green-50'
    },
  ];

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/20 rounded-xl">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">EmpowerNet Dashboard</h1>
            <p className="opacity-90">Real-time AI-powered protection against digital threats</p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} dark:bg-opacity-10`}>{stat.icon}</div>
              <span className="text-green-500 text-xs font-bold flex items-center">
                {stat.trend} <ArrowUpRight size={12} className="ml-1" />
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* QUICK SCANS (Center Column - taking 2/3 if on large screens) */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
            <Scan className="text-violet-600 dark:text-violet-400" size={20} />
            Instant AI Forensics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div onClick={() => setCurrentPage('deepfake')} className="cursor-pointer p-5 rounded-2xl bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors border border-violet-100/50 dark:border-violet-800/50">
              <div className="p-2 bg-violet-600 text-white rounded-lg w-fit mb-3">
                <ImageIcon size={20} />
              </div>
              <h4 className="font-bold text-sm mb-1 dark:text-gray-200">Deepfake</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Scan media files</p>
            </div>

            <div onClick={() => setCurrentPage('scan')} className="cursor-pointer p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-100/50 dark:border-blue-800/50">
              <div className="p-2 bg-blue-600 text-white rounded-lg w-fit mb-3">
                <Mic size={20} />
              </div>
              <h4 className="font-bold text-sm mb-1 dark:text-gray-200">Voice Clone</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Analyze audio</p>
            </div>

            <div onClick={() => setCurrentPage('scan')} className="cursor-pointer p-5 rounded-2xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors border border-orange-100/50 dark:border-orange-800/50">
              <div className="p-2 bg-orange-600 text-white rounded-lg w-fit mb-3">
                <MessageSquare size={20} />
              </div>
              <h4 className="font-bold text-sm mb-1 dark:text-gray-200">Scam Text</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Emails & SMS</p>
            </div>
          </div>

          <button onClick={() => setCurrentPage('scan')} className="w-full mt-6 py-4 bg-violet-600 dark:bg-violet-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-violet-700 dark:hover:bg-violet-600 transition-all active:scale-[0.98] shadow-lg shadow-violet-200 dark:shadow-none">
            <Scan size={20} /> Start a New Scan
          </button>
        </div>

        {/* SIDEBAR: ALERTS & STATUS */}
        <div className="space-y-6">
          {/* ALERTS */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm grow transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                <AlertTriangle className="text-red-500 dark:text-red-400" size={20} />
                Recent Alerts
              </h2>
              <button onClick={() => setCurrentPage('alerts')} className="text-xs text-violet-600 dark:text-violet-400 font-bold hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {alertsData.length === 0 ? (
                <div className="py-8 text-center bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-400 dark:text-gray-500">No active threats detected</p>
                </div>
              ) : (
                alertsData.map((alert: any, i: number) => (
                  <div key={i} className={`p-3 rounded-xl border-l-4 ${alert.severity === 'CRITICAL' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'}`}>
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate pr-2">{alert.type}</p>
                      <span className="text-[8px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{alert.source}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
              <Database className="text-green-600 dark:text-green-400" size={20} />
              Protection Engine
            </h2>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">Real-time Guard</span>
                </div>
                <span className="text-[10px] font-black text-green-600 dark:text-green-500">ACTIVE</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 text-center">
                  <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5">Accuracy</p>
                  <p className="text-xs font-black text-gray-900 dark:text-gray-100">99.8%</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 text-center">
                  <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5">Latency</p>
                  <p className="text-xs font-black text-gray-900 dark:text-gray-100">&lt;150ms</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('evidence')}
              className="w-full mt-4 py-3 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View Public Ledger Proofs <ExternalLink size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
