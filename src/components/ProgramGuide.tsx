import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Droplet, 
  AlertTriangle, 
  Activity, 
  Ban, 
  CheckCircle, 
  Clock, 
  Coffee, 
  Egg, 
  Soup 
} from "lucide-react";
import { motion } from "motion/react";
import { ProgramMetadata } from "../types";
import { Language, translations } from "../translations";

interface ProgramGuideProps {
  metadata: ProgramMetadata;
  activeDay: number;
  lang?: Language;
}

export default function ProgramGuide({ metadata, activeDay, lang = "en" }: ProgramGuideProps) {
  const [activeTab, setActiveTab] = useState<number>(() => {
    if (activeDay <= 3) return 0;
    if (activeDay <= 6) return 1;
    return 2;
  });

  useEffect(() => {
    const phaseIndex = activeDay <= 3 ? 0 : activeDay <= 6 ? 1 : 2;
    setActiveTab(phaseIndex);
  }, [activeDay]);

  const getDayRangeForPhase = (index: number) => {
    if (index === 0) return lang === "en" ? "Days 1-3" : "第 1-3 天";
    if (index === 1) return lang === "en" ? "Days 4-6" : "第 4-6 天";
    return lang === "en" ? "Days 7-9" : "第 7-9 天";
  };

  const getPhaseShortDesc = (index: number) => {
    if (index === 0) return lang === "en" ? "Adjustment" : "调整适应";
    if (index === 1) return lang === "en" ? "Deep Eco" : "深层排毒";
    return lang === "en" ? "Balance" : "平衡复食";
  };

  const currentPhaseIndex = activeDay <= 3 ? 0 : activeDay <= 6 ? 1 : 2;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="program-guide-card">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100">
            <Activity className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-slate-950">
              {translations[lang].guideTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {translations[lang].guideSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Phase Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-2xl mb-6 border border-slate-200/60 relative">
          {metadata.phases.map((phase, idx) => {
            const isCurrent = currentPhaseIndex === idx;
            const isSelected = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`relative py-2.5 px-2 rounded-xl text-xs font-semibold font-display transition-colors flex flex-col items-center gap-0.5 outline-none cursor-pointer ${
                  isSelected
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activePhaseTab"
                    className="absolute inset-0 bg-slate-900 rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className="opacity-90 relative z-10">{getDayRangeForPhase(idx)}</span>
                <span className="text-[10px] font-normal opacity-80 truncate max-w-full relative z-10">
                  {getPhaseShortDesc(idx)}
                </span>
                {isCurrent && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 relative z-10 ${isSelected ? "bg-emerald-400" : "bg-emerald-500"}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Phase Plan */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-900 text-sm">
                {metadata.phases[activeTab].name}
              </h3>
              <span className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-semibold border border-slate-200">
                {getDayRangeForPhase(activeTab)}
              </span>
            </div>
          </div>

          {/* Meals Plan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Breakfast Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Egg className="w-16 h-16 text-slate-800" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Egg className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-display">
                  {translations[lang].breakfastLabel}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {metadata.phases[activeTab].breakfast}
              </p>
            </div>

            {/* Lunch Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Soup className="w-16 h-16 text-slate-800" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Soup className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-display">
                  {translations[lang].lunchLabel}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {metadata.phases[activeTab].lunch}
              </p>
            </div>

            {/* Dinner Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Coffee className="w-16 h-16 text-slate-800" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-display">
                  {translations[lang].dinnerLabel}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {metadata.phases[activeTab].dinner}
              </p>
            </div>
          </div>

          {/* Enzyme Dosage Guide */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5 font-display">
              <Clock className="w-4 h-4 text-emerald-600" />
              {translations[lang].enzymeDosageTitle}
            </h4>
            <p className="text-xs text-slate-850 font-semibold mb-2 leading-relaxed">
              {metadata.phases[activeTab].enzymeDosage}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {metadata.phases[activeTab].enzymeSchedule.map((time, idx) => (
                <span 
                  key={idx} 
                  className="bg-white border border-slate-200 text-slate-800 text-[10px] px-2.5 py-1 rounded-lg font-mono font-medium"
                >
                  {time}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2 italic">
              {translations[lang].waterAdviceAsterisk}
            </p>
          </div>

          {/* Quick Stats Grid: Water Goal & Habits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-2xl p-4 flex items-start gap-3 bg-white">
              <div className="bg-slate-100 text-slate-700 p-2 rounded-xl mt-0.5 border border-slate-200">
                <Droplet className="w-4 h-4 text-sky-500" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800 font-display">{translations[lang].waterTargetTitle}</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {translations[lang].waterTargetText}
                </p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 flex items-start gap-3 bg-white">
              <div className="bg-slate-100 text-slate-700 p-2 rounded-xl mt-0.5 border border-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800 font-display">{translations[lang].habitsTitle}</h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {translations[lang].habitsText}
                </p>
              </div>
            </div>
          </div>

          {/* Avoid List & Precautions */}
          <div className="border-t border-slate-200 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display">
                <Ban className="w-4 h-4 text-rose-500" />
                {translations[lang].strictlyAvoidTitle}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {metadata.avoidList.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="bg-slate-50 text-slate-800 border border-slate-200 text-[11px] px-2.5 py-1 rounded-full font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                {translations[lang].precautionsTitle}
              </h4>
              <ul className="text-[10px] text-slate-500 space-y-1 list-disc list-inside">
                {metadata.notRecommendedFor.map((item, idx) => (
                  <li key={idx} className="leading-normal">{item}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
