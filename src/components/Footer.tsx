import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="border-t border-purple-500/20 bg-slate-950 text-white pt-16 pb-12 px-6 md:px-12 mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-purple-300 font-bold text-lg font-serif">
                  S
                </div>
              </div>
              <span className="text-2xl font-bold tracking-wider font-serif bg-gradient-to-r from-purple-300 via-purple-100 to-indigo-300 bg-clip-text text-transparent">
                STYLORA
              </span>
            </div>

            <p className="text-xs text-purple-200/70 max-w-sm font-light leading-relaxed">
              Style Smarter. Spend Less. Dress Sustainably. The luxury AI-powered fashion platform connecting
              generative 3D virtual fittings, personal color analysis, and peer-to-peer student circular fashion.
            </p>

            <div className="text-[11px] font-mono text-purple-400">
              © 2026 STYLORA Inc. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-mono text-purple-300 uppercase tracking-wider font-semibold">Platform Features</h4>
            <ul className="space-y-2 text-purple-200/70 font-light">
              <li><a href="#hero" className="hover:text-purple-300">3D Runway Scroll Story</a></li>
              <li><a href="#closet" className="hover:text-purple-300">AI Smart Closet</a></li>
              <li><a href="#tryon" className="hover:text-purple-300">Virtual Fitting Room</a></li>
              <li><a href="#color" className="hover:text-purple-300">Korean Color Analysis</a></li>
              <li><a href="#bodyshape" className="hover:text-purple-300">3D Body Shape Analyzer</a></li>
              <li><a href="#marketplace" className="hover:text-purple-300">Student Marketplace</a></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-mono text-purple-300 uppercase tracking-wider font-semibold">Join Haute Couture Club</h4>
            <p className="text-xs text-purple-200/70 font-light">
              Subscribe to receive weekly AI runway trend reports and earn +200 Green Points instantly!
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter college email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg hover:opacity-90"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {subscribed && (
              <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>+200 Green Points added to your STYLORA account!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
