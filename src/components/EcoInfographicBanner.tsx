import React, { useState } from "react";
import { 
  Sparkles, 
  Droplet, 
  Ban, 
  AlertTriangle, 
  Moon, 
  Activity, 
  Compass, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Coffee,
  Egg,
  Soup,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Language, translations } from "../translations";

interface EcoInfographicBannerProps {
  activeDay?: number;
  lang?: Language;
}

export default function EcoInfographicBanner({ activeDay, lang = "en" }: EcoInfographicBannerProps) {
  const [isOpen, setIsOpen] = useState(true);

  const currentPhaseIndex = activeDay ? (activeDay <= 3 ? 0 : activeDay <= 6 ? 1 : 2) : -1;
  const isAnyPhaseActive = currentPhaseIndex !== -1;

  // Local helper translations for items not defined in system translations
  const localTexts = {
    en: {
      flyerBadge: "Official Plan Flyer",
      translationBadge: "English Translation",
      infographicTitle: "Do Good 9-Day Internal Eco-Plan",
      infographicSubtitle: "Eat, Drink, & Adjust Accordingly • Cleanse, Balance, and Renew your metabolic rhythm",
      visualGuideMap: "Visual Guide Map",
      hideInfographic: "Hide infographic",
      expandInfographic: "Expand digital infographic",
      slogan: "\"Eat in the correct order, and the body will naturally align!\"",
      sloganDesc: "Reduce dietary burden, assist digestion and metabolic circulation, and let your cells enter an active, lighter status. Natural balance, renewed vitality.",
      pillar1: "Lighten Load",
      pillar1Desc: "Fewer calories",
      pillar2: "Digestive Harmony",
      pillar2Desc: "Enzyme support",
      pillar3: "Metabolic Flush",
      pillar3Desc: "Water activation",
      journeyTitle: "The 9-Day Journey (3 Key Phases)",
      activeNow: "Active Now",
      daysRange: "Days",
      every2Hours: "Every 2 hours • 8 times daily",
      every1Hour: "Every 1 hour • 14 times daily",
      sachetsInfo1: "Total: 16 Sachets (80g) • From 8:00 AM to 10:00 PM",
      sachetsInfo2: "Total: 28 Sachets (140g) • From 8:00 AM to 9:00 PM",
      lifestyleTitle: "Lifestyle Recommendations",
      sleepEarly: "Sleep Early",
      sleepEarlyDesc: "Optimal cellular regeneration",
      leisureWalk: "Leisure Walking",
      leisureWalkDesc: "Activate low-impact blood flow",
      gentleStretch: "Gentle Stretching",
      gentleStretchDesc: "Support joint & muscle flexibility",
      noLateNights: "No Late Nights",
      noLateNightsDesc: "Prevent circadian cortisol spikes",
      consistentTimings: "Consistent Timings",
      consistentTimingsDesc: "Synchronize internal biological clock",
      hydrationTitle: "Hydration Target",
      hydrationLiters: "2.0 ~ 3.0 Liters",
      hydrationSub: "Warm Water Daily (公升温水)",
      strictlyAvoid: "Strictly Avoid (期间尽量避免)",
      avoidFried: "❌ Fried foods",
      avoidAlcohol: "❌ Alcohol",
      avoidBubbleTea: "❌ Bubble tea",
      avoidSoda: "❌ Sugary sodas",
      avoidProcessed: "❌ Processed snacks",
      avoidIceCold: "❌ Ice cold water",
      avoidMidnight: "❌ Midnight meals / Snacks",
      precautionsTitle: "Not Recommended For (不建议进行人士)",
      precaution1: "🤰 Pregnant/Nursing women",
      precaution2: "🩸 Severe diabetes",
      precaution3: "🩺 Chronic kidney issues",
      precaution4: "🦠 Severe stomach ulcers",
      precaution5: "📉 Chronic hypoglycemia",
      precaution6: "🏥 Undergoing major medical therapy",
      programFooter: "* This program is designed as a nutritional helper and dietary balance manager. It does not constitute medical therapy or diagnostic treatment. Results vary. T&C Applied."
    },
    zh: {
      flyerBadge: "官方计划折页",
      translationBadge: "简体中文版",
      infographicTitle: "都好复合酵素 9天体内生态计划",
      infographicSubtitle: "管好嘴、喝对水、排好毒 • 重塑代谢循环，开启细胞新生",
      visualGuideMap: "可视化打卡图谱",
      hideInfographic: "收起打卡图解",
      expandInfographic: "展开数字化折页",
      slogan: "“吃对顺序，身体自然排毒调理健康！”",
      sloganDesc: "减轻消化系统和肠道负担，加速体内毒素与重金属代谢，让每一个细胞都进入更轻盈、更通畅的净化轨道。",
      pillar1: "减轻胃肠负荷",
      pillar1Desc: "极低卡摄入",
      pillar2: "促进消化平衡",
      pillar2Desc: "复合酵素调理",
      pillar3: "细胞代谢排毒",
      pillar3Desc: "温水极速循环",
      journeyTitle: "9天更新打卡周期 (3个核心阶段)",
      activeNow: "正在进行中",
      daysRange: "第",
      every2Hours: "每 2 小时服用 2 袋 • 每日 8 次",
      every1Hour: "每 1 小时服用 2 袋 • 每日 14 次",
      sachetsInfo1: "共计：16 袋 (80g) • 早上 8:00 至 晚上 10:00",
      sachetsInfo2: "共计：28 袋 (140g) • 早上 8:00 至 晚上 9:00",
      lifestyleTitle: "健康生活建议",
      sleepEarly: "早睡早起",
      sleepEarlyDesc: "促进细胞深度代谢更新",
      leisureWalk: "舒缓散步",
      leisureWalkDesc: "激活微循环与淋巴排毒",
      gentleStretch: "轻度拉伸",
      gentleStretchDesc: "舒展全身肌肉与关节活性",
      noLateNights: "杜绝熬夜",
      noLateNightsDesc: "防止压力荷尔蒙皮质醇飙升",
      consistentTimings: "规律生物钟",
      consistentTimingsDesc: "让内脏代谢时钟保持同步",
      hydrationTitle: "每日饮水目标",
      hydrationLiters: "2.0 ~ 3.0 升",
      hydrationSub: "温水 (禁止饮用冰水)",
      strictlyAvoid: "期间严格禁忌",
      avoidFried: "❌ 煎炸油腻食品",
      avoidAlcohol: "❌ 酒精与饮酒",
      avoidBubbleTea: "❌ 奶茶与含糖饮料",
      avoidSoda: "❌ 碳酸碳水饮料",
      avoidProcessed: "❌ 加工膨化零食",
      avoidIceCold: "❌ 冰水与生冷食物",
      avoidMidnight: "❌ 宵夜与加餐",
      precautionsTitle: "不建议自行调理人士 (请先咨询医生)",
      precaution1: "🤰 孕妇及哺乳期女性",
      precaution2: "🩸 严重糖尿病患者",
      precaution3: "🩺 慢性肾脏功能不全者",
      precaution4: "🦠 严重胃溃疡/胃出血患者",
      precaution5: "📉 经常性严重低血糖患者",
      precaution6: "🏥 正在接受重大医学治疗或放化疗者",
      programFooter: "* 本调理折页仅用于科普和酵素打卡辅助，不代表临床诊断及治疗方案。调理成效因人而异。都好健康管理团队保留最终解释权。"
    }
  };

  const t = localTexts[lang];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="eco-infographic-banner">
      {/* Header Banner - Toggleable */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-all outline-none cursor-pointer"
      >
        <div className="flex gap-4 items-start">
          <div className="relative shrink-0 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl border border-amber-300 shadow-xs">
            <span className="font-display font-black text-amber-800 text-3xl leading-none">9</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-display">{t.flyerBadge}</span>
              <span className="text-xs text-slate-400 font-mono">{t.translationBadge}</span>
            </div>
            <h2 className="font-display font-black text-slate-900 text-lg md:text-xl tracking-tight mt-1 flex items-center gap-2">
              {t.infographicTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {t.infographicSubtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.visualGuideMap}</p>
            <p className="text-xs text-emerald-600 font-bold">{isOpen ? t.hideInfographic : t.expandInfographic}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 bg-[#fafaf9]/60 p-6 md:p-8 space-y-8 animate-fadeIn">
          
          {/* Slogan and Core Principles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">
                {t.slogan}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t.sloganDesc}
              </p>
            </div>
            
            {/* Core Pillars */}
            <div className="flex gap-3 text-center shrink-0 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <div className="flex-1 md:flex-initial bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[100px]">
                <span className="text-amber-600 text-lg">⚖️</span>
                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight mt-1">{t.pillar1}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{t.pillar1Desc}</p>
              </div>
              <div className="flex-1 md:flex-initial bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[100px]">
                <span className="text-emerald-600 text-lg">🌿</span>
                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight mt-1">{t.pillar2}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{t.pillar2Desc}</p>
              </div>
              <div className="flex-1 md:flex-initial bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[100px]">
                <span className="text-sky-600 text-lg">⚡</span>
                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight mt-1">{t.pillar3}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{t.pillar3Desc}</p>
              </div>
            </div>
          </div>

          {/* 3-Phase Interactive Journey Blocks */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-display">{t.journeyTitle}</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Phase 01 */}
              <div className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 border ${
                currentPhaseIndex === 0
                  ? "bg-white border-emerald-500 ring-4 ring-emerald-500/15 shadow-lg scale-[1.01]"
                  : isAnyPhaseActive
                  ? "bg-white/70 border-slate-200 opacity-60 hover:opacity-100"
                  : "bg-white border-slate-200 shadow-xs"
              }`}>
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg">{translations[lang].phaseLabel} 01</span>
                    {currentPhaseIndex === 0 ? (
                      <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold text-[9px] px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        {t.activeNow}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold font-mono">{lang === "en" ? "Days 1 ~ 3" : "第 1 ~ 3 天"}</span>
                    )}
                  </div>
                  <h5 className="font-display font-extrabold text-slate-900 text-sm mt-3">{translations[lang].phase1Brief}</h5>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    {translations[lang].phase1Desc}
                  </p>
                </div>
                
                <div className="p-5 space-y-4 flex-1">
                  {/* Breakfast */}
                  <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
                    <div className="bg-amber-50 text-amber-700 p-1.5 rounded-lg border border-amber-200 shrink-0 mt-0.5">
                      <Egg className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[11px] font-display">{translations[lang].breakfast}</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        {translations[lang].ph1Breakfast}
                      </p>
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
                    <div className="bg-emerald-50 text-emerald-700 p-1.5 rounded-lg border border-emerald-200 shrink-0 mt-0.5">
                      <Soup className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[11px] font-display">{translations[lang].lunch}</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        {translations[lang].ph1Lunch}
                      </p>
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="flex gap-3 items-start text-xs pb-1">
                    <div className="bg-slate-900 text-white p-1.5 rounded-lg shrink-0 mt-0.5">
                      <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-900 block text-[11px] font-display">{translations[lang].dinner}</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        {translations[lang].ph1Dinner}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-t border-slate-100 text-center text-xs">
                  <div className="font-semibold text-slate-800 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.every2Hours}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t.sachetsInfo1}
                  </p>
                </div>
              </div>

              {/* Phase 02 */}
              <div className={`text-white rounded-2xl overflow-hidden flex flex-col justify-between relative transition-all duration-300 border ${
                currentPhaseIndex === 1
                  ? "bg-slate-950 border-emerald-400 ring-4 ring-emerald-450/20 shadow-xl scale-[1.01]"
                  : isAnyPhaseActive
                  ? "bg-slate-950/70 border-slate-800 opacity-60 hover:opacity-100"
                  : "bg-slate-950 border-slate-800 shadow-md"
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                
                <div className="p-5 border-b border-slate-800 bg-white/5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-500 text-slate-950 font-mono font-bold text-xs px-2.5 py-1 rounded-lg">{translations[lang].phaseLabel} 02</span>
                    {currentPhaseIndex === 1 ? (
                      <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 font-bold text-[9px] px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        {t.activeNow}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-300 font-semibold font-mono">{lang === "en" ? "Days 4 ~ 6" : "第 4 ~ 6 天"}</span>
                    )}
                  </div>
                  <h5 className="font-display font-extrabold text-white text-sm mt-3">{translations[lang].phase2Brief}</h5>
                  <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                    {translations[lang].phase2Desc}
                  </p>
                </div>
                
                <div className="p-5 space-y-4 flex-1 relative z-10">
                  {/* Breakfast */}
                  <div className="flex gap-3 items-start text-xs border-b border-slate-800 pb-3">
                    <div className="bg-white/10 text-white p-1.5 rounded-lg border border-white/15 shrink-0 mt-0.5">
                      <Egg className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-white block text-[11px] font-display">{translations[lang].breakfast}</strong>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">
                        {translations[lang].ph2Breakfast}
                      </p>
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="flex gap-3 items-start text-xs border-b border-slate-800 pb-3">
                    <div className="bg-emerald-505/20 text-emerald-400 p-1.5 rounded-lg border border-white/10 shrink-0 mt-0.5">
                      <Coffee className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-emerald-400 block text-[11px] font-display">{translations[lang].lunch}</strong>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">
                        {translations[lang].ph2Lunch}
                      </p>
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="flex gap-3 items-start text-xs pb-1">
                    <div className="bg-emerald-505/20 text-emerald-400 p-1.5 rounded-lg border border-white/10 shrink-0 mt-0.5">
                      <Coffee className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-emerald-400 block text-[11px] font-display">{translations[lang].dinner}</strong>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">
                        {translations[lang].ph2Dinner}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white/5 border-t border-slate-800 text-center text-xs relative z-10">
                  <div className="font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.every1Hour}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1 font-mono">
                    {t.sachetsInfo2}
                  </p>
                </div>
              </div>

              {/* Phase 03 */}
              <div className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 border ${
                currentPhaseIndex === 2
                  ? "bg-white border-emerald-500 ring-4 ring-emerald-500/15 shadow-lg scale-[1.01]"
                  : isAnyPhaseActive
                  ? "bg-white/70 border-slate-200 opacity-60 hover:opacity-100"
                  : "bg-white border-slate-200 shadow-xs"
              }`}>
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg">{translations[lang].phaseLabel} 03</span>
                    {currentPhaseIndex === 2 ? (
                      <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold text-[9px] px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        {t.activeNow}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold font-mono">{lang === "en" ? "Days 7 ~ 9" : "第 7 ~ 9 天"}</span>
                    )}
                  </div>
                  <h5 className="font-display font-extrabold text-slate-900 text-sm mt-3">{translations[lang].phase3Brief}</h5>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    {translations[lang].phase3Desc}
                  </p>
                </div>
                
                <div className="p-5 space-y-4 flex-1">
                  {/* Breakfast */}
                  <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
                    <div className="bg-amber-50 text-amber-700 p-1.5 rounded-lg border border-amber-200 shrink-0 mt-0.5">
                      <Egg className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[11px] font-display">{translations[lang].breakfast}</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        {translations[lang].ph3Breakfast}
                      </p>
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
                    <div className="bg-emerald-50 text-emerald-700 p-1.5 rounded-lg border border-emerald-200 shrink-0 mt-0.5">
                      <Soup className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[11px] font-display">{translations[lang].lunch}</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        {translations[lang].ph3Lunch}
                      </p>
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="flex gap-3 items-start text-xs pb-1">
                    <div className="bg-slate-900 text-white p-1.5 rounded-lg shrink-0 mt-0.5">
                      <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-900 block text-[11px] font-display">{translations[lang].dinner}</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        {translations[lang].ph3Dinner}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-t border-slate-100 text-center text-xs">
                  <div className="font-semibold text-slate-800 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.every2Hours}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t.sachetsInfo1}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Grid: Suggestions, Water, Avoid List, Precautions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-200">
            
            {/* 1. Daily Lifestyle Suggestions */}
            <div className="md:col-span-4 space-y-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h5 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-display flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                {t.lifestyleTitle}
              </h5>
              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="flex gap-2.5 items-center">
                  <span className="p-1.5 rounded-lg bg-slate-50 text-slate-600 font-mono text-[10px] font-bold">早睡</span>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">{t.sleepEarly}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{t.sleepEarlyDesc}</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-center">
                  <span className="p-1.5 rounded-lg bg-slate-50 text-slate-600 font-mono text-[10px] font-bold">散步</span>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">{t.leisureWalk}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{t.leisureWalkDesc}</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-center">
                  <span className="p-1.5 rounded-lg bg-slate-50 text-slate-600 font-mono text-[10px] font-bold">轻运动</span>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">{t.gentleStretch}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{t.gentleStretchDesc}</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-center">
                  <span className="p-1.5 rounded-lg bg-slate-50 text-slate-600 font-mono text-[10px] font-bold">少熬夜</span>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">{t.noLateNights}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{t.noLateNightsDesc}</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-center">
                  <span className="p-1.5 rounded-lg bg-slate-50 text-slate-600 font-mono text-[10px] font-bold">规律作息</span>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">{t.consistentTimings}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{t.consistentTimingsDesc}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Hydration Target */}
            <div className="md:col-span-4 space-y-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h5 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-display flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-sky-500" />
                  {translations[lang].waterTargetTitle}
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">
                  {translations[lang].waterTargetText}
                </p>
              </div>

              <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-xl text-center space-y-1.5">
                <span className="text-3xl">💧</span>
                <div className="font-display font-black text-slate-900 text-lg">{t.hydrationLiters}</div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.hydrationSub}</p>
              </div>
            </div>

            {/* 3. Items to Avoid */}
            <div className="md:col-span-4 space-y-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h5 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-display flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-rose-500" />
                {t.strictlyAvoid}
              </h5>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-700">
                <span className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-1">
                  {t.avoidFried}
                </span>
                <span className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-1">
                  {t.avoidAlcohol}
                </span>
                <span className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-1">
                  {t.avoidBubbleTea}
                </span>
                <span className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-1">
                  {t.avoidSoda}
                </span>
                <span className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-1">
                  {t.avoidProcessed}
                </span>
                <span className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-1">
                  {t.avoidIceCold}
                </span>
                <span className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-1 col-span-2 justify-center">
                  {t.avoidMidnight}
                </span>
              </div>
            </div>

          </div>

          {/* Precautions & medical disclaimer details */}
          <div className="bg-amber-50/30 border border-amber-200 p-5 rounded-2xl space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              {t.precautionsTitle}
            </h5>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px] text-slate-500 font-bold">
              <div className="flex items-center gap-1.5 bg-white border border-amber-100 px-2.5 py-1.5 rounded-lg shadow-2xs">
                {t.precaution1}
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-amber-100 px-2.5 py-1.5 rounded-lg shadow-2xs">
                {t.precaution2}
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-amber-100 px-2.5 py-1.5 rounded-lg shadow-2xs">
                {t.precaution3}
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-amber-100 px-2.5 py-1.5 rounded-lg shadow-2xs">
                {t.precaution4}
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-amber-100 px-2.5 py-1.5 rounded-lg shadow-2xs">
                {t.precaution5}
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-amber-100 px-2.5 py-1.5 rounded-lg shadow-2xs">
                {t.precaution6}
              </div>
            </div>

            <p className="text-[9px] text-slate-400 italic pt-1 leading-normal text-center border-t border-amber-200/50">
              {t.programFooter}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
