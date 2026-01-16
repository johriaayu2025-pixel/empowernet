
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Moon, Sun, Shield, Save, Key, CreditCard, RefreshCw, LogOut } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const SettingsPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState({ name: 'Demo User', email: 'demo@empowernet.ai' });
  const { theme, setTheme } = useAppStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    alerts: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem('user_profile');
    if (profile) setUserProfile(JSON.parse(profile));
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <header className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Configure your AI protection preferences and account security</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-violet-700 transition-all shadow-xl shadow-violet-100 disabled:opacity-50 active:scale-95"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Save Configuration
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: PRIMARY SETTINGS */}
        <div className="lg:col-span-8 space-y-8">

          {/* ACCOUNT CARD */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold dark:text-white">Identity & Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Legal Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={e => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-violet-500/10 transition-all dark:text-white font-medium"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="email"
                    disabled
                    value={userProfile.email}
                    className="w-full pl-11 pr-4 py-4 bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none opacity-50 cursor-not-allowed dark:text-gray-400 font-medium"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECURITY CARD */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-bold dark:text-white">Security & Guard</h2>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-50 dark:border-gray-700 flex items-center justify-between group cursor-pointer hover:border-violet-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl text-gray-400 group-hover:text-violet-600 transition-colors"><Key size={20} /></div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">Multi-Factor Authentication</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of protection to your account</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase">Enabled</div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-50 dark:border-gray-700 flex items-center justify-between group cursor-pointer hover:border-violet-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl text-gray-400 group-hover:text-violet-600 transition-colors"><Shield size={20} /></div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">Forensic Ledger Anchoring</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically anchor all forensic scans to Hedera Hashgraph</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-violet-600 rounded-full relative"><div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" /></div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: PREFERENCES & UTILITIES */}
        <div className="lg:col-span-4 space-y-8">

          {/* APPEARANCE */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white">
              {theme === 'dark' ? <Moon className="text-violet-400" size={18} /> : <Sun className="text-violet-600" size={18} />}
              Visual Theme
            </h2>
            <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-900 rounded-2xl">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${theme === 'light' ? 'bg-white shadow-md text-violet-600' : 'text-gray-400'}`}
              >
                <Sun size={14} /> LIGHT
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${theme === 'dark' ? 'bg-white dark:bg-gray-800 text-violet-400 shadow-md' : 'text-gray-400'}`}
              >
                <Moon size={14} /> DARK
              </button>
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white"><Bell className="text-blue-500" size={18} /> Alerts Feed</h2>
            <div className="space-y-6">
              {[
                { id: 'email', label: 'Email Reports', desc: 'Weekly summaries' },
                { id: 'push', label: 'Push Alerts', desc: 'Real-time popups' },
                { id: 'alerts', label: 'High-Risk SMS', desc: 'Critical threat alerts' }
              ].map(pref => (
                <div key={pref.id} className="flex items-center justify-between">
                  <div className="max-w-[140px]">
                    <p className="text-sm font-bold text-gray-700 dark:text-white">{pref.label}</p>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">{pref.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [pref.id]: !notifications[pref.id as keyof typeof notifications] })}
                    className={`w-10 h-5 rounded-full relative transition-all ${notifications[pref.id as keyof typeof notifications] ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-800'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notifications[pref.id as keyof typeof notifications] ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* SUBSCRIPTION */}
          <section className="bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-2xl shadow-violet-200 overflow-hidden relative group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/20 rounded-2xl"><CreditCard size={24} /></div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Enterprise</span>
              </div>
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Active Plan</p>
              <p className="text-3xl font-black mb-6 tracking-tight">Plus Forensic</p>
              <button className="w-full py-4 bg-white text-violet-600 rounded-2xl text-xs font-black shadow-lg hover:bg-gray-50 transition-all uppercase tracking-widest active:scale-95">Manage Subscription</button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:scale-150"></div>
          </section>

          <button
            onClick={() => { localStorage.removeItem('auth_token'); window.location.reload(); }}
            className="w-full p-6 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-[32px] font-black text-xs flex items-center justify-center gap-3 border border-red-100 dark:border-red-900/20 hover:bg-red-100 transition-all uppercase tracking-widest"
          >
            <LogOut size={18} /> Sign Out Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
