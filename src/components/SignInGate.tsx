import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Github,
  Globe,
  Camera,
  Layers,
  Shirt,
  Sparkle
} from 'lucide-react';
import { UserProfile } from '../types';

interface SignInGateProps {
  onSignIn: (user: UserProfile) => void;
}

const DEMO_PERSONAS: UserProfile[] = [
  {
    id: 'user_1',
    name: 'Maya Lin',
    email: 'maya.lin@parsons.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    college: 'Parsons School of Design',
    stylePreference: 'Haute Couture & Streetwear',
    sustainabilityScore: 920,
    isStudentVerified: true,
  },
  {
    id: 'user_2',
    name: 'Liam Vance',
    email: 'liam.vance@fitnyc.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    college: 'FIT New York',
    stylePreference: 'Minimalist & Tailored',
    sustainabilityScore: 840,
    isStudentVerified: true,
  },
  {
    id: 'user_3',
    name: 'Chloe Thorne',
    email: 'chloe.t@stanford.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    college: 'Stanford University',
    stylePreference: 'Eco-Luxury & Vintage',
    sustainabilityScore: 980,
    isStudentVerified: true,
  },
];

export const SignInGate: React.FC<SignInGateProps> = ({ onSignIn }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'student'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [college, setCollege] = useState<string>('Parsons School of Design');
  const [stylePreference, setStylePreference] = useState<string>('Avant-Garde & Vintage');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide your email and password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn({
        id: `user_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        college: email.includes('.edu') ? 'Verified Fashion University' : 'Stylora Member',
        stylePreference: 'AI Tailored Fashion',
        sustainabilityScore: 750,
        isStudentVerified: email.includes('.edu'),
        signedInAt: new Date().toISOString(),
      });
    }, 900);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setErrorMsg('Please fill in your name and email');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn({
        id: `user_${Date.now()}`,
        name: fullName,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        college: college,
        stylePreference: stylePreference,
        sustainabilityScore: 800,
        isStudentVerified: true,
        signedInAt: new Date().toISOString(),
      });
    }, 900);
  };

  const handleQuickDemoSignIn = (persona: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn({ ...persona, signedInAt: new Date().toISOString() });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/90 backdrop-blur-2xl">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full filter blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative w-full max-w-4xl bg-slate-900/90 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        
        {/* Left Side: Brand & Visual Preview Banner */}
        <div className="lg:col-span-5 relative p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-950/80 via-slate-950 to-indigo-950 border-r border-purple-500/20">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 p-0.5 flex items-center justify-center shadow-xl">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-purple-300 font-bold text-2xl font-serif">
                  S
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif tracking-wider bg-gradient-to-r from-purple-300 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
                  STYLORA
                </h1>
                <p className="text-[10px] font-mono tracking-widest text-purple-300/80 uppercase">
                  AI Haute Couture Platform
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold font-serif text-white leading-tight">
                Welcome to the Future of Personal Fashion & 3D Fitting
              </h2>
              <p className="text-xs text-purple-200/70 font-light leading-relaxed">
                Sign in to unlock real-time 3D AI Virtual Try-On, 4D fabric physics, personalized color seasonal analysis, and sustainable college fashion marketplace.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-purple-200/90 font-mono">
                <div className="p-1 rounded-lg bg-purple-500/20 border border-purple-500/40">
                  <Camera className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <span>Generative AI Virtual Try-On Studio</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-purple-200/90 font-mono">
                <div className="p-1 rounded-lg bg-purple-500/20 border border-purple-500/40">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span>4D Cloth Physics & Drapery Simulator</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-purple-200/90 font-mono">
                <div className="p-1 rounded-lg bg-purple-500/20 border border-purple-500/40">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span>Campus Student Fashion Marketplace</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-purple-500/20">
            <div className="flex items-center gap-2 text-[11px] text-purple-300/60 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted Student & Creator Authentication</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms & Persona Quick Login */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            {/* Header Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-purple-500/20">
                <button
                  onClick={() => { setActiveTab('signin'); setErrorMsg(null); }}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'signin'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'signup'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
                <button
                  onClick={() => { setActiveTab('student'); setErrorMsg(null); }}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'student'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  Student SSO
                </button>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>v2.4 AI Active</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-pink-950/50 border border-pink-500/30 text-pink-300 text-xs font-mono flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: Sign In Form */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-purple-300/80 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-purple-400/60" />
                    <input
                      type="email"
                      placeholder="fashionist@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/20 text-white text-xs placeholder:text-purple-300/30 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-purple-300/80 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-purple-400/60" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/20 text-white text-xs placeholder:text-purple-300/30 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 font-mono">
                      <Sparkles className="w-4 h-4 animate-spin text-pink-300" />
                      Authenticating STYLORA ID...
                    </span>
                  ) : (
                    <>
                      <span>Enter STYLORA Fashion Hub</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: Sign Up Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-purple-300/80 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-purple-400/60" />
                    <input
                      type="text"
                      placeholder="e.g. Maya Lin"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/20 text-white text-xs placeholder:text-purple-300/30 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-purple-300/80 mb-1">Email Address (.edu recommended)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-purple-400/60" />
                    <input
                      type="email"
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/20 text-white text-xs placeholder:text-purple-300/30 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-purple-300/80 mb-1">College / Institute</label>
                    <select
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                    >
                      <option value="Parsons School of Design">Parsons</option>
                      <option value="FIT New York">FIT New York</option>
                      <option value="Stanford University">Stanford</option>
                      <option value="London College of Fashion">LCF London</option>
                      <option value="Royal Academy of Arts">Royal Academy</option>
                      <option value="General Stylora Member">General Member</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-purple-300/80 mb-1">Style Aesthetic</label>
                    <select
                      value={stylePreference}
                      onChange={(e) => setStylePreference(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                    >
                      <option value="Haute Couture & Runway">Haute Couture</option>
                      <option value="Streetwear & Techwear">Streetwear</option>
                      <option value="Minimalist Luxury">Minimalist</option>
                      <option value="Eco-Sustain & Vintage">Eco Vintage</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 font-mono">
                      <Sparkles className="w-4 h-4 animate-spin text-pink-300" />
                      Creating AI Profile...
                    </span>
                  ) : (
                    <>
                      <span>Register & Unlock Full Website</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: Student SSO Quick Sign In */}
            {activeTab === 'student' && (
              <div className="mt-6 space-y-4">
                <p className="text-xs text-purple-300/70 font-mono">
                  Select your university credentials or click a student persona below to instantly verify your student discount and access the 3D runway & Virtual Try-On studio:
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    onClick={() => handleQuickDemoSignIn(DEMO_PERSONAS[0])}
                    className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/40 text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-white">Parsons School of Design SSO</div>
                        <div className="text-[10px] text-purple-300/60 font-mono">Instant verification (@parsons.edu)</div>
                      </div>
                    </div>
                    <span className="text-xs text-purple-300 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Verify & In <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickDemoSignIn(DEMO_PERSONAS[1])}
                    className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/40 text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-white">FIT New York Campus SSO</div>
                        <div className="text-[10px] text-purple-300/60 font-mono">Instant verification (@fitnyc.edu)</div>
                      </div>
                    </div>
                    <span className="text-xs text-purple-300 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Verify & In <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickDemoSignIn(DEMO_PERSONAS[2])}
                    className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/40 text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-white">Stanford Fashion Tech SSO</div>
                        <div className="text-[10px] text-purple-300/60 font-mono">Instant verification (@stanford.edu)</div>
                      </div>
                    </div>
                    <span className="text-xs text-purple-300 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Verify & In <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick One-Click Demo Account Presets */}
            <div className="mt-6 pt-6 border-t border-purple-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-purple-300/70 uppercase tracking-wider">
                  Or Quick Access as Demo Member
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> One-Click Access
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {DEMO_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleQuickDemoSignIn(p)}
                    className="p-2 rounded-xl bg-slate-950/80 border border-purple-500/20 hover:border-purple-400 hover:bg-purple-950/40 text-left transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover border border-purple-400" />
                      <div className="overflow-hidden">
                        <div className="text-[11px] font-bold text-white truncate">{p.name}</div>
                        <div className="text-[9px] text-purple-300/60 truncate">{p.college?.split(' ')[0]}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center font-mono text-purple-300/40 pt-2">
            STYLORA Security Protocol • Protected by Gemini AI Engine & WebGL 3D
          </div>
        </div>

      </div>
    </div>
  );
};
