import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Compass,
  Shirt,
  Palette,
  UserCheck,
  Award,
  Store,
  Leaf,
  LogOut,
  User,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  soundOn: boolean;
  setSoundOn: (val: boolean) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAssistant: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  user: UserProfile | null;
  onSignOut: () => void;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  soundOn,
  setSoundOn,
  cartCount,
  onOpenCart,
  onOpenAssistant,
  activeSection,
  onNavigate,
  user,
  onSignOut,
  onOpenSignIn,
}) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const navItems = [
    { id: 'hero', label: '3D Runway', icon: Compass },
    { id: 'closet', label: 'Smart Closet', icon: Shirt },
    { id: 'tryon', label: 'Virtual Try-On', icon: Sparkles },
    { id: 'color', label: 'Color Analysis', icon: Palette },
    { id: 'bodyshape', label: 'Body Shape', icon: UserCheck },
    { id: 'score', label: 'Style Score', icon: Award },
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'sustainability', label: 'Sustainability', icon: Leaf },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
      <nav className="backdrop-blur-xl bg-white/70 dark:bg-black/70 border border-purple-500/20 dark:border-purple-500/30 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-400 p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-purple-300 font-bold text-lg font-serif">
              S
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-wider font-serif bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-600 dark:from-purple-300 dark:via-purple-100 dark:to-indigo-300 bg-clip-text text-transparent">
              STYLORA
            </span>
            <span className="block text-[10px] tracking-widest text-purple-600/70 dark:text-purple-300/70 uppercase font-mono">
              AI Haute Couture
            </span>
          </div>
        </button>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-1 bg-purple-950/10 dark:bg-purple-950/40 p-1 rounded-xl border border-purple-500/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-white/50 dark:hover:bg-purple-900/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 transition-colors"
            title={soundOn ? 'Mute Soundtrack' : 'Play Fashion Beats'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 transition-colors"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Cart Drawer Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center"
            title="Marketplace Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-pink-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAssistant}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 border border-purple-500/30 text-purple-800 dark:text-purple-200 hover:border-purple-400 text-xs font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
            <span>AI Stylist</span>
          </button>

          {/* Signed In User Profile / Auth Control */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-400 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-purple-400"
                />
                <span className="hidden md:inline-block text-xs font-bold text-slate-800 dark:text-white max-w-[90px] truncate">
                  {user.name}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-purple-500/30 shadow-2xl p-3 z-50 space-y-3 font-sans">
                  <div className="flex items-center gap-3 border-b border-purple-500/20 pb-2">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-purple-400" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-purple-300/70 font-mono truncate">{user.email}</div>
                    </div>
                  </div>

                  {user.college && (
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/50 p-2 rounded-lg border border-emerald-500/30">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span className="truncate">{user.college}</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOut();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-pink-950/40 hover:bg-pink-950/80 border border-pink-500/30 text-pink-300 text-xs font-semibold flex items-center justify-between transition-all"
                  >
                    <span>Sign Out</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
