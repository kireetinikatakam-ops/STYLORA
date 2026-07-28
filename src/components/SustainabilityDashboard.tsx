import React, { useEffect, useRef } from 'react';
import { Leaf, DollarSign, Droplets, Wind, ShieldCheck, Award, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface MetricItem {
  label: string;
  rawValue: number;
  prefix?: string;
  suffix?: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const SustainabilityDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics: MetricItem[] = [
    { label: 'Money Saved', rawValue: 1420, prefix: '$', sub: 'Average $320 saved / semester', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Water Saved', rawValue: 12400, suffix: ' L', sub: 'Equivalent to 160 showers saved', icon: Droplets, color: 'text-cyan-400' },
    { label: 'CO₂ Reduced', rawValue: 180, suffix: ' kg', sub: 'Offsetting 25 tree seedlings', icon: Wind, color: 'text-indigo-400' },
    { label: 'Textile Waste Saved', rawValue: 24, suffix: ' kg', sub: 'Diverted from municipal landfills', icon: ShieldCheck, color: 'text-purple-400' },
    { label: 'Green Points Earned', rawValue: 3850, suffix: ' Pts', sub: 'Redeemable for marketplace discounts', icon: Award, color: 'text-amber-400' },
  ];

  const leaderboardData = [
    { campus: 'Stanford University', points: 42800, goal: 50000 },
    { campus: 'Parsons School of Design', points: 38400, goal: 50000 },
    { campus: 'Fashion Institute of Technology (FIT)', points: 34100, goal: 50000 },
    { campus: 'NYU Stern', points: 29500, goal: 50000 },
  ];

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Reveal header elements
      gsap.fromTo(
        '.sustainability-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Animate metric cards and counter numbers
      const cards = containerRef.current?.querySelectorAll('.metric-card');
      cards?.forEach((card, index) => {
        const metric = metrics[index];
        const counterEl = card.querySelector('.metric-counter');
        const counterObj = { val: 0 };

        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        if (counterEl) {
          gsap.to(counterObj, {
            val: metric.rawValue,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: () => {
              const formatted = Math.floor(counterObj.val).toLocaleString();
              counterEl.textContent = `${metric.prefix || ''}${formatted}${metric.suffix || ''}`;
            },
          });
        }
      });

      // 3. Animate leaderboard progress bars and points counter
      const leaderboardBars = containerRef.current?.querySelectorAll('.leaderboard-bar');
      leaderboardBars?.forEach((bar) => {
        const targetWidth = bar.getAttribute('data-target-width') || '0%';
        const ptsEl = bar.closest('.leaderboard-row')?.querySelector('.leaderboard-pts');
        const targetPts = parseInt(bar.getAttribute('data-target-pts') || '0', 10);
        const goalPts = parseInt(bar.getAttribute('data-goal-pts') || '50000', 10);
        const ptsObj = { val: 0 };

        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: targetWidth,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        if (ptsEl) {
          gsap.to(ptsObj, {
            val: targetPts,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: () => {
              const currentFormatted = Math.floor(ptsObj.val).toLocaleString();
              const goalFormatted = goalPts.toLocaleString();
              ptsEl.textContent = `${currentFormatted} / ${goalFormatted} Pts`;
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="sustainability" ref={containerRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="sustainability-header text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-700 dark:text-emerald-300">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>Circular Economy Impact</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
          Sustainability Dashboard
        </h2>
        <p className="text-slate-600 dark:text-purple-200/70 font-light text-sm sm:text-base">
          Track real-time environmental metrics generated by renting, swapping, and re-wearing fashion items on STYLORA.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="metric-card p-6 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black/60 border border-purple-500/20 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-purple-300/70">
                  {m.label}
                </span>
                <div className="p-2 rounded-xl bg-purple-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>

              {/* Counter target animated by GSAP ScrollTrigger */}
              <div className="metric-counter text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
                {m.prefix || ''}0{m.suffix || ''}
              </div>

              <div className="text-[10px] text-slate-600 dark:text-purple-300/80 font-mono">
                {m.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Environmental Progress Visualizer */}
      <div className="backdrop-blur-2xl bg-white/80 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Campus Environmental Leaderboard
            </span>
            <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">
              Top Sustainable Colleges
            </h3>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Stanford University #1 Rank</span>
          </div>
        </div>

        {/* College Impact Progress Bars */}
        <div className="space-y-4">
          {leaderboardData.map((c) => {
            const pct = ((c.points / c.goal) * 100).toFixed(1);
            return (
              <div key={c.campus} className="leaderboard-row space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-800 dark:text-purple-200">
                  <span>{c.campus}</span>
                  <span className="leaderboard-pts font-mono text-emerald-400">0 / {c.goal.toLocaleString()} Pts</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-purple-950/20 overflow-hidden">
                  <div
                    className="leaderboard-bar h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full"
                    data-target-width={`${pct}%`}
                    data-target-pts={c.points}
                    data-goal-pts={c.goal}
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

