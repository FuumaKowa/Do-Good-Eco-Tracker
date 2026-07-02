import React from "react";
import { Clock, Check, Coffee, AlertCircle, Sparkles, Droplet } from "lucide-react";
import { EnzymeSlot } from "../types";
import { Language, translations } from "../translations";

interface EnzymeSchedulerProps {
  activeDay: number;
  enzymeSlots: EnzymeSlot[];
  onToggleEnzymeSlot: (time: string) => void;
  waterIntake: number; // in ml
  onUpdateWaterIntake: (amount: number) => void;
  lang?: Language;
}

export default function EnzymeScheduler({ 
  activeDay, 
  enzymeSlots, 
  onToggleEnzymeSlot,
  waterIntake,
  onUpdateWaterIntake,
  lang = "en"
}: EnzymeSchedulerProps) {
  
  const totalSlots = enzymeSlots.length;
  const takenSlots = enzymeSlots.filter(s => s.taken).length;
  const sachetCount = takenSlots * 2;
  const targetSachets = totalSlots * 2;
  
  const progressPercent = totalSlots > 0 ? Math.round((takenSlots / totalSlots) * 100) : 0;
  
  const getPhaseName = () => {
    if (activeDay <= 3) return translations[lang].phase1Short;
    if (activeDay <= 6) return translations[lang].phase2Short;
    return translations[lang].phase3Short;
  };

  const getDoseFrequency = () => {
    if (activeDay <= 3 || activeDay >= 7) {
      return lang === "en" ? "Every 2 hours" : "每 2 小时一剂";
    }
    return lang === "en" ? "Every 1 hour (Deep Cycle)" : "每 1 小时一剂 (深层净化期)";
  };

  // Water tracking helpers
  const waterTargetMl = 2500; // 2.5L as target
  const waterPercent = Math.min(100, Math.round((waterIntake / waterTargetMl) * 100));

  const addWater = (amount: number) => {
    onUpdateWaterIntake(waterIntake + amount);
  };

  const resetWater = () => {
    onUpdateWaterIntake(0);
  };

  // Localized words for liquid volume containers
  const containers = {
    en: { cup: "Cup", bottle: "Bottle", thermos: "Thermos", carafe: "Carafe" },
    zh: { cup: "水杯", bottle: "矿泉水瓶", thermos: "保温杯", carafe: "水壶" }
  };

  const containerText = containers[lang];

  return (
    <div className="space-y-6" id="enzyme-scheduler-card">
      {/* 1. Progress Banner Card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-emerald-400 tracking-wider">
            {translations[lang].smartAssistant}
          </span>
          
          <h2 className="font-display text-lg font-bold text-white mt-3 flex items-center gap-2">
            <Coffee className="text-emerald-400 w-5 h-5" />
            {translations[lang].enzymeTracker}
          </h2>
          <p className="text-xs text-slate-350 mb-5">
            {getPhaseName()} • {lang === "en" ? `Day ${activeDay}` : `第 ${activeDay} 天`} • {getDoseFrequency()}
          </p>

          {/* Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Progress Circular style / ring bar */}
            <div className="flex items-center gap-5 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-500 ease-out"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-sm font-bold text-white">{progressPercent}%</span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-300 font-display">
                    {translations[lang].doneLabel}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider font-display block">
                  {translations[lang].sachetsLogged}
                </span>
                <span className="font-mono text-lg font-extrabold text-white block">
                  {sachetCount} / {targetSachets} <span className="text-xs font-normal text-slate-300">{translations[lang].sachetsUnit}</span>
                </span>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {translations[lang].enzymeDosageDisclaimer}
                </p>
              </div>
            </div>

            {/* Guidelines reminder */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex gap-2 items-start">
                <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="leading-normal text-[11px]">
                  {translations[lang].enzymeCycleInfo}
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                <p className="leading-normal text-[11px]">
                  {translations[lang].enzymeMissedInfo}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative ambient glow element */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* 2. Interactive Schedule Slots */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-display text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
          <span>{translations[lang].dailySchedule}</span>
          <span className="text-xs font-mono font-normal text-slate-500">
            {takenSlots} / {totalSlots} {translations[lang].taken}
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {enzymeSlots.map((slot) => {
            return (
              <button
                key={slot.time}
                onClick={() => onToggleEnzymeSlot(slot.time)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between h-24 cursor-pointer ${
                  slot.taken
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-800"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className={`p-1.5 rounded-lg ${slot.taken ? "bg-white/20" : "bg-white text-slate-400 border border-slate-200"}`}>
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  {slot.taken && (
                    <div className="bg-white text-slate-900 p-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div>
                  <span className={`text-xs font-mono font-bold block ${slot.taken ? "text-white" : "text-slate-900"}`}>
                    {slot.time}
                  </span>
                  <span className={`text-[9px] block font-display mt-0.5 ${slot.taken ? "text-slate-300" : "text-slate-400"}`}>
                    2 {translations[lang].sachetsUnit} (10g)
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Water Intake Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Droplet className="text-sky-500 w-4.5 h-4.5" />
              {translations[lang].waterTracker}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {translations[lang].waterDesc}
            </p>
          </div>
          <button 
            onClick={resetWater}
            className="text-[10px] text-slate-400 hover:text-slate-600 font-display font-medium cursor-pointer"
          >
            {lang === "en" ? "Reset" : "重置"}
          </button>
        </div>

        <div className="space-y-4">
          {/* Water progress indicator bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-semibold text-slate-700">
                {(waterIntake / 1000).toFixed(2)}{translations[lang].litersUnit} {lang === "en" ? "logged" : "已喝"}
              </span>
              <span className="text-slate-400">
                {translations[lang].waterTarget}: {(waterTargetMl / 1000).toFixed(1)}{translations[lang].litersUnit}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-slate-900 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          {/* Quick add buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => addWater(250)}
              className="py-2 px-1 text-center border border-slate-200 hover:border-slate-400 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 font-display transition-all cursor-pointer"
            >
              + 250 ml
              <span className="text-[8px] font-normal text-slate-400 block mt-0.5">{containerText.cup}</span>
            </button>
            <button
              onClick={() => addWater(500)}
              className="py-2 px-1 text-center border border-slate-200 hover:border-slate-400 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 font-display transition-all cursor-pointer"
            >
              + 500 ml
              <span className="text-[8px] font-normal text-slate-400 block mt-0.5">{containerText.bottle}</span>
            </button>
            <button
              onClick={() => addWater(750)}
              className="py-2 px-1 text-center border border-slate-200 hover:border-slate-400 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 font-display transition-all cursor-pointer"
            >
              + 750 ml
              <span className="text-[8px] font-normal text-slate-400 block mt-0.5">{containerText.thermos}</span>
            </button>
            <button
              onClick={() => addWater(1000)}
              className="py-2 px-1 text-center border border-slate-200 hover:border-slate-400 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 font-display transition-all cursor-pointer"
            >
              + 1.0 L
              <span className="text-[8px] font-normal text-slate-400 block mt-0.5">{containerText.carafe}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
