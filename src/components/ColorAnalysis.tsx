import React, { useState } from 'react';
import { Sparkles, Camera, Upload, CheckCircle2, AlertCircle, RefreshCw, Wand2, Layers, Shirt } from 'lucide-react';
import { PersonalColorData } from '../types';

export const ColorAnalysis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeDrapeColor, setActiveDrapeColor] = useState<string | null>(null);
  
  // Gemini AI Palette Outfit Generation States
  const [generatedOutfitUrl, setGeneratedOutfitUrl] = useState<string | null>(null);
  const [isGeneratingOutfit, setIsGeneratingOutfit] = useState<boolean>(false);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const [colorResult, setColorResult] = useState<PersonalColorData | null>({
    season: 'Summer Cool',
    undertone: 'Cool Pink / Rosy Undertone',
    hairColor: 'Ash Brown / Espresso',
    eyeColor: 'Deep Hazel / Dark Brown',
    paletteName: 'Ethereal Lavender & Ice Blues',
    bestColors: [
      { name: 'Dusty Lavender', hex: '#B39DDB' },
      { name: 'Ice Blue', hex: '#E1F5FE' },
      { name: 'Soft Mauve', hex: '#CE93D8' },
      { name: 'Periwinkle', hex: '#9FA8DA' },
      { name: 'Pure Sage', hex: '#C8E6C9' },
    ],
    avoidColors: [
      { name: 'Mustard Yellow', hex: '#FBC02D' },
      { name: 'Rust Orange', hex: '#E64A19' },
      { name: 'Warm Olive', hex: '#827717' },
    ],
    jewelry: 'Platinum, White Gold & Pearl Silver',
    makeup: 'Berry lip tints, soft lavender blush, & cool-toned nude eyeshadows',
    hairSuggestions: 'Ash Violet, Cool Black, or Frosted Mocha',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setIsAnalyzing(true);

      try {
        const response = await fetch('/api/ai/color-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 }),
        });
        const data = await response.json();
        if (data && data.season) {
          setColorResult(data);
        }
      } catch (err) {
        console.error('Color Analysis Error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePaletteOutfit = async () => {
    if (!colorResult) return;
    setIsGeneratingOutfit(true);

    const promptText = customPrompt.trim()
      ? customPrompt
      : `Haute couture runway dress designed in personal color palette for ${colorResult.season} (${colorResult.paletteName}). Primary color tones: ${colorResult.bestColors.map((c) => c.name).join(', ')}. Luxurious silk drape, high fashion studio lighting.`;

    try {
      const response = await fetch('/api/ai/generate-outfit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          imageSize: imageSize,
          aspectRatio: '3:4',
        }),
      });

      const data = await response.json();
      if (data && data.imageUrl) {
        setGeneratedOutfitUrl(data.imageUrl);
      }
    } catch (err) {
      console.error('Palette Outfit Generation Error:', err);
    } finally {
      setIsGeneratingOutfit(false);
    }
  };

  return (
    <section id="color" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-700 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Korean Personal Color AI</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
          Personal Color Palette Analysis
        </h2>
        <p className="text-slate-600 dark:text-purple-200/70 font-light text-sm sm:text-base">
          Upload a selfie to unlock your true undertones and seasonal personal color typology: Spring Warm,
          Summer Cool, Autumn Warm, or Winter Cool.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Camera Box */}
        <div className="lg:col-span-5 backdrop-blur-xl bg-white/80 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-6 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-500" />
            Upload Selfie for AI Scan
          </h3>

          <div className="relative h-64 rounded-2xl border-2 border-dashed border-purple-500/30 overflow-hidden flex flex-col items-center justify-center bg-purple-950/10 dark:bg-purple-950/30 p-4 text-center">
            {selectedImage ? (
              <div className="relative w-full h-full">
                <img src={selectedImage} alt="User Selfie" className="w-full h-full object-cover rounded-xl" />
                {activeDrapeColor && (
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl opacity-60 backdrop-blur-sm transition-colors duration-500"
                    style={{ backgroundColor: activeDrapeColor }}
                  >
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded-full border border-white/20">
                      Live Color Drape Active
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs text-slate-700 dark:text-purple-200 font-medium">
                  Drop portrait photo or click to browse
                </div>
                <div className="text-[10px] text-purple-500 font-mono">JPG, PNG up to 10MB</div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isAnalyzing}
            />
          </div>

          <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-semibold text-xs shadow-xl flex items-center justify-center gap-2">
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Undertones & Pigments...' : 'Run Personal Color Analysis'}</span>
          </button>
        </div>

        {/* Right Column: Personal Color Analysis Results */}
        {colorResult && (
          <div className="lg:col-span-7 backdrop-blur-2xl bg-white/80 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-8 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-500/15 pb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400">
                  Seasonal Classification
                </span>
                <h3 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mt-1">
                  {colorResult.season}
                </h3>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-700 dark:text-purple-300">
                {colorResult.undertone}
              </div>
            </div>

            {/* Best Colors Palette */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Best Colors to Wear (Click to Drape)
                </h4>
                {activeDrapeColor && (
                  <button
                    onClick={() => setActiveDrapeColor(null)}
                    className="text-[10px] font-mono text-purple-400 hover:underline"
                  >
                    Clear Drape
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {colorResult.bestColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setActiveDrapeColor(color.hex)}
                    className={`space-y-1.5 text-center group cursor-pointer transition-transform ${
                      activeDrapeColor === color.hex ? 'scale-105 ring-2 ring-purple-400 rounded-xl p-1' : ''
                    }`}
                  >
                    <div
                      className="h-16 rounded-xl border border-white/20 shadow-md group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate">{color.name}</div>
                    <div className="text-[9px] font-mono text-purple-500">{color.hex}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors to Avoid */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-rose-500 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Colors to Avoid
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {colorResult.avoidColors.map((color) => (
                  <div key={color.name} className="space-y-1.5 text-center">
                    <div className="h-12 rounded-xl border border-white/20 opacity-70" style={{ backgroundColor: color.hex }} />
                    <div className="text-[10px] text-slate-700 dark:text-slate-300 truncate">{color.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gemini AI Palette Outfit Image Generator Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-indigo-950/40 to-pink-950/40 border border-purple-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-pink-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Generate Outfit in Your Personal Colors</h4>
                    <p className="text-[10px] font-mono text-purple-300">Powered by Gemini 3.1 Flash Image AI</p>
                  </div>
                </div>

                {/* Resolution Selector: 1K, 2K, 4K */}
                <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-purple-500/30">
                  <span className="text-[9px] font-mono text-purple-300 px-1">Quality:</span>
                  {(['1K', '2K', '4K'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        imageSize === size
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
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
                  placeholder={`Custom prompt (e.g. Elegant silk jumpsuit in ${colorResult.paletteName})`}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-500/30 text-white text-xs placeholder-purple-300/50 focus:outline-none focus:border-pink-400"
                />

                <button
                  onClick={handleGeneratePaletteOutfit}
                  disabled={isGeneratingOutfit}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className={`w-4 h-4 text-pink-300 ${isGeneratingOutfit ? 'animate-spin' : ''}`} />
                  <span>
                    {isGeneratingOutfit
                      ? `Gemini AI Rendering ${imageSize} Outfit Asset...`
                      : `Generate Custom Outfit in ${colorResult.season} Palette (${imageSize})`}
                  </span>
                </button>
              </div>

              {/* Rendered Generated Outfit Image */}
              {generatedOutfitUrl && (
                <div className="pt-2 space-y-2">
                  <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-purple-400/40 shadow-2xl group">
                    <img
                      src={generatedOutfitUrl}
                      alt="Gemini Color Outfit"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-mono text-purple-200 border border-purple-400/30 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      <span>Gemini Generated ({imageSize})</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-purple-500/15">
              <div className="p-3.5 rounded-2xl bg-purple-950/10 dark:bg-purple-950/30 border border-purple-500/20 space-y-1">
                <div className="text-[10px] font-mono text-purple-500 uppercase">Jewelry</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">{colorResult.jewelry}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/10 dark:bg-purple-950/30 border border-purple-500/20 space-y-1">
                <div className="text-[10px] font-mono text-purple-500 uppercase">Hair Suggestions</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">{colorResult.hairSuggestions}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/10 dark:bg-purple-950/30 border border-purple-500/20 space-y-1">
                <div className="text-[10px] font-mono text-purple-500 uppercase">Makeup Guide</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">{colorResult.makeup}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
