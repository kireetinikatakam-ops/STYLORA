import React, { useState } from 'react';
import { Sparkles, Plus, Calendar, Layers, Tag, Upload, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { ClosetItem } from '../types';
import { INITIAL_CLOSET_ITEMS } from '../data/mockData';

export const SmartCloset: React.FC = () => {
  const [closetItems, setClosetItems] = useState<ClosetItem[]>(INITIAL_CLOSET_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isWardrobeOpen, setIsWardrobeOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'today' | 'weekly' | 'combos'>('wardrobe');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Today's generated outfit state
  const [todaysOutfit, setTodaysOutfit] = useState({
    title: 'Minimalist Lavender Chic',
    occasion: 'Creative Office & Client Lounge',
    weather: 'Cool & Sunny (18°C)',
    top: INITIAL_CLOSET_ITEMS[0],
    bottom: INITIAL_CLOSET_ITEMS[1],
    shoes: INITIAL_CLOSET_ITEMS[3],
    accessory: INITIAL_CLOSET_ITEMS[4],
  });

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];

  const filteredItems =
    selectedCategory === 'All'
      ? closetItems
      : closetItems.filter((item) => item.category === selectedCategory);

  // Simulated wardrobe upload & AI auto-categorization
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    setTimeout(() => {
      const newItem: ClosetItem = {
        id: `c_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, "") || 'AI Auto-Tagged Silk Garment',
        category: 'Tops',
        imageUrl: URL.createObjectURL(file),
        colorHex: '#CE93D8',
        tags: ['AI Analyzed', 'Organic Silk', 'New Arrival'],
        sustainabilityRating: 94,
      };
      setClosetItems((prev) => [newItem, ...prev]);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1500);
  };

  const handleRegenerateOutfit = () => {
    const randomTop = closetItems.filter((i) => i.category === 'Tops')[Math.floor(Math.random() * 2)] || closetItems[0];
    const randomBottom = closetItems.filter((i) => i.category === 'Bottoms')[0] || closetItems[1];
    setTodaysOutfit({
      ...todaysOutfit,
      title: 'Ethereal Pastels & Structured Tailoring',
      top: randomTop,
      bottom: randomBottom,
    });
  };

  return (
    <section id="closet" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-700 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>AI Smart Closet</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
          Interactive 3D Wardrobe
        </h2>
        <p className="text-slate-600 dark:text-purple-200/70 font-light text-sm sm:text-base">
          Upload your garments or browse curated eco-wear. STYLORA automatically categorizes items, generates
          daily combinations, and constructs a 7-day style planner.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'wardrobe', label: '3D Wardrobe Vault', icon: Layers },
          { id: 'today', label: "Today's Outfit", icon: Sparkles },
          { id: 'weekly', label: 'Weekly Planner', icon: Calendar },
          { id: 'combos', label: 'Mix & Match Generator', icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all border ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-400 shadow-xl shadow-purple-600/30'
                  : 'backdrop-blur-md bg-white/60 dark:bg-black/50 border-purple-500/15 text-slate-700 dark:text-purple-200 hover:border-purple-500/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: 3D WARDROBE VAULT */}
      {activeTab === 'wardrobe' && (
        <div className="space-y-8">
          {/* Wardrobe Door Controls & Upload Bar */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsWardrobeOpen(!isWardrobeOpen)}
                className="px-5 py-2.5 rounded-xl bg-purple-950/20 dark:bg-purple-900/40 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:border-purple-400 transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>{isWardrobeOpen ? 'Close 3D Wardrobe' : 'Open 3D Wardrobe Doors'}</span>
              </button>
              <span className="text-xs font-mono text-slate-500 dark:text-purple-300/70">
                {closetItems.length} Garments Digitized
              </span>
            </div>

            {/* Upload Button */}
            <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 hover:opacity-90 transition-all">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'AI Analyzing Garment...' : 'Upload Garment Photo'}</span>
              <input type="file" accept="image/*" onChange={handleSimulatedUpload} className="hidden" disabled={isUploading} />
            </label>
          </div>

          {uploadSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Garment uploaded and automatically categorized into your 3D Smart Closet!</span>
            </div>
          )}

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  selectedCategory === cat
                    ? 'bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300 font-semibold'
                    : 'bg-white/40 dark:bg-purple-950/20 border-purple-500/10 text-slate-600 dark:text-slate-400 hover:border-purple-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3D Wardrobe Grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${
              isWardrobeOpen ? 'opacity-100 scale-100' : 'opacity-20 scale-95 pointer-events-none'
            }`}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black/60 border border-purple-500/20 p-4 shadow-xl hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-purple-300 flex items-center gap-1.5 border border-purple-500/30">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.colorHex }} />
                    {item.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-purple-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-emerald-300 border border-emerald-500/30">
                    Eco {item.sustainabilityRating}/100
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold font-serif text-slate-900 dark:text-white text-base truncate">
                    {item.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TODAY'S OUTFIT */}
      {activeTab === 'today' && (
        <div className="backdrop-blur-2xl bg-white/80 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-8 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400">
                AI Styled Daily Recommendation
              </span>
              <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {todaysOutfit.title}
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-300 font-mono mt-1">
                Occasion: {todaysOutfit.occasion} • {todaysOutfit.weather}
              </p>
            </div>

            <button
              onClick={handleRegenerateOutfit}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 hover:opacity-90 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate Outfit</span>
            </button>
          </div>

          {/* Outfit Components Showcase Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Top', item: todaysOutfit.top },
              { label: 'Bottom', item: todaysOutfit.bottom },
              { label: 'Shoes', item: todaysOutfit.shoes },
              { label: 'Accessory', item: todaysOutfit.accessory },
            ].map(({ label, item }) => (
              <div key={label} className="p-4 rounded-2xl bg-purple-950/10 dark:bg-purple-950/30 border border-purple-500/20 space-y-3">
                <span className="text-[10px] font-mono text-purple-500 uppercase">{label}</span>
                <div className="h-40 rounded-xl overflow-hidden bg-slate-900">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY PLANNER */}
      {activeTab === 'weekly' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {[
            { day: 'Mon', theme: 'Executive Office', top: 'Lilac Blazer', bottom: 'Tailored Pants' },
            { day: 'Tue', theme: 'College Campus', top: 'Denim Jacket', bottom: 'Pleated Skirt' },
            { day: 'Wed', theme: 'Coffee & Work', top: 'Silk Slip Top', bottom: 'Wide Trousers' },
            { day: 'Thu', theme: 'Creative Pitch', top: 'Linen Shirt', bottom: 'Slim Chinos' },
            { day: 'Fri', theme: 'Evening Social', top: 'Metallic Knit', bottom: 'Silk Skirt' },
            { day: 'Sat', theme: 'Art Gallery', top: 'Oversized Knit', bottom: 'Denim Pants' },
            { day: 'Sun', theme: 'Brunch & Lounge', top: 'Cashmere Top', bottom: 'Eco Trousers' },
          ].map((item) => (
            <div
              key={item.day}
              className="p-4 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-black/60 border border-purple-500/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-serif text-purple-600 dark:text-purple-300">{item.day}</span>
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div className="text-[11px] font-medium text-slate-900 dark:text-white">{item.theme}</div>
              <div className="text-[10px] font-mono text-purple-700/80 dark:text-purple-300/70 space-y-1">
                <div>• {item.top}</div>
                <div>• {item.bottom}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: MIX & MATCH COMBOS */}
      {activeTab === 'combos' && (
        <div className="backdrop-blur-2xl bg-white/80 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            AI Automated Mix & Match Engine
          </h3>
          <p className="text-sm text-slate-600 dark:text-purple-200/70 max-w-lg mx-auto font-light">
            STYLORA calculates color balance, silhouette compatibility, and sustainability metrics across all
            your uploaded closet items to deliver over 120+ unique outfit pairings.
          </p>
          <button className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-semibold text-sm shadow-xl hover:scale-105 transition-all">
            Generate 10 New Combinations
          </button>
        </div>
      )}
    </section>
  );
};
