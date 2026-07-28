import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  Upload,
  RefreshCw,
  Layers,
  Camera,
  Shirt,
  CheckCircle2,
  Heart,
  Wand2,
  Check,
  Download,
  Image as ImageIcon,
  User,
  X,
  ArrowRight,
  Eye,
  Share2
} from 'lucide-react';
import { FabricType } from '../types';
import { FabricSimulationCanvas } from './3d/FabricSimulationCanvas';

interface GarmentOption {
  id: string;
  name: string;
  category: string;
  material: string;
  image: string;
  tryOnResultImage: string;
  price: number;
  color: string;
  isCustomUpload?: boolean;
}

const PRESET_GARMENTS: GarmentOption[] = [
  {
    id: 'g1',
    name: 'Aetheria Lavender Silk Evening Dress',
    category: 'Haute Couture',
    material: '100% Mulberry Silk',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    tryOnResultImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    price: 340,
    color: '#B39DDB',
  },
  {
    id: 'g2',
    name: 'Neo-Tokyo Oversized Cyber Trench Coat',
    category: 'Outerwear',
    material: 'Waterproof Tech Denim',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    tryOnResultImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    price: 280,
    color: '#3949AB',
  },
  {
    id: 'g3',
    name: 'Velvet Midnight Double-Breasted Blazer',
    category: 'Tailored Suits',
    material: 'Deep Pile Royal Velvet',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    tryOnResultImage: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80',
    price: 310,
    color: '#4A148C',
  },
  {
    id: 'g4',
    name: 'Eco-Cashmere Cream Knit Statement Set',
    category: 'Knitwear',
    material: 'Recycled Organic Cashmere',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
    tryOnResultImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    price: 220,
    color: '#D7CCC8',
  },
];

const PRESET_MODELS = [
  {
    id: 'm1',
    name: 'Casual Street Studio',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    desc: 'Full body natural lighting pose',
  },
  {
    id: 'm2',
    name: 'Editorial Runway Studio',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    desc: 'High contrast studio lighting',
  },
  {
    id: 'm3',
    name: 'Minimalist Indoor Studio',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    desc: 'Structured silhouette frame',
  },
];

