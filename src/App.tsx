import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Droplet, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  Apple, 
  Clock, 
  BrainCircuit,
  Info,
  Languages
} from "lucide-react";
import { motion } from "motion/react";
import { FoodLog, EnzymeSlot, ProgramMetadata } from "./types";
import ProgramGuide from "./components/ProgramGuide";
import FoodTracker from "./components/FoodTracker";
import EnzymeScheduler from "./components/EnzymeScheduler";
import AiCoach from "./components/AiCoach";
import EcoInfographicBanner from "./components/EcoInfographicBanner";
import { Language, translations, metadataChineseTranslations } from "./translations";
import BrandLogo from "./components/BrandLogo";

export default function App() {
  // Manage language state (English/Chinese)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("do_good_lang");
    return (saved as Language) || "en";
  });

  // Save language preference on update
  useEffect(() => {
    localStorage.setItem("do_good_lang", lang);
  }, [lang]);

  // Active selected day of the 9-Day Program (1 to 9)
  const [activeDay, setActiveDay] = useState<number>(() => {
    const saved = localStorage.getItem("do_good_active_day");
    return saved ? parseInt(saved) : 1;
  });

  // Track state of program metadata
  const [metadata, setMetadata] = useState<ProgramMetadata | null>(null);

  // Track all food logs across days
  const [allFoodLogs, setAllFoodLogs] = useState<FoodLog[]>(() => {
    const saved = localStorage.getItem("do_good_all_food_logs");
    return saved ? JSON.parse(saved) : [];
  });

  // Track water intakes: e.g. { "day-1": 1500, "day-2": 2500 }
  const [waterRecords, setWaterRecords] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("do_good_water_records");
    return saved ? JSON.parse(saved) : {};
  });

  // Track enzyme slots checked state: e.g. { "day-1": { "8:00 AM": true } }
  const [enzymeRecords, setEnzymeRecords] = useState<Record<string, Record<string, boolean>>>(() => {
    const saved = localStorage.getItem("do_good_enzyme_records");
    return saved ? JSON.parse(saved) : {};
  });

  // Active Main UI View Tab for smaller screens (All, Guide, Meals, Enzyme, Coach)
  const [activeTab, setActiveTab] = useState<"guide" | "meals" | "enzyme" | "coach">("meals");

  // Fetch program metadata from Express server on mount
  useEffect(() => {
    fetch("/api/program-data")
      .then(res => res.json())
      .then(data => setMetadata(data))
      .catch(err => {
        console.error("Error fetching program metadata:", err);
        // Fallback metadata if fetch fails (e.g. before full backend initialization)
        setMetadata({
          phases: [
            {
              name: "Phase 1: Day 1-3 (Adjustment Phase)",
              breakfast: "2 Boiled eggs, with warm water, sugar-free soy milk, or black coffee.",
              lunch: "Vegetable Soup (corn, tomato, tofu, enoki mushroom, assorted vegetables). Add brown rice if hungry.",
              dinner: "Do Good Enzyme ONLY (No solid food).",
              enzymeDosage: "2 sachets (10g) every 2 hours, 8 times daily. Total 16 sachets (80g).",
              enzymeSchedule: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM", "10:00 PM"],
              waterTarget: "2-3 Liters of warm water daily.",
            },
            {
              name: "Phase 2: Day 4-6 (Deep Detox Phase)",
              breakfast: "2 Boiled eggs only.",
              lunch: "Do Good Enzyme ONLY (No solid food).",
              dinner: "Do Good Enzyme ONLY (No solid food).",
              enzymeDosage: "2 sachets (10g) every 1 hour, 14 times daily. Total 28 sachets (140g).",
              enzymeSchedule: [
                "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
                "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
              ],
              waterTarget: "2-3 Liters of warm water daily.",
            },
            {
              name: "Phase 3: Day 7-9 (Restoration Phase)",
              breakfast: "2 Boiled eggs, with warm water, sugar-free soy milk, or black coffee.",
              lunch: "Vegetable Soup (corn, tomato, tofu, enoki mushroom, assorted vegetables). Add brown rice if needed.",
              dinner: "Do Good Enzyme ONLY (No solid food).",
              enzymeDosage: "2 sachets (10g) every 2 hours, 8 times daily. Total 16 sachets (80g).",
              enzymeSchedule: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM", "10:00 PM"],
              waterTarget: "2-3 Liters of warm water daily.",
            }
          ],
          avoidList: ["Fried foods", "Alcohol", "Milk tea", "High-sugar drinks", "Processed foods", "Cold/Iced drinks", "Late-night snacks"],
          notRecommendedFor: ["Pregnant women", "Severe diabetes", "Kidney disease", "Stomach ulcer", "Low blood sugar"]
        });
      });
  }, []);

  // Save state persistence to localStorage on updates and scroll active button into view
  useEffect(() => {
    localStorage.setItem("do_good_active_day", activeDay.toString());
    const activeBtn = document.getElementById(`active-day-btn-${activeDay}`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeDay]);

  useEffect(() => {
    localStorage.setItem("do_good_all_food_logs", JSON.stringify(allFoodLogs));
  }, [allFoodLogs]);

  useEffect(() => {
    localStorage.setItem("do_good_water_records", JSON.stringify(waterRecords));
  }, [waterRecords]);

  useEffect(() => {
    localStorage.setItem("do_good_enzyme_records", JSON.stringify(enzymeRecords));
  }, [enzymeRecords]);

  // Current day calculations
  const currentDayKey = `day-${activeDay}`;
  
  // Get localized metadata depending on lang state
  const activeMetadata = metadata ? {
    ...metadata,
    phases: lang === "zh" ? metadataChineseTranslations.phases : metadata.phases,
    avoidList: lang === "zh" ? metadataChineseTranslations.avoidList : metadata.avoidList,
    notRecommendedFor: lang === "zh" ? metadataChineseTranslations.notRecommendedFor : metadata.notRecommendedFor,
  } : null;

  // Day-specific food logs filter
  const todayFoodLogs = allFoodLogs.filter(log => log.day === activeDay);

  // Day-specific water volume
  const todayWaterIntake = waterRecords[currentDayKey] || 0;

  // Day-specific enzyme schedule setup
  const getEnzymeScheduleForDay = (day: number) => {
    if (!activeMetadata) return [];
    const phaseIndex = day <= 3 ? 0 : day <= 6 ? 1 : 2;
    return activeMetadata.phases[phaseIndex].enzymeSchedule;
  };

  const todayEnzymeSchedule = getEnzymeScheduleForDay(activeDay);
  const todayCheckedSlots = enzymeRecords[currentDayKey] || {};

  const todayEnzymeSlots: EnzymeSlot[] = todayEnzymeSchedule.map(time => ({
    time,
    taken: !!todayCheckedSlots[time]
  }));

  // Operations handlers
  const handleAddFoodLog = (newLog: FoodLog) => {
    setAllFoodLogs(prev => [newLog, ...prev]);
  };

  const handleRemoveFoodLog = (id: string) => {
    setAllFoodLogs(prev => prev.filter(log => log.id !== id));
  };

  const handleToggleEnzymeSlot = (time: string) => {
    setEnzymeRecords(prev => {
      const currentDaySlots = prev[currentDayKey] || {};
      const updatedSlots = {
        ...currentDaySlots,
        [time]: !currentDaySlots[time]
      };
      return {
        ...prev,
        [currentDayKey]: updatedSlots
      };
    });
  };

  const handleUpdateWaterIntake = (amount: number) => {
    setWaterRecords(prev => ({
      ...prev,
      [currentDayKey]: amount
    }));
  };

  const getPhaseName = (day: number) => {
    if (day <= 3) return translations[lang].phase1Short;
    if (day <= 6) return translations[lang].phase2Short;
    return translations[lang].phase3Short;
  };

  const currentPhaseIndex = activeDay <= 3 ? 0 : activeDay <= 6 ? 1 : 2;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-800 flex flex-col font-sans selection:bg-slate-200 selection:text-slate-900" id="do-good-tracker-app">
      
      {/* 1. Header Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 border border-slate-800 p-1.5 rounded-2xl shadow-md shadow-slate-950/20 shrink-0 flex items-center justify-center">
                <BrandLogo mode="emblem" size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-black text-slate-900 text-sm tracking-tight">{translations[lang].brandName}</h1>
                  <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wider">{translations[lang].ecoTracker}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">{translations[lang].companionSubtitle}</p>
              </div>
            </div>

            {/* Language Switcher for mobile screen */}
            <button
              onClick={() => setLang(prev => prev === "en" ? "zh" : "en")}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 text-xs px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs font-medium font-display shrink-0 md:hidden ml-auto"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === "en" ? "中文" : "English"}</span>
            </button>
          </div>

          {/* Day Selection Row (Day 1 to 9) and Desktop Language switcher */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none select-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-display mr-1 shrink-0">{translations[lang].activeDayLabel}</span>
              {Array.from({ length: 9 }, (_, i) => i + 1).map((day) => {
                const isSelected = activeDay === day;
                const hasLogs = allFoodLogs.some(l => l.day === day);
                const water = waterRecords[`day-${day}`] || 0;
                const completedDoses = Object.keys(enzymeRecords[`day-${day}`] || {}).filter(k => (enzymeRecords[`day-${day}`] || {})[k]).length;

                return (
                  <button
                    key={day}
                    id={`active-day-btn-${day}`}
                    onClick={() => {
                      setActiveDay(day);
                    }}
                    className={`relative w-9 h-9 rounded-xl flex flex-col items-center justify-center transition-colors border shrink-0 text-xs cursor-pointer outline-none ${
                      isSelected
                        ? "border-slate-900 text-white font-bold shadow-md shadow-slate-900/10"
                        : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border-slate-200"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeDayHighlight"
                        className="absolute inset-0 bg-slate-900 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="text-[10px] font-display relative z-10">{day}</span>
                    {(hasLogs || water > 0 || completedDoses > 0) && (
                      <span className={`w-1 h-1 rounded-full mt-0.5 relative z-10 ${isSelected ? "bg-emerald-300" : "bg-slate-900"}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop Language Switcher */}
            <button
              onClick={() => setLang(prev => prev === "en" ? "zh" : "en")}
              className="hidden md:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 text-xs px-3 py-2 rounded-xl transition-all cursor-pointer shadow-2xs font-medium font-display shrink-0 ml-2"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === "en" ? "中文" : "English"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Board */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 gap-6 overflow-x-hidden">
        
        {/* Official Translated Infographic Banner */}
        <EcoInfographicBanner activeDay={activeDay} lang={lang} />
        
        {/* Dynamic Overview banner showing selected Day */}
        {metadata && (
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display block">{translations[lang].currentProgramMetrics}</span>
              <h2 className="font-display font-extrabold text-slate-900 text-lg">
                {lang === "zh" ? `${translations[lang].ofYourEcoPlan}第 ${activeDay} ${translations[lang].daysUnit}` : `${translations[lang].daysUnit} ${activeDay} ${translations[lang].ofYourEcoPlan}`}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {translations[lang].currentIn} <strong className="text-slate-900 font-bold">{getPhaseName(activeDay)}</strong>. {translations[lang].focusAdvice}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs font-medium">
              <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
                <Droplet className="w-4 h-4 text-sky-500" />
                <div>
                  <span className="text-[9px] text-slate-400 block font-display">{translations[lang].waterLabel}</span>
                  <span className="font-mono font-bold text-slate-800">{(todayWaterIntake / 1000).toFixed(2)} / 2.5 {translations[lang].litersUnit}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
                <Clock className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="text-[9px] text-slate-400 block font-display">{translations[lang].enzymeLabel}</span>
                  <span className="font-mono font-bold text-slate-800">
                    {todayEnzymeSlots.filter(s => s.taken).length} / {todayEnzymeSlots.length} {translations[lang].dosesUnit}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
                <Apple className="w-4 h-4 text-orange-500" />
                <div>
                  <span className="text-[9px] text-slate-400 block font-display">{translations[lang].mealsLoggedLabel}</span>
                  <span className="font-mono font-bold text-slate-800">{todayFoodLogs.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile View Toggle Buttons */}
        <div className="grid grid-cols-4 gap-1 md:hidden bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
          <button
            onClick={() => setActiveTab("meals")}
            className={`py-2 text-xs font-bold rounded-xl font-display transition-all ${
              activeTab === "meals" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            {translations[lang].tabMeals}
          </button>
          <button
            onClick={() => setActiveTab("enzyme")}
            className={`py-2 text-xs font-bold rounded-xl font-display transition-all ${
              activeTab === "enzyme" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            {translations[lang].tabEnzyme}
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`py-2 text-xs font-bold rounded-xl font-display transition-all ${
              activeTab === "guide" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            {translations[lang].tabGuide}
          </button>
          <button
            onClick={() => setActiveTab("coach")}
            className={`py-2 text-xs font-bold rounded-xl font-display transition-all ${
              activeTab === "coach" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            {translations[lang].tabCoach}
          </button>
        </div>

        {/* Dashboard grid - Desktop show side by side; Mobile show selected tab */}
        {activeMetadata ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Food Analyser & Plan Guide */}
            <div className={`lg:col-span-7 space-y-6 ${activeTab !== "meals" && activeTab !== "guide" ? "hidden lg:block" : ""}`}>
              {/* Meal Tracker & Analyzers */}
              {(activeTab === "meals" || activeTab === "guide") && (
                <div className={activeTab === "guide" ? "hidden lg:block" : ""}>
                  <FoodTracker 
                    activeDay={activeDay} 
                    foodLogs={todayFoodLogs}
                    onAddFoodLog={handleAddFoodLog}
                    onRemoveFoodLog={handleRemoveFoodLog}
                    lang={lang}
                  />
                </div>
              )}

              {/* Show Plan Guide when on Guide tab (mobile) or default (desktop can display guide and tracker neatly) */}
              {(activeTab === "guide" || activeTab === "meals") && (
                <div className={activeTab === "meals" ? "hidden lg:block" : ""}>
                  <ProgramGuide metadata={activeMetadata} activeDay={activeDay} lang={lang} />
                </div>
              )}
            </div>

            {/* Right Column: Enzyme Scheduler & AI coach chat */}
            <div className={`lg:col-span-5 space-y-6 ${activeTab !== "enzyme" && activeTab !== "coach" ? "hidden lg:block" : ""}`}>
              {/* Enzyme & water schedules */}
              {(activeTab === "enzyme" || activeTab === "coach") && (
                <div className={activeTab === "coach" ? "hidden lg:block" : ""}>
                  <EnzymeScheduler
                    activeDay={activeDay}
                    enzymeSlots={todayEnzymeSlots}
                    onToggleEnzymeSlot={handleToggleEnzymeSlot}
                    waterIntake={todayWaterIntake}
                    onUpdateWaterIntake={handleUpdateWaterIntake}
                    lang={lang}
                  />
                </div>
              )}

              {/* AI Chat Coach */}
              {(activeTab === "coach" || activeTab === "enzyme") && (
                <div className={activeTab === "enzyme" ? "hidden lg:block" : ""}>
                  <AiCoach activeDay={activeDay} lang={lang} />
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <div className="relative w-10 h-10 mx-auto">
              <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-xs">{translations[lang].initialisingDb}</p>
          </div>
        )}
      </main>

      {/* 3. Footer and Warnings Disclaimer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6 border-t border-slate-800 mt-12 shrink-0">
        <div className="max-w-7xl mx-auto space-y-6 text-center">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="bg-slate-950 border border-slate-800 p-1.5 rounded-xl flex items-center justify-center shadow-inner">
                <BrandLogo mode="emblem" size={18} />
              </div>
              <span className="font-display font-bold text-white tracking-wider text-xs">{translations[lang].footerTitle}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              {translations[lang].footerSubtitle}
            </p>
          </div>

          <div className="space-y-3 text-[10px] text-slate-500 max-w-3xl mx-auto text-justify md:text-center leading-relaxed font-medium">
            <p className="flex items-center gap-1 justify-center text-amber-500 font-bold mb-1">
              <Info className="w-3.5 h-3.5" /> {translations[lang].medicalDisclaimer}
            </p>
            <p>
              {translations[lang].disclaimerText1}
            </p>
            <p>
              {translations[lang].disclaimerText2}
            </p>
          </div>

          <div className="text-[9px] text-slate-600 pt-3">
            &copy; {new Date().getFullYear()} {translations[lang].copyrightText}
          </div>
        </div>
      </footer>
    </div>
  );
}
