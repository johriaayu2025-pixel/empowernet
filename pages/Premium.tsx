
import React from 'react';
import { Zap, ShieldCheck, Crown, Check, X, Info } from 'lucide-react';

const Premium: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/ forever',
      icon: <ShieldCheck className="text-gray-400" size={32} />,
      features: [
        { label: '5 scans per day', included: true },
        { label: 'Basic threat detection', included: true },
        { label: 'Email alerts', included: true },
        { label: '7-day history', included: true },
        { label: 'Community support', included: true },
        { label: 'No deepfake detection', included: false },
        { label: 'No PDF reports', included: false },
        { label: 'Limited analytics', included: false },
      ],
      current: true,
      buttonText: 'Current Plan',
      buttonClass: 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
    },
    {
      name: 'Plus',
      price: '$9.99',
      period: '/ per month',
      popular: true,
      icon: <Zap className="text-violet-600" size={32} />,
      features: [
        { label: '50 scans per day', included: true },
        { label: 'Advanced AI detection', included: true },
        { label: 'Deepfake detection', included: true },
        { label: 'Real-time alerts', included: true },
        { label: '30-day history', included: true },
        { label: 'PDF report export', included: true },
        { label: 'Priority support', included: true },
        { label: 'Multi-device sync', included: true },
      ],
      buttonText: 'Upgrade to Plus',
      buttonClass: 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-100'
    },
    {
      name: 'Pro',
      price: '$29.99',
      period: '/ per month',
      icon: <Crown className="text-indigo-600" size={32} />,
      features: [
        { label: 'Unlimited scans', included: true },
        { label: 'Enterprise-grade AI', included: true },
        { label: 'Advanced deepfake detection', included: true },
        { label: 'Instant notifications', included: true },
        { label: 'Unlimited history', included: true },
        { label: 'Custom PDF reports', included: true },
        { label: 'Forensic ledger verification', included: true },
        { label: 'API access', included: true },
      ],
      buttonText: 'Upgrade to Pro',
      buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Premium Plans</p>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white transition-colors">Choose Your Protection Level</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Upgrade to unlock advanced AI detection, deepfake analysis, and premium features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 border ${plan.popular ? 'border-violet-400 ring-4 ring-violet-50 dark:ring-violet-900/20' : 'border-gray-100 dark:border-gray-700'} shadow-sm flex flex-col transition-all hover:scale-[1.02]`}>
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-lg">POPULAR</span>
            )}
            <div className="mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6">
                {plan.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">{plan.period}</span>
              </div>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feat, fi) => (
                <div key={fi} className="flex items-start gap-3">
                  {feat.included ? (
                    <Check size={18} className="text-green-500 mt-0.5" />
                  ) : (
                    <X size={18} className="text-gray-300 dark:text-gray-600 mt-0.5" />
                  )}
                  <span className={`text-sm ${feat.included ? 'text-gray-600 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>{feat.label}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${plan.buttonClass}`}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-8 border-b border-gray-50 dark:border-gray-700">
          <h3 className="text-xl font-bold dark:text-white">Feature Comparison</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Compare all features across plans</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <th className="px-8 py-4">Feature</th>
                <th className="px-8 py-4">Free</th>
                <th className="px-8 py-4 text-violet-600 dark:text-violet-400">Plus</th>
                <th className="px-8 py-4 text-indigo-600 dark:text-indigo-400">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">
              {[
                { name: 'Daily Scans', free: '5', plus: '50', pro: 'Unlimited' },
                { name: 'Deepfake Detection', free: false, plus: true, pro: true },
                { name: 'PDF Reports', free: false, plus: true, pro: true },
                { name: 'Forensic Proof Archival', free: false, plus: false, pro: true },
                { name: 'API Access', free: false, plus: false, pro: true },
                { name: 'Support', free: 'Community', plus: 'Priority', pro: 'Dedicated' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/30">
                  <td className="px-8 py-4">{row.name}</td>
                  <td className="px-8 py-4">{typeof row.free === 'boolean' ? (row.free ? <Check size={16} className="text-green-500" /> : '—') : row.free}</td>
                  <td className="px-8 py-4">{typeof row.plus === 'boolean' ? (row.plus ? <Check size={16} className="text-green-500" /> : '—') : row.plus}</td>
                  <td className="px-8 py-4">{typeof row.pro === 'boolean' ? (row.pro ? <Check size={16} className="text-green-500" /> : '—') : row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { q: 'Can I switch plans anytime?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit cards and PayPal.' },
            { q: 'Is there a free trial for premium plans?', a: 'Yes! All premium plans come with a 14-day free trial. No credit card required.' }
          ].map((faq, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">{faq.q}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Premium;
