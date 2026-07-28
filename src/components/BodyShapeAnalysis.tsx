import React, { useState } from 'react';
import { Sparkles, UserCheck, RefreshCw, Sliders, CheckCircle2 } from 'lucide-react';
import { BodyShapeType, BodyShapeData } from '../types';
import { BodySilhouetteCanvas } from './3d/BodySilhouetteCanvas';

export const BodyShapeAnalysis: React.FC = () => {
  const [shapeType, setShapeType] = useState<BodyShapeType>('Hourglass');
  const [bust, setBust] = useState<number>(36);
  const [waist, setWaist] = useState<number>(26);
  const [hips, setHips] = useState<number>(37);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

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

  const handleCalculateShape = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/body-shape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measurements: { bust, waist, hips } }),
      });
      const data = await response.json();
      if (data && data.shape) {
        setBodyData(data);
        setShapeType(data.shape as BodyShapeType);
      }
    } catch (err) {
      console.error('Body shape error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="bodyshape" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-700 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>AI Body Silhouette Analysis</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
          Body Shape & Proportion Analyzer
        </h2>
        <p className="text-slate-600 dark:text-purple-200/70 font-light text-sm sm:text-base">
          Analyze body silhouette proportions in 3D to uncover flattering cuts, hemline rules, and tailored
          architectural silhouettes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Sliders & 3D Wireframe Canvas */}
        <div className="lg:col-span-5 backdrop-blur-xl bg-white/80 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-500" />
              Proportion Measurements (Inches)
            </h3>
          </div>

          {/* 3D Wireframe Silhouette Canvas */}
          <BodySilhouetteCanvas shape={shapeType} />

          {/* Quick Shape Selector */}
          <div className="flex flex-wrap gap-1.5">
            {shapes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setShapeType(s);
                  setBodyData({ ...bodyData, shape: s });
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                  shapeType === s
                    ? 'bg-purple-600 text-white border-purple-400 font-semibold'
                    : 'bg-white/40 dark:bg-purple-950/20 border-purple-500/10 text-slate-700 dark:text-purple-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-700 dark:text-purple-300">
                <span>Bust Circumference</span>
                <span>{bust}"</span>
              </div>
              <input
                type="range"
                min="28"
                max="50"
                value={bust}
                onChange={(e) => setBust(Number(e.target.value))}
                className="w-full accent-purple-500 bg-purple-950/20 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-700 dark:text-purple-300">
                <span>Waist Circumference</span>
                <span>{waist}"</span>
              </div>
              <input
                type="range"
                min="20"
                max="45"
                value={waist}
                onChange={(e) => setWaist(Number(e.target.value))}
                className="w-full accent-purple-500 bg-purple-950/20 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-700 dark:text-purple-300">
                <span>Hip Circumference</span>
                <span>{hips}"</span>
              </div>
              <input
                type="range"
                min="28"
                max="55"
                value={hips}
                onChange={(e) => setHips(Number(e.target.value))}
                className="w-full accent-purple-500 bg-purple-950/20 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleCalculateShape}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-semibold text-xs shadow-xl flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Calculating 3D Proportions...' : 'Recalculate Tailored Recommendations'}</span>
          </button>
        </div>

        {/* Right Column: Tailored Recommendations */}
        <div className="lg:col-span-7 backdrop-blur-2xl bg-white/80 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-8 shadow-2xl space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400">
              3D Body Shape Analysis
            </span>
            <h3 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mt-1">
              {bodyData.shape} Silhouette
            </h3>
            <p className="text-xs text-slate-600 dark:text-purple-200/80 mt-2 leading-relaxed">
              {bodyData.description}
            </p>
          </div>

          {/* Recommended Cuts List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-purple-600 dark:text-purple-300 uppercase tracking-wider">
              Flattering Tailoring Cuts
            </h4>
            <div className="space-y-3">
              {bodyData.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-purple-950/10 dark:bg-purple-950/30 border border-purple-500/20 space-y-1"
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {rec.title}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-purple-200/70 font-light pl-6">
                    {rec.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cuts to Avoid */}
          <div className="space-y-2 pt-2 border-t border-purple-500/15">
            <h4 className="text-xs font-mono text-rose-500 uppercase tracking-wider">
              Silhouettes to Avoid
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-purple-200/70 space-y-1">
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
