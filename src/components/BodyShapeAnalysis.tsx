import React, { useState, useRef } from 'react';
import { Sparkles, UserCheck, RefreshCw, Sliders, CheckCircle2, Upload, Camera, Trash2, Scan, ShieldAlert, Layers } from 'lucide-react';
import { BodyShapeType, BodyShapeData } from '../types';
import { BodySilhouetteCanvas } from './3d/BodySilhouetteCanvas';

export const BodyShapeAnalysis: React.FC = () => {
  const [shapeType, setShapeType] = useState<BodyShapeType>('Hourglass');
  const [bust, setBust] = useState<number>(36);
  const [waist, setWaist] = useState<number>(26);
  const [hips, setHips] = useState<number>(37);
  const [fullBodyPhoto, setFullBodyPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shapes: BodyShapeType[] = ['Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle'];

  const [bodyData, setBodyData] = useState<BodyShapeData>({
    shape: 'Hourglass',
    description: 'Balanced upper body and lower body proportions with a distinctly defined waistline.',
    proportions: { bust: 36, waist: 26, hips: 37 },
    recommendations: [
      { title: 'Wrap Dresses & Belted Trench Coats', reason: 'Emphasizes waist definition and preserves natural upper/lower symmetry.' },
      { title: 'High-Waisted Wide Leg Trousers', reason: 'Elongates leg line while maintaining balanced hip curves.' },
      { title: 'Structured Blazers with Fitted Waist', reason: 'Adds modern architectural tailoring to silhouette.' },
    ],
    avoidList: ['Overly boxy shapeless shift dresses', 'Unstructured low-waist heavy tunics'],
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFullBodyPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCalculateShape = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/body-shape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: fullBodyPhoto || undefined,
          measurements: { bust, waist, hips },
        }),
      });
      const data = await response.json();
      if (data && data.shape) {
        setBodyData(data);
        setShapeType(data.shape as BodyShapeType);
        if (data.proportions) {
          if (data.proportions.bust) setBust(data.proportions.bust);
          if (data.proportions.waist) setWaist(data.proportions.waist);
          if (data.proportions.hips) setHips(data.proportions.hips);
        }
      }
    } catch (err) {
      console.error('Body shape error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculated ratios for UI
  const waistBustRatio = (waist / bust).toFixed(2);
  const waistHipRatio = (waist / hips).toFixed(2);

  return (
    <section id="bodyshape" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-700 dark:text-purple-300">
          <UserCheck className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400" />
          <span>AI Full Body Photo & Proportions Diagnostic</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
          Body Shape & Silhouette Analyzer
        </h2>
        <p className="text-slate-600 dark:text-purple-200/80 font-light text-sm sm:text-base">
          Upload a full-body photo or adjust measurement sliders. STYLORA’s AI analyzes silhouette geometry, shoulder-to-hip balance, and torso ratios to recommend custom tailoring rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Full Body Photo Upload & Measurement Sliders */}
        <div className="lg:col-span-5 backdrop-blur-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-purple-500/20 rounded-3xl p-6 shadow-2xl space-y-6">
          
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>1. Full-Body Photo Upload</span>
            </h3>
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-300 dark:border-purple-500/30">
              {fullBodyPhoto ? 'Photo Uploaded' : 'Required for AI Vision'}
            </span>
          </div>

          {/* Upload Area */}
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {fullBodyPhoto ? (
              <div className="relative h-72 w-full rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-xl group bg-slate-950">
                <img
                  src={fullBodyPhoto}
                  alt="Full Body Silhouette Upload"
                  className="w-full h-full object-cover"
                />

                {/* AI Laser Scan Overlay Animation */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-[1px] flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 shadow-lg shadow-pink-500 animate-pulse absolute top-1/3 inset-x-0" />
                    <div className="bg-slate-950/90 text-purple-200 text-xs font-mono px-4 py-2 rounded-xl border border-purple-400/50 flex items-center gap-2 shadow-2xl">
                      <Scan className="w-4 h-4 text-pink-400 animate-spin" />
                      <span>Gemini Scanning Bounding Landmark Grid...</span>
                    </div>
                  </div>
                )}

                {/* Bounding Crosshairs / Guidelines */}
                {!isAnalyzing && (
                  <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between opacity-80">
                    <div className="flex justify-between text-[9px] font-mono text-purple-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm w-fit">
                      <span>Shoulder / Bust Alignment</span>
                    </div>
                    <div className="w-full border-b border-dashed border-pink-400/60 my-auto" />
                    <div className="flex justify-between text-[9px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm w-fit">
                      <span>Waist & Hip Contour</span>
                    </div>
                  </div>
                )}

                {/* Clear Photo Action */}
                <button
                  type="button"
                  onClick={() => setFullBodyPhoto(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white shadow-lg transition-transform hover:scale-110"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-60 rounded-2xl border-2 border-dashed border-purple-400/40 dark:border-purple-500/30 hover:border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-all flex flex-col items-center justify-center p-6 text-center group cursor-pointer space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white block">
                    Upload Full-Body Photo
                  </span>
                  <span className="text-xs text-slate-500 dark:text-purple-300/70 font-light mt-1 block">
                    Standing front pose for automatic AI silhouette detection & landmark mapping
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* 3D Wireframe Canvas View */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-purple-300">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-pink-500" />
                3D Wireframe Mannequin Model
              </span>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">Interactive 360°</span>
            </div>
            <BodySilhouetteCanvas shape={shapeType} />
          </div>

          {/* Quick Shape Selector */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-purple-300/70 block">
              Quick Shape Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {shapes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setShapeType(s);
                    setBodyData({ ...bodyData, shape: s });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                    shapeType === s
                      ? 'bg-purple-600 text-white border-purple-400 font-bold shadow-md'
                      : 'bg-slate-100 dark:bg-purple-950/30 border-slate-200 dark:border-purple-500/20 text-slate-700 dark:text-purple-200 hover:border-purple-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Fine-Tuning Circumference Sliders */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-purple-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-500" />
                2. Manual Circumference Fine-Tuning
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-slate-700 dark:text-purple-300">
                  <span>Bust Circumference</span>
                  <span className="font-bold text-purple-600 dark:text-purple-300">{bust}"</span>
                </div>
                <input
                  type="range"
                  min="28"
                  max="52"
                  value={bust}
                  onChange={(e) => setBust(Number(e.target.value))}
                  className="w-full accent-purple-600 bg-slate-200 dark:bg-purple-950/40 rounded-lg cursor-pointer h-2"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-slate-700 dark:text-purple-300">
                  <span>Waist Circumference</span>
                  <span className="font-bold text-purple-600 dark:text-purple-300">{waist}"</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="46"
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  className="w-full accent-purple-600 bg-slate-200 dark:bg-purple-950/40 rounded-lg cursor-pointer h-2"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-slate-700 dark:text-purple-300">
                  <span>Hip Circumference</span>
                  <span className="font-bold text-purple-600 dark:text-purple-300">{hips}"</span>
                </div>
                <input
                  type="range"
                  min="28"
                  max="56"
                  value={hips}
                  onChange={(e) => setHips(Number(e.target.value))}
                  className="w-full accent-purple-600 bg-slate-200 dark:bg-purple-950/40 rounded-lg cursor-pointer h-2"
                />
              </div>
            </div>
          </div>

          {/* Primary Action CTA */}
          <button
            type="button"
            onClick={handleCalculateShape}
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-pink-300 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>
              {isAnalyzing
                ? 'Gemini AI Analyzing Silhouette & Proportions...'
                : fullBodyPhoto
                ? 'Analyze Full-Body Photo with Gemini AI'
                : 'Calculate Proportions & Tailoring Rules'}
            </span>
          </button>
        </div>

        {/* Right Column: Tailored Diagnostic Results Dashboard */}
        <div className="lg:col-span-7 backdrop-blur-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-purple-500/20 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-purple-500/20">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                AI Silhouette Classification
              </span>
              <h3 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mt-1">
                {bodyData.shape} Silhouette
              </h3>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-right">
              <span className="text-xs font-mono text-purple-700 dark:text-purple-300 block">Proportions</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                {bust}" - {waist}" - {hips}"
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-purple-100 leading-relaxed font-light">
            {bodyData.description}
          </p>

          {/* Proportions Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-purple-500/20 text-center">
              <span className="text-[10px] font-mono text-slate-500 dark:text-purple-300 block uppercase">
                Waist-to-Bust Ratio
              </span>
              <span className="text-lg font-bold font-serif text-purple-600 dark:text-purple-300">{waistBustRatio}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-purple-500/20 text-center">
              <span className="text-[10px] font-mono text-slate-500 dark:text-purple-300 block uppercase">
                Waist-to-Hip Ratio
              </span>
              <span className="text-lg font-bold font-serif text-emerald-600 dark:text-emerald-400">{waistHipRatio}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-purple-500/20 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-slate-500 dark:text-purple-300 block uppercase">
                Symmetry Index
              </span>
              <span className="text-lg font-bold font-serif text-pink-600 dark:text-pink-400">97.8%</span>
            </div>
          </div>

          {/* Recommended Flattering Cuts List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-purple-700 dark:text-purple-300 uppercase tracking-wider font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Recommended Architectural Cuts & Tailoring
            </h4>
            <div className="space-y-3">
              {bodyData.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 space-y-1 transition-all hover:border-purple-400"
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{rec.title}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-purple-200/80 font-light pl-6 leading-relaxed">
                    {rec.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Silhouettes to Avoid */}
          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-purple-500/20">
            <h4 className="text-xs font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Silhouettes & Hemlines to Avoid
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-700 dark:text-purple-200/80 space-y-1 pl-2">
              {bodyData.avoidList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

