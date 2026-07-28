import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Runway3DCanvas } from './components/3d/Runway3DCanvas';
import { HeroSection } from './components/HeroSection';
import { SmartCloset } from './components/SmartCloset';
import { VirtualTryOn } from './components/VirtualTryOn';
import { ColorAnalysis } from './components/ColorAnalysis';
import { BodyShapeAnalysis } from './components/BodyShapeAnalysis';
import { StyleScore } from './components/StyleScore';
import { Marketplace } from './components/Marketplace';
import { SustainabilityDashboard } from './components/SustainabilityDashboard';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CartDrawer } from './components/CartDrawer';
import { SignInGate } from './components/SignInGate';
import { Footer } from './components/Footer';
import { LifestyleScene, MarketplaceProduct, CartItem, UserProfile } from './types';
import { LIFESTYLE_SCENES } from './data/mockData';
import { Sparkles, Bot, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [soundOn, setSoundOn] = useState<boolean>(false);
  const [activeScene, setActiveScene] = useState<LifestyleScene>('runway');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('stylora_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isSignInGateOpen, setIsSignInGateOpen] = useState<boolean>(!user);

  // Cart & Assistant States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Ref for Web Audio Synth
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Dark Mode side effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll Progress and Scene Trigger Listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / (maxScroll || 1), 0), 1);
      setScrollProgress(progress);

      // Map scroll progress across initial sections to 6 lifestyle scenes
      const sceneIndex = Math.min(
        Math.floor(progress * 8 * (LIFESTYLE_SCENES.length / 8)),
        LIFESTYLE_SCENES.length - 1
      );
      if (progress < 0.35) {
        setActiveScene(LIFESTYLE_SCENES[sceneIndex]?.id || 'runway');
      }

      // Update active nav section
      const sections = ['hero', 'closet', 'tryon', 'color', 'bodyshape', 'score', 'marketplace', 'sustainability'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Web Audio Synth ambient sound
  useEffect(() => {
    if (soundOn) {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      return () => {
        try {
          osc.stop();
        } catch (e) {}
      };
    }
  }, [soundOn]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSignIn = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem('stylora_user', JSON.stringify(newUser));
    } catch {}
    setIsSignInGateOpen(false);
    showToast(`Welcome to STYLORA, ${newUser.name}!`);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('stylora_user');
    } catch {}
    setIsSignInGateOpen(true);
    showToast('Signed out successfully.');
  };

  const handleAddToCart = (product: MarketplaceProduct, mode: 'buy' | 'rent' | 'swap', days?: number) => {
    setCartItems((prev) => [...prev, { product, quantity: 1, mode, rentalDays: days || 3 }]);
    showToast(`Added '${product.title}' to cart!`);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleCheckoutSuccess = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setCartItems([]);
    showToast('Order completed! Green Points credited to your account.');
  };

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0B10] text-slate-900 dark:text-white transition-colors duration-500 relative font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      
      {/* Sign In Gate (Shown before opening or when not authenticated / requested) */}
      {(isSignInGateOpen || !user) && (
        <SignInGate onSignIn={handleSignIn} />
      )}

      {/* Fixed Background 3D Runway Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80 dark:opacity-100">
        <Runway3DCanvas activeScene={activeScene} scrollProgress={scrollProgress} />
      </div>

      {/* Floating Header Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        user={user}
        onSignOut={handleSignOut}
        onOpenSignIn={() => setIsSignInGateOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection
          activeScene={activeScene}
          onSelectScene={setActiveScene}
          onExplore={() => handleNavigate('closet')}
        />

        <SmartCloset />
        <VirtualTryOn />
        <ColorAnalysis />
        <BodyShapeAnalysis />
        <StyleScore />
        <Marketplace onAddToCart={handleAddToCart} />
        <SustainabilityDashboard />
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 backdrop-blur-2xl bg-purple-950/90 text-white border border-purple-500/40 px-5 py-3 rounded-2xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bottom-Right Floating AI Stylist Button */}
      {!isAssistantOpen && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-2xl shadow-purple-600/40 hover:scale-110 transition-transform group"
          title="Open STYLORA AI Assistant"
        >
          <Sparkles className="w-6 h-6 animate-spin text-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
        </button>
      )}

      {/* Modals and Drawers */}
      <AIAssistantModal isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      <Footer />
    </div>
  );
}
