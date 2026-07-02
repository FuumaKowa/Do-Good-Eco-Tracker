import React, { useState, useRef } from "react";
import { 
  Camera, 
  Upload, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  X, 
  Apple, 
  ShieldAlert 
} from "lucide-react";
import { FoodLog } from "../types";
import { Language, translations } from "../translations";

interface FoodTrackerProps {
  activeDay: number;
  foodLogs: FoodLog[];
  onAddFoodLog: (log: FoodLog) => void;
  onRemoveFoodLog: (id: string) => void;
  lang?: Language;
}

export default function FoodTracker({ 
  activeDay, 
  foodLogs, 
  onAddFoodLog, 
  onRemoveFoodLog,
  lang = "en"
}: FoodTrackerProps) {
  const [activeMode, setActiveMode] = useState<"upload" | "camera" | "text">("upload");
  
  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Text Input State
  const [textDescription, setTextDescription] = useState<string>("");

  // Common State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("");

  // Stats calculation for today
  const dailyCalories = foodLogs.reduce((acc, curr) => acc + curr.calories, 0);
  const dailyProtein = foodLogs.reduce((acc, curr) => acc + curr.protein, 0);
  const dailyCarbs = foodLogs.reduce((acc, curr) => acc + curr.carbs, 0);
  const dailyFat = foodLogs.reduce((acc, curr) => acc + curr.fat, 0);
  const totalCompliant = foodLogs.filter(log => log.compliant).length;

  // Localized loading steps
  const loadingQuotes = {
    en: [
      "Gemini is analyzing your food ingredients...",
      "Estimating calories and nutrients...",
      "Comparing meal items with Day " + activeDay + " detox plan rules...",
      "Formulating custom enzyme dosage recommendations...",
      "Generating metabolic and lifestyle support tips..."
    ],
    zh: [
      "Gemini 正在为您分析食物成分...",
      "正在估算食物热量与营养素含量...",
      "正在对比第 " + activeDay + " 天的生态调理规则...",
      "正在为您定制建议服用酵素方案...",
      "正在生成专属身体代谢与生活打卡贴士..."
    ]
  };

  const currentLoadingQuotes = loadingQuotes[lang];

  const cycleLoadingSteps = () => {
    let index = 0;
    setLoadingStep(currentLoadingQuotes[0]);
    const interval = setInterval(() => {
      index = (index + 1) % currentLoadingQuotes.length;
      setLoadingStep(currentLoadingQuotes[index]);
    }, 2500);
    return interval;
  };

  // Image File Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera triggers
  const startCamera = async () => {
    try {
      setErrorMessage(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, 
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setIsCameraActive(false);
      setErrorMessage(translations[lang].cameraError);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64Img = canvas.toDataURL("image/jpeg");
        setSelectedImage(base64Img);
        stopCamera();
        setActiveMode("upload");
        setAnalysisResult(null);
      }
    }
  };

  // Call the Gemini API server-side endpoint
  const handleAnalyze = async () => {
    if (activeMode === "upload" && !selectedImage) {
      setErrorMessage(translations[lang].uploadFirstError);
      return;
    }
    if (activeMode === "text" && !textDescription.trim()) {
      setErrorMessage(translations[lang].textFirstError);
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);
    const intervalId = cycleLoadingSteps();

    try {
      const payload: any = {
        currentDay: activeDay,
        lang: lang
      };

      if (activeMode === "upload" && selectedImage) {
        payload.image = selectedImage;
      } else if (activeMode === "text") {
        payload.text = textDescription;
      }

      const res = await fetch("/api/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === "en" ? "Failed to analyze food intake details." : "分析餐食失败，请重试。"));
      }

      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || (lang === "en" ? "An error occurred during food analysis. Please try again." : "餐食分析中出现未知错误，请重试。"));
    } finally {
      clearInterval(intervalId);
      setIsAnalyzing(false);
    }
  };

  const handleLogFood = () => {
    if (!analysisResult) return;

    const newLog: FoodLog = {
      id: "food-" + Date.now(),
      timestamp: Date.now(),
      day: activeDay,
      foodName: analysisResult.foodName,
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fat: analysisResult.fat,
      compliant: analysisResult.compliant,
      complianceMessage: analysisResult.complianceMessage,
      detectedAvoidedItems: analysisResult.detectedAvoidedItems || [],
      enzymeDosageRecommendation: analysisResult.enzymeDosageRecommendation,
      metabolicTip: analysisResult.metabolicTip,
      imageUrl: activeMode === "upload" && selectedImage ? selectedImage : undefined
    };

    onAddFoodLog(newLog);
    
    // Reset inputs & results
    setAnalysisResult(null);
    setSelectedImage(null);
    setTextDescription("");
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Local helpers
  const localLabels = {
    en: {
      logIntake: "Log Food Intake",
      uploadPhoto: "Upload Photo",
      takePhoto: "Take Photo",
      describeFood: "Describe Food",
      dragDropDesc: "Click to browse or drag & drop food image",
      supportsFormats: "Supports PNG, JPG or HEIC format",
      captureBtn: "Capture Frame",
      cancelBtn: "Cancel",
      turnCameraOn: "Turn Camera On",
      cameraInactive: "Camera is currently inactive or loading...",
      descPlaceholder: "e.g., I had a medium bowl of vegetable soup containing corn, mushrooms, a small piece of tofu, and a side of sugar-free soy milk.",
      analysingInProgress: "Nutritional Analysis In Progress...",
      identifiedFood: "Identified Food",
      programAssessment: "Program Assessment",
      saveLog: "Save to Daily Log",
      discard: "Discard",
      totalCalories: "Total Calories",
      loggedMeals: "Logged Meals",
      compliantFoods: "Compliant Foods",
      noMealsToday: "No meals logged yet for Day " + activeDay + ". Complete your meal analysis above to save entries!"
    },
    zh: {
      logIntake: "饮食排毒打卡",
      uploadPhoto: "上传照片",
      takePhoto: "相机拍照",
      describeFood: "文字描述",
      dragDropDesc: "点击浏览文件或将食物照片拖放到这里",
      supportsFormats: "支持 PNG, JPG 或 HEIC 格式图片",
      captureBtn: "拍摄照片",
      cancelBtn: "取消",
      turnCameraOn: "开启相机权限",
      cameraInactive: "相机未启动或正在加载...",
      descPlaceholder: "例如：我喝了一碗蔬菜汤（玉米、香菇、一小块豆腐、生菜），还喝了一杯无糖豆浆。",
      analysingInProgress: "AI 正在对餐食进行深度分析...",
      identifiedFood: "智能识别食物",
      programAssessment: "生态合规评估",
      saveLog: "记录打卡此餐",
      discard: "放弃重试",
      totalCalories: "今日累计热量",
      loggedMeals: "打卡次数",
      compliantFoods: "合规餐饮",
      noMealsToday: "今天（第 " + activeDay + " 天）还没有打卡任何餐食。请在上方输入食物或上传图片，让 AI 分析并记录！"
    }
  };

  const tl = localLabels[lang];

  return (
    <div className="space-y-6" id="food-tracker-container">
      {/* Tracker Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h2 className="font-display text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Apple className="text-emerald-500 w-5 h-5" />
          {tl.logIntake}
        </h2>

        {/* Upload Mode Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => { setActiveMode("upload"); setErrorMessage(null); stopCamera(); }}
            className={`flex-1 pb-3 text-xs font-bold font-display border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === "upload" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Upload className="w-4 h-4" />
            {tl.uploadPhoto}
          </button>
          <button
            onClick={() => { setActiveMode("camera"); setErrorMessage(null); startCamera(); }}
            className={`flex-1 pb-3 text-xs font-bold font-display border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === "camera" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Camera className="w-4 h-4" />
            {tl.takePhoto}
          </button>
          <button
            onClick={() => { setActiveMode("text"); setErrorMessage(null); stopCamera(); }}
            className={`flex-1 pb-3 text-xs font-bold font-display border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === "text" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <FileText className="w-4 h-4" />
            {tl.describeFood}
          </button>
        </div>

        {/* Mode Contents */}
        <div className="space-y-4">
          {/* 1. File Upload / Drop Area */}
          {activeMode === "upload" && (
            <div>
              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-64 flex justify-center items-center">
                  <img src={selectedImage} alt="Selected food preview" className="max-h-64 object-contain" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-950 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer text-center group"
                >
                  <div className="bg-slate-100 text-slate-600 p-3 rounded-full mb-3 border border-slate-200 group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {tl.dragDropDesc}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {tl.supportsFormats}
                  </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </div>
              )}
            </div>
          )}

          {/* 2. Web Camera Frame */}
          {activeMode === "camera" && (
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex flex-col justify-center items-center">
              {isCameraActive ? (
                <>
                  <video 
                    ref={videoRef} 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button 
                      onClick={capturePhoto}
                      className="bg-slate-900 hover:bg-slate-950 text-white font-semibold font-display px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md text-xs cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      {tl.captureBtn}
                    </button>
                    <button 
                      onClick={stopCamera}
                      className="bg-slate-700 hover:bg-slate-800 text-white font-semibold font-display px-5 py-2.5 rounded-full text-xs cursor-pointer"
                    >
                      {tl.cancelBtn}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <p className="text-xs mb-3">{tl.cameraInactive}</p>
                  <button 
                    onClick={startCamera}
                    className="bg-slate-900 hover:bg-slate-950 text-white font-semibold font-display px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    {tl.turnCameraOn}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. Text Manual Description */}
          {activeMode === "text" && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-display">
                {lang === "en" ? "Food Description & Ingredients" : "膳食食材与做法描述"}
              </label>
              <textarea
                value={textDescription}
                onChange={(e) => setTextDescription(e.target.value)}
                placeholder={tl.descPlaceholder}
                rows={4}
                className="w-full p-4 border border-slate-200 rounded-2xl text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-slate-50 outline-none leading-relaxed"
              />
            </div>
          )}

          {/* Errors */}
          {errorMessage && (
            <div className="bg-rose-50 text-rose-850 border border-rose-100 p-4 rounded-2xl flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
              <div className="text-xs leading-normal">
                {errorMessage}
              </div>
            </div>
          )}

          {/* Action trigger button */}
          {(!analysisResult && !isAnalyzing) && (
            <button
              onClick={handleAnalyze}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-display font-semibold py-3 px-4 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {translations[lang].analyzeBtn}
            </button>
          )}

          {/* Loading Animation Card */}
          {isAnalyzing && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-1.5 bg-slate-200 rounded-full animate-ping opacity-75" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800">
                  {tl.analysingInProgress}
                </p>
                <p className="text-[11px] text-slate-500 italic animate-pulse max-w-xs mx-auto">
                  {loadingStep}
                </p>
              </div>
            </div>
          )}

          {/* Analysis Result Card */}
          {analysisResult && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                    {tl.identifiedFood}
                  </span>
                  <h3 className="font-display font-bold text-sm text-slate-900 mt-0.5">{analysisResult.foodName}</h3>
                </div>
                <div>
                  {analysisResult.compliant ? (
                    <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {translations[lang].compliant}
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-800 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-rose-200">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> {translations[lang].nonCompliant}
                    </span>
                  )}
                </div>
              </div>

              {/* Calories & Macro Grid */}
              <div className="grid grid-cols-4 gap-2 bg-white border border-slate-200 p-3 rounded-xl shadow-xs text-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold font-display block uppercase">{translations[lang].caloriesLabel}</span>
                  <span className="font-mono text-sm font-bold text-slate-900 flex items-center justify-center gap-0.5 mt-0.5">
                    <Flame className="w-3 h-3 text-orange-500 inline" /> {analysisResult.calories} <span className="text-[9px] font-normal text-slate-400">kcal</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold font-display block uppercase">{translations[lang].proteinLabel}</span>
                  <span className="font-mono text-xs font-semibold text-slate-800 block mt-0.5">{analysisResult.protein}{translations[lang].g}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold font-display block uppercase">{translations[lang].carbsLabel}</span>
                  <span className="font-mono text-xs font-semibold text-slate-800 block mt-0.5">{analysisResult.carbs}{translations[lang].g}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold font-display block uppercase">{translations[lang].fatLabel}</span>
                  <span className="font-mono text-xs font-semibold text-slate-800 block mt-0.5">{analysisResult.fat}{translations[lang].g}</span>
                </div>
              </div>

              {/* Compliance Message */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-display block">
                  {tl.programAssessment}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 p-3 rounded-xl">{analysisResult.complianceMessage}</p>
              </div>

              {/* Detected Avoided items */}
              {analysisResult.detectedAvoidedItems && analysisResult.detectedAvoidedItems.length > 0 && (
                <div className="bg-rose-50 border border-rose-200/50 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-rose-900 flex items-center gap-1 mb-1 font-display">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    {translations[lang].avoidComponentDetected}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {analysisResult.detectedAvoidedItems.map((item: string, idx: number) => (
                      <span key={idx} className="bg-white border border-rose-200 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Enzyme recommendations */}
              <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-800 flex items-center gap-1 font-display uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  {translations[lang].enzymeRecommendation}:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">{analysisResult.enzymeDosageRecommendation}</p>
              </div>

              {/* Metabolic Support Tip */}
              <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-800 flex items-center gap-1 font-display uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  {translations[lang].metabolicTipTitle}:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{analysisResult.metabolicTip}"</p>
              </div>

              {/* Actions buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleLogFood}
                  className="flex-1 bg-slate-900 hover:bg-slate-950 text-white font-semibold font-display text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> {tl.saveLog}
                </button>
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="bg-white border border-slate-200 text-slate-800 font-semibold font-display text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {tl.discard}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Daily Metrics Dashboard & Intake Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-display text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          {translations[lang].todayFoodLog}
        </h3>

        {/* Nutritional totals summary bar */}
        <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="text-center">
            <span className="text-[9px] text-slate-400 font-bold font-display uppercase tracking-wider block">{tl.totalCalories}</span>
            <span className="font-mono text-sm font-extrabold text-slate-900 mt-1 block">{dailyCalories} kcal</span>
          </div>
          <div className="text-center border-x border-slate-200">
            <span className="text-[9px] text-slate-400 font-bold font-display uppercase tracking-wider block">{tl.loggedMeals}</span>
            <span className="font-mono text-sm font-extrabold text-slate-900 mt-1 block">{foodLogs.length}</span>
          </div>
          <div className="text-center">
            <span className="text-[9px] text-slate-400 font-bold font-display uppercase tracking-wider block">{tl.compliantFoods}</span>
            <span className="font-mono text-sm font-extrabold text-emerald-600 mt-1 block">{totalCompliant}</span>
          </div>
        </div>

        {/* List of food logs */}
        {foodLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-xs">{tl.noMealsToday}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {foodLogs.map((log) => (
              <div 
                key={log.id} 
                className={`border rounded-2xl p-4 transition-colors flex gap-4 bg-white ${
                  log.compliant ? "border-slate-200" : "border-rose-200 bg-rose-50/5"
                }`}
              >
                {/* Photo if uploaded */}
                {log.imageUrl && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-200">
                    <img src={log.imageUrl} alt={log.foodName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                
                {/* Logs metadata */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate font-display">{log.foodName}</h4>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-2 text-[10px] font-mono text-slate-500">
                    <span className="font-bold text-slate-700">{log.calories} kcal</span>
                    <span>•</span>
                    <span>{translations[lang].proteinLabel[0] || "P"}: {log.protein}{translations[lang].g}</span>
                    <span>•</span>
                    <span>{translations[lang].carbsLabel[0] || "C"}: {log.carbs}{translations[lang].g}</span>
                    <span>•</span>
                    <span>{translations[lang].fatLabel[0] || "F"}: {log.fat}{translations[lang].g}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {log.complianceMessage}
                  </p>
                  
                  {log.detectedAvoidedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {log.detectedAvoidedItems.map((item, idx) => (
                        <span key={idx} className="bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {lang === "en" ? "Avoid:" : "避免食用:"} {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delete Trigger */}
                <button 
                  onClick={() => onRemoveFoodLog(log.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg align-self-start transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
