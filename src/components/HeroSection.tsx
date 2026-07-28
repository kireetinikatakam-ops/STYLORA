import React from 'react';
import { Sparkles, ArrowDown, ChevronRight, Play } from 'lucide-react';
import { LifestyleScene } from '../types';
import { LIFESTYLE_SCENES } from '../data/mockData';

interface HeroSectionProps {
  activeScene: LifestyleScene;
  onSelectScene: (sceneId: LifestyleScene) => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activeScene, onSelectScene, onExplore }) => {
  const currentScene = LIFESTYLE_SCENES.find((s) => s.id === activeScene) || LIFESTYLE_SCENES[0];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-6 md:px-12 pointer-events-none">
      {/* Top Tagline & Headline */}
      <div className="max-w-3xl pointer-events-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-purple-500/10 dark:bg-purple-900/30 border border-purple-500/30 text-xs font-mono text-purple-700 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
          <span>Generative 3D Fashion Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-serif text-slate-900 dark:text-white leading-[1.1]">
          Style Smarter.{' '}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Spend Less.
          </span>{' '}
          Dress Sustainably.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-purple-200/80 max-w-xl font-light">
          Experience Apple-level design engineering paired with Dior elegance. Interactive 3D runway,
          real-time fabric physics, Korean personal color analysis, and student peer-to-peer marketplace.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onExplore}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Explore Smart Closet</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <a
            href="#tryon"
            className="px-6 py-3.5 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-black/60 border border-purple-500/30 text-slate-900 dark:text-white font-semibold text-sm hover:border-purple-400 transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
            <span>Virtual Fitting Room</span>
          </a>
        </div>
      </div>

      {/* Bottom Scene Carousel Indicator */}
      <div className="pointer-events-auto backdrop-blur-2xl bg-white/70 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-4 md:p-6 shadow-2xl max-w-4xl w-full mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Interactive Runway Phase • {currentScene.location}
            </span>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              {currentScene.title} — <span className="text-purple-500 dark:text-purple-300">{currentScene.subtitle}</span>
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-purple-600 dark:text-purple-300">
            <ArrowDown className="w-4 h-4 animate-bounce text-pink-400" />
            <span>Scroll to walk runway</span>
          </div>
        </div>

        {/* Scene Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {LIFESTYLE_SCENES.map((scene, idx) => {
            const isSelected = scene.id === activeScene;
            return (
              <button
                key={scene.id}
                onClick={() => onSelectScene(scene.id)}
                className={`p-2.5 rounded-xl text-left transition-all text-xs font-medium border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30 font-semibold'
                    : 'bg-white/50 dark:bg-purple-950/20 border-purple-500/10 text-slate-700 dark:text-slate-300 hover:border-purple-500/30'
                }`}
              >
                <div className="text-[10px] opacity-70 font-mono">0{idx + 1}</div>
                <div className="truncate font-medium">{scene.title}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
