import React, { useState } from 'react';
import { Sparkles, Award, RefreshCw, CheckCircle2 } from 'lucide-react';
import { StyleScoreData } from '../types';

export const StyleScore: React.FC = () => {
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [scoreData, setScoreData] = useState<StyleScoreData>({
    totalScore: 94,
    breakdown: {
      bodyMatch: 96,
      colorMatch: 95,
      trendScore: 92,
      occasionMatch: 94,
      sustainabilityScore: 95,
    },
    feedback:
      'Exceptional visual balance! Combining sustainable organic linen with recycled silver hardware earns top marks. To reach 98+, consider swapping dark shoes for nude tinted leather.',
  });

  const handleRecalculateScore = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/ai/style-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outfitName: 'Minimalist Lavender Chic',
          occasion: 'Runway Minimalist',
        }),
      });
      const data = await response.json();
      if (data && data.totalScore) {
        setScoreData(data);
      }
    } catch (err) {
      console.error('Style score error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <section id="score" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-700 dark:text-purple-300">
          <Award className="w-3.5 h-3.5 text-pink-400" />
          <span>AI Style Score Meter</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
          Real-Time Outfit Rating Engine
        </h2>
        <p className="text-slate-600 dark:text-purple-200/70 font-light text-sm sm:text-base">
          STYLORA analyzes color theory, body proportion rules, current runway trends, occasion appropriateness,
          and sustainability impact to calculate a comprehensive style score.
        </p>
      </div>

      <div className="backdrop-blur-2xl bg-white/80 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Circular Meter Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* SVG Arc Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-purple-950/20 dark:text-purple-950/50"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-purple-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * scoreData.totalScore) / 100}
                strokeLinecap="round"
                stroke="url(#purpleGradient)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#CE93D8" />
                  <stop offset="50%" stopColor="#9575CD" />
                  <stop offset="100%" stopColor="#EC407A" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score Number Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold font-serif bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {scoreData.totalScore}
              </span>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-300">out of 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              Haute Couture Certified
            </h3>
            <p className="text-xs text-emerald-500 font-mono">Top 2% Overall Style Rating</p>
          </div>

          <button
            onClick={handleRecalculateScore}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>Recalculate Score</span>
          </button>
        </div>

        {/* Right Column: Breakdown Progress Meters & AI Tips */}
        <div className="md:col-span-7 space-y-6">
          <h4 className="text-xs font-mono text-purple-600 dark:text-purple-300 uppercase tracking-wider">
            Diagnostic Score Breakdown
          </h4>

          <div className="space-y-3">
            {[
              { label: 'Body Shape Harmony', score: scoreData.breakdown.bodyMatch },
              { label: 'Color Undertone Match', score: scoreData.breakdown.colorMatch },
              { label: 'Runway Trend Index', score: scoreData.breakdown.trendScore },
              { label: 'Occasion Suitability', score: scoreData.breakdown.occasionMatch },
              { label: 'Sustainability Rating', score: scoreData.breakdown.sustainabilityScore },
            ].map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-800 dark:text-purple-200">
                  <span>{metric.label}</span>
                  <span className="font-mono text-purple-600 dark:text-purple-300">{metric.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-purple-950/20 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Stylist Feedback Box */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-2">
            <div className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              AI Style Optimization Suggestion
            </div>
            <p className="text-slate-700 dark:text-purple-200/80 font-light leading-relaxed">
              {scoreData.feedback}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