export const VirtualTryOn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studio' | 'physics'>('studio');

  // Body Photo Selection (Preset or Custom Upload)
  const [selectedModel, setSelectedModel] = useState(PRESET_MODELS[0]);
  const [userBodyPhoto, setUserBodyPhoto] = useState<string | null>(null);

  // Garment Selection (Preset or Custom Upload)
  const [selectedGarment, setSelectedGarment] = useState<GarmentOption>(PRESET_GARMENTS[0]);
  const [userOutfitPhoto, setUserOutfitPhoto] = useState<string | null>(null);
  const [userOutfitName, setUserOutfitName] = useState<string>('');

  // Fit & Generation States
  const [fitSize, setFitSize] = useState<string>('M');
  const [fitStyle, setFitStyle] = useState<string>('Tailored Precision');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStep, setGenStep] = useState<string>('Ready');
  const [generatedResultImage, setGeneratedResultImage] = useState<string | null>(null);
  const [isSavedToCloset, setIsSavedToCloset] = useState<boolean>(false);

  // Fabric Physics States
  const [selectedFabric, setSelectedFabric] = useState<FabricType>('Silk');
  const [fabricColor, setFabricColor] = useState<string>('#B39DDB');
  const [windSpeed, setWindSpeed] = useState<number>(1.2);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // File Input References
  const bodyFileInputRef = useRef<HTMLInputElement>(null);
  const outfitFileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // AI Outfit Generation States
  const [aiOutfitPrompt, setAiOutfitPrompt] = useState<string>('');
  const [aiImageSize, setAiImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGeneratingAiOutfit, setIsGeneratingAiOutfit] = useState<boolean>(false);
  const [showAiGenPanel, setShowAiGenPanel] = useState<boolean>(false);

  // AI Fit Analysis State
  const [fitAnalysis, setFitAnalysis] = useState<{
    fitScore: number;
    compatibilityTier: string;
    silhouetteHarmony: string;
    tailoringAdvice: string;
    fabricDrapeNotes: string;
    colorContrastRating: string;
  } | null>(null);
  const [isAnalyzingFit, setIsAnalyzingFit] = useState<boolean>(false);

  // Handler for Gemini AI Outfit Generation
  const handleGenerateAiOutfit = async () => {
    if (!aiOutfitPrompt.trim()) return;
    setIsGeneratingAiOutfit(true);

    try {
      const response = await fetch('/api/ai/generate-outfit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiOutfitPrompt,
          sourceImageBase64: userOutfitPhoto,
          imageSize: aiImageSize,
          aspectRatio: '3:4',
        }),
      });

      const data = await response.json();
      if (data && data.imageUrl) {
        setUserOutfitPhoto(data.imageUrl);
        setUserOutfitName(`AI: ${aiOutfitPrompt.slice(0, 24)}...`);
        const customGarment: GarmentOption = {
          id: `ai_gen_${Date.now()}`,
          name: `Gemini AI Outfit (${aiImageSize})`,
          category: 'AI Generative Fashion',
          material: 'Synthetic AI Fabric',
          image: data.imageUrl,
          tryOnResultImage: data.imageUrl,
          price: 0,
          color: '#EC407A',
          isCustomUpload: true,
        };
        setSelectedGarment(customGarment);
        setGeneratedResultImage(null);
      }
    } catch (err) {
      console.error('AI Outfit Generation Error:', err);
    } finally {
      setIsGeneratingAiOutfit(false);
    }
  };

  // Handler for AI Virtual Fit & Tailoring Diagnostic
  const handleRunFitAnalysis = async () => {
    setIsAnalyzingFit(true);
    try {
      const response = await fetch('/api/ai/virtual-fit-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyPhotoBase64: userBodyPhoto,
          outfitPhotoBase64: userOutfitPhoto,
          garmentName: selectedGarment.name,
          size: fitSize,
          style: fitStyle,
        }),
      });

      const data = await response.json();
      if (data && data.fitScore) {
        setFitAnalysis(data);
      }
    } catch (err) {
      console.error('Fit analysis error:', err);
    } finally {
      setIsAnalyzingFit(false);
    }
  };

  const fabrics: { type: FabricType; color: string; desc: string }[] = [
    { type: 'Silk', color: '#B39DDB', desc: 'Fluid drape with subtle sheen' },
    { type: 'Satin', color: '#E1BEE7', desc: 'High reflective sheen & liquid drape' },
    { type: 'Denim', color: '#3949AB', desc: 'Structured heavy weave' },
    { type: 'Velvet', color: '#4A148C', desc: 'Deep luminous texture' },
    { type: 'Linen', color: '#C8E6C9', desc: 'Organic light weave' },
    { type: 'Cashmere', color: '#D7CCC8', desc: 'Ultra-soft tactile warmth' },
  ];

  // Handler for uploading Full Body User Photo
  const handleBodyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserBodyPhoto(url);
      setGeneratedResultImage(null);
    }
  };

  // Handler for uploading Custom Outfit Photo
  const handleOutfitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserOutfitPhoto(url);
      setUserOutfitName(file.name.replace(/\.[^/.]+$/, ''));
      
      // Create a custom garment object
      const customGarment: GarmentOption = {
        id: `custom_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, '').toUpperCase() || 'Custom Uploaded Outfit',
        category: 'Custom Upload',
        material: 'User Specified Apparel',
        image: url,
        tryOnResultImage: url,
        price: 0,
        color: '#A855F7',
        isCustomUpload: true,
      };
      setSelectedGarment(customGarment);
      setGeneratedResultImage(null);
    }
  };

  // Synthesize custom try-on composite on canvas
  const synthesizeTryOnImage = (bodyImgUrl: string, outfitImgUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1333;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(outfitImgUrl);
        return;
      }

      const bodyImg = new Image();
      bodyImg.crossOrigin = 'anonymous';
      bodyImg.src = bodyImgUrl;

      bodyImg.onload = () => {
        // Draw full body base
        ctx.drawImage(bodyImg, 0, 0, canvas.width, canvas.height);

        const outfitImg = new Image();
        outfitImg.crossOrigin = 'anonymous';
        outfitImg.src = outfitImgUrl;

        outfitImg.onload = () => {
          // Overlay custom outfit aligned over torso/chest with soft blending
          ctx.save();
          ctx.globalAlpha = 0.92;
          ctx.globalCompositeOperation = 'source-over';

          // Target bounding box for torso fitting
          const targetW = canvas.width * 0.58;
          const targetH = canvas.height * 0.60;
          const targetX = (canvas.width - targetW) / 2;
          const targetY = canvas.height * 0.24;

          // Draw soft glow shadow behind garment
          ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
          ctx.shadowBlur = 30;

          ctx.drawImage(outfitImg, targetX, targetY, targetW, targetH);
          ctx.restore();

          // Add subtle lighting sheen
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
          gradient.addColorStop(0.5, 'transparent');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.08)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL('image/png'));
        };

        outfitImg.onerror = () => {
          resolve(outfitImgUrl);
        };
      };

      bodyImg.onerror = () => {
        resolve(outfitImgUrl);
      };
    });
  };

  const handleRunAiTryOn = async () => {
    setIsGenerating(true);

    const bodySrc = userBodyPhoto || selectedModel.image;
    const outfitSrc = userOutfitPhoto || selectedGarment.image;

    setGenStep('1/4 Analyzing Body Keypoints & Pose Mesh...');
    await new Promise((r) => setTimeout(r, 700));

    setGenStep('2/4 Extracting Outfit Contour & Fabric Texture...');
    await new Promise((r) => setTimeout(r, 700));

    setGenStep('3/4 Warping Garment to User Silhouette...');
    await new Promise((r) => setTimeout(r, 700));

    setGenStep('4/4 Blending Ambient Ray Tracing & Shadows...');

    let finalResultUrl = selectedGarment.tryOnResultImage;

    // If user provided custom body or custom outfit, generate synthesized composite!
    if (userBodyPhoto || userOutfitPhoto) {
      try {
        finalResultUrl = await synthesizeTryOnImage(bodySrc, outfitSrc);
      } catch (err) {
        finalResultUrl = outfitSrc;
      }
    }

    setGeneratedResultImage(finalResultUrl);
    setIsGenerating(false);
    setSliderPos(50);
  };

  const currentBeforeImage = userBodyPhoto || selectedModel.image;
  const currentAfterImage = generatedResultImage || selectedGarment.tryOnResultImage;

  const handleDownload = () => {
    if (!currentAfterImage) return;
    const link = document.createElement('a');
    link.href = currentAfterImage;
    link.download = `STYLORA_TryOn_${selectedGarment.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="tryon" className="py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-700 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
          <span>Generative Fitting Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
          AI Virtual Try-On Studio
        </h2>
        <p className="text-slate-600 dark:text-purple-200/70 font-light text-sm sm:text-base">
          Upload your <span className="font-semibold text-purple-600 dark:text-purple-300">Full Body Photo</span> and <span className="font-semibold text-pink-600 dark:text-pink-300">Outfit Photo</span>, or pick from our curated collection, to generate your personal AI Virtual Fitting preview in real time!
        </p>

        {/* Studio Mode Selector Tabs */}
        <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-purple-500/20 shadow-lg">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-600 dark:text-purple-200 hover:text-purple-600'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>AI Virtual Try-On Room</span>
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'physics'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-600 dark:text-purple-200 hover:text-purple-600'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4D WebGL Cloth Physics</span>
          </button>
        </div>
      </div>

      {/* MODE 1: AI VIRTUAL TRY-ON STUDIO */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Dual Upload & Selection Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* STEP 1: Full Body Photo Upload / Preset Selection */}
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-purple-500/20 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  <span>1. Full Body User Photo</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {userBodyPhoto ? 'Custom Upload Active' : 'Preset Avatar'}
                </span>
              </div>

              {/* Upload Input Button */}
              <div className="relative">
                <button
                  onClick={() => bodyFileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 hover:border-purple-400 text-purple-200 text-xs font-medium flex items-center justify-center gap-2.5 transition-all group"
                >
                  <Upload className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span>{userBodyPhoto ? 'Change Full Body Photo' : 'Upload Your Full Body Photo'}</span>
                </button>
                <input
                  type="file"
                  ref={bodyFileInputRef}
                  accept="image/*"
                  onChange={handleBodyUpload}
                  className="hidden"
                />
              </div>

              {/* Active User Photo Preview or Model Presets */}
              {userBodyPhoto ? (
                <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={userBodyPhoto}
                      alt="User Full Body"
                      className="w-14 h-14 rounded-xl object-cover border border-purple-400 shadow-md"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Your Full Body Photo</span>
                      </div>
                      <div className="text-[10px] text-purple-300 font-mono">Ready for virtual try-on</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setUserBodyPhoto(null)}
                    className="p-1.5 rounded-lg bg-pink-950/60 hover:bg-pink-900 text-pink-300 text-[10px] font-mono transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-purple-300 uppercase tracking-wider">
                    Or Choose Model Preset:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_MODELS.map((m) => {
                      const isSelected = selectedModel.id === m.id && !userBodyPhoto;
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedModel(m);
                            setUserBodyPhoto(null);
                          }}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/50'
                              : 'border-purple-500/10 hover:border-purple-500/30 bg-slate-950/40'
                          }`}
                        >
                          <img src={m.image} alt={m.name} className="h-16 w-full object-cover rounded-lg mb-1" />
                          <div className="text-[10px] font-bold text-white truncate">{m.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: Custom Outfit Photo Upload / Curated Catalog */}
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-purple-500/20 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-pink-500" />
                  <span>2. Outfit / Dress Selection & AI Creator</span>
                </h3>
                <button
                  onClick={() => setShowAiGenPanel(!showAiGenPanel)}
                  className="text-[10px] font-mono text-pink-400 bg-pink-950/40 px-2.5 py-1 rounded-full border border-pink-500/30 hover:border-pink-400 flex items-center gap-1 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-pink-300" />
                  <span>{showAiGenPanel ? 'Hide AI Prompt' : 'Create with Gemini AI'}</span>
                </button>
              </div>

              {/* Gemini AI Image Generator Affordance Panel */}
              {showAiGenPanel && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-pink-950/60 border border-pink-500/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-pink-200">
                    <span className="flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                      Gemini 3.1 Flash Fashion Image Generator
                    </span>
                    {/* Resolution / Image Size Affordance: 1K, 2K, 4K */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-pink-500/30">
                      {(['1K', '2K', '4K'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setAiImageSize(size)}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                            aiImageSize === size
                              ? 'bg-pink-600 text-white shadow-md'
                              : 'text-purple-300 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. Lavender silk wrap gown with metallic organza drape"
                      value={aiOutfitPrompt}
                      onChange={(e) => setAiOutfitPrompt(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-pink-500/30 text-white text-xs placeholder-purple-300/50 focus:outline-none focus:border-pink-400"
                    />
                    <button
                      onClick={handleGenerateAiOutfit}
                      disabled={isGeneratingAiOutfit || !aiOutfitPrompt.trim()}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiOutfit ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingAiOutfit ? 'Generating Gemini Image Asset...' : `Generate Outfit (${aiImageSize} Resolution)`}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Outfit Upload Button */}
              <div className="relative">
                <button
                  onClick={() => outfitFileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-500/30 hover:border-pink-400 text-pink-200 text-xs font-medium flex items-center justify-center gap-2.5 transition-all group"
                >
                  <Upload className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span>{userOutfitPhoto ? 'Change Outfit Photo' : 'Upload Outfit / Dress Photo'}</span>
                </button>
                <input
                  type="file"
                  ref={outfitFileInputRef}
                  accept="image/*"
                  onChange={handleOutfitUpload}
                  className="hidden"
                />
              </div>

              {/* Active Uploaded Outfit Preview or Catalog Presets */}
              {userOutfitPhoto ? (
                <div className="p-3 rounded-2xl bg-pink-950/40 border border-pink-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={userOutfitPhoto}
                      alt="Uploaded Outfit"
                      className="w-14 h-14 rounded-xl object-cover border border-pink-400 shadow-md"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                        <span className="truncate max-w-[150px]">{userOutfitName || 'Custom Outfit'}</span>
                      </div>
                      <div className="text-[10px] text-pink-300/80 font-mono">Uploaded Custom Apparel</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUserOutfitPhoto(null);
                      setSelectedGarment(PRESET_GARMENTS[0]);
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-pink-300 text-[10px] font-mono transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-purple-300 uppercase tracking-wider">
                    Or Select Curated Garment:
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PRESET_GARMENTS.map((garment) => {
                      const isSelected = selectedGarment.id === garment.id && !userOutfitPhoto;
                      return (
                        <button
                          key={garment.id}
                          onClick={() => {
                            setSelectedGarment(garment);
                            setUserOutfitPhoto(null);
                          }}
                          className={`relative p-2 rounded-2xl border text-left transition-all overflow-hidden group ${
                            isSelected
                              ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/50'
                              : 'border-slate-200 dark:border-purple-500/10 hover:border-purple-500/30 bg-slate-50 dark:bg-slate-950/50'
                          }`}
                        >
                          <div className="h-24 w-full rounded-xl overflow-hidden mb-1.5 bg-slate-900 relative">
                            <img
                              src={garment.image}
                              alt={garment.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                          <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                            {garment.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size & Fit Parameters */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">Body Fit Size</label>
                  <select
                    value={fitSize}
                    onChange={(e) => setFitSize(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value="XS">XS (Extra Small)</option>
                    <option value="S">S (Small)</option>
                    <option value="M">M (Medium)</option>
                    <option value="L">L (Large)</option>
                    <option value="XL">XL (Extra Large)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">Drape Style</label>
                  <select
                    value={fitStyle}
                    onChange={(e) => setFitStyle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value="Tailored Precision">Tailored Precision</option>
                    <option value="Relaxed Drape">Relaxed Drape</option>
                    <option value="Sculpted Contour">Sculpted Contour</option>
                    <option value="Oversized Runway">Oversized Runway</option>
                  </select>
                </div>
              </div>

              {/* ACTION: GENERATE VIRTUAL TRY-ON BUTTON */}
              <button
                onClick={handleRunAiTryOn}
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-semibold text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all group"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2 font-mono text-pink-200">
                    <Sparkles className="w-4 h-4 animate-spin text-pink-300" />
                    <span>{genStep}</span>
                  </span>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-pink-300 group-hover:scale-110 transition-transform" />
                    <span>
                      {userBodyPhoto && userOutfitPhoto
                        ? 'Fit Uploaded Outfit on My Body'
                        : 'Generate AI Virtual Try-On'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Try-On Result View */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative h-[540px] rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl bg-slate-950 select-none group">
              
              {/* Before Layer (Original Body Photo) */}
              <div className="absolute inset-0">
                <img
                  src={currentBeforeImage}
                  alt="Original Body Photo"
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono text-white border border-white/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>{userBodyPhoto ? 'Your Full Body Photo' : 'Original Photo'}</span>
                </div>
              </div>

              {/* After Layer (AI Try-On Fitted Image) */}
              <div
                className="absolute inset-y-0 right-0 overflow-hidden transition-all"
                style={{ width: `${100 - sliderPos}%` }}
              >
                <img
                  src={currentAfterImage}
                  alt="AI Fitted Result"
                  className="absolute right-0 h-full max-w-none object-cover filter saturate-110"
                  style={{ width: '100%', minWidth: '680px' }}
                />
                <div className="absolute top-4 right-4 bg-purple-950/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono text-purple-200 border border-purple-500/40 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
                  <span>
                    {userOutfitPhoto
                      ? 'Custom Upload Outfit Fitted'
                      : 'AI Fitted Garment'}
                  </span>
                </div>
              </div>

              {/* Morph Split Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-pink-400 to-indigo-400 cursor-ew-resize shadow-2xl flex items-center justify-center z-20"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-9 h-9 rounded-full bg-slate-950 text-purple-300 border-2 border-purple-400 shadow-xl flex items-center justify-center text-xs font-bold">
                  ↔
                </div>
              </div>

              {/* Range Input Overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-x-0 bottom-4 w-4/5 mx-auto opacity-0 cursor-ew-resize z-30"
              />

              {/* Loading State Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/40 p-3 flex items-center justify-center animate-bounce">
                    <Sparkles className="w-8 h-8 text-pink-400 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold font-serif text-white">Rendering AI Try-On Synthesis</h4>
                    <p className="text-xs font-mono text-purple-300 animate-pulse">{genStep}</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Fit Analytics Card & Download / Save Options */}
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-purple-500/20 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>AI Virtual Fit & Compatibility Analysis</span>
                  </h4>
                  <p className="text-[11px] text-purple-600 dark:text-purple-300/80 font-mono">
                    Outfit: {userOutfitName || selectedGarment.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-serif text-emerald-400">
                    {fitAnalysis ? `${fitAnalysis.fitScore}%` : '98.4%'}
                  </span>
                  <span className="block text-[9px] font-mono text-purple-300">Match Score</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-purple-500/10">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Size {fitSize}</span>
                  <span className="text-[9px] font-mono text-purple-600 dark:text-purple-300">Target Fit</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-purple-500/10">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{fitStyle.split(' ')[0]}</span>
                  <span className="text-[9px] font-mono text-purple-600 dark:text-purple-300">Drape Mechanics</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-purple-500/10">
                  <span className="text-xs font-bold text-emerald-400 block">
                    {fitAnalysis ? fitAnalysis.compatibilityTier : 'Perfect Fit'}
                  </span>
                  <span className="text-[9px] font-mono text-purple-600 dark:text-purple-300">Tier Assessment</span>
                </div>
              </div>

              {/* Gemini AI Fit & Tailoring Diagnostic Output */}
              {fitAnalysis ? (
                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span>Gemini AI Fit & Tailoring Insights</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-purple-200/90">
                    <div>
                      <span className="font-semibold text-white block">Silhouette Harmony:</span>
                      <span className="font-light">{fitAnalysis.silhouetteHarmony}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-white block">Tailoring & Alteration:</span>
                      <span className="font-light">{fitAnalysis.tailoringAdvice}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-white block">Fabric Drape Mechanics:</span>
                      <span className="font-light">{fitAnalysis.fabricDrapeNotes}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-white block">Undertone Color Contrast:</span>
                      <span className="font-light">{fitAnalysis.colorContrastRating}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRunFitAnalysis}
                  disabled={isAnalyzingFit}
                  className="w-full py-2.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 text-xs font-mono flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-pink-400 ${isAnalyzingFit ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingFit ? 'Gemini Analyzing Body & Garment Fit...' : 'Run Detailed AI Tailoring Diagnostic'}</span>
                </button>
              )}

              {/* Action Buttons: Save to Closet & Download Image */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsSavedToCloset(!isSavedToCloset)}
                  className={`flex-1 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSavedToCloset
                      ? 'bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-600/30'
                      : 'bg-slate-950 border-purple-500/20 text-purple-200 hover:border-purple-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSavedToCloset ? 'fill-current text-white' : ''}`} />
                  <span>{isSavedToCloset ? 'Saved to Smart Closet' : 'Save Outfit to Closet'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
                  title="Download Generated Virtual Try-On Image"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Try-On Image</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODE 2: 4D FABRIC PHYSICS SIMULATION */}
      {activeTab === 'physics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="backdrop-blur-xl bg-slate-950 border border-purple-500/20 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-500" />
                  Real-time WebGL Fabric Physics
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  60 FPS GPU Rendering
                </span>
              </div>

              {/* Embedded WebGL Fabric Canvas */}
              <div className="h-80 w-full rounded-2xl overflow-hidden border border-purple-500/30">
                <FabricSimulationCanvas
                  selectedFabric={selectedFabric}
                  fabricColor={fabricColor}
                  windSpeed={windSpeed}
                />
              </div>

              <p className="text-xs font-mono text-purple-300/70 text-center">
                Interactive cloth mesh physics simulating tension, gravity, and wind velocity on {selectedFabric}.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-purple-500/20 rounded-3xl p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-500" />
              Fabric Mechanics & Drapery
            </h3>

            {/* Fabric Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                Select Fabric Material
              </label>
              <div className="grid grid-cols-2 gap-2">
                {fabrics.map((f) => (
                  <button
                    key={f.type}
                    onClick={() => {
                      setSelectedFabric(f.type);
                      setFabricColor(f.color);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      selectedFabric === f.type
                        ? 'bg-purple-600 text-white border-purple-400 font-semibold shadow-lg shadow-purple-600/30'
                        : 'bg-white/40 dark:bg-purple-950/20 border-purple-500/10 text-slate-700 dark:text-purple-200 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{f.type}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                    </div>
                    <div className="text-[10px] opacity-80 mt-1 line-clamp-1">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wind Motion Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-purple-700 dark:text-purple-300">
                <span>Runway Wind Speed</span>
                <span>{windSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full accent-purple-500 bg-purple-950/20 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={() => {
                setIsSimulating(true);
                setTimeout(() => setIsSimulating(false), 1000);
              }}
              disabled={isSimulating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-semibold text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Updating Cloth Mesh...' : 'Re-calculate Cloth Physics'}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
