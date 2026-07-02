import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, BrainCircuit, RotateCcw } from "lucide-react";
import { ChatMessage } from "../types";
import { Language, translations } from "../translations";

interface AiCoachProps {
  activeDay: number;
  lang?: Language;
}

export default function AiCoach({ activeDay, lang = "en" }: AiCoachProps) {
  // Key for local storage with language suffix so conversations don't leak languages
  const storageKey = `do_good_chat_history_${lang}`;

  const getWelcomeMessage = () => {
    if (lang === "en") {
      return `Hello! I'm your Do Good Eco Coach. 🌿 I am fully trained on the "Do Good 9-Day Eco-Plan". Currently, you are on Day ${activeDay}. How can I assist you with your enzyme dosage, meals, or wellness schedule today?`;
    } else {
      return `您好！我是您的都好健康生态导师。🌿 我对“都好复合酵素 9天体内生态计划”有着非常深入的了解。今天您处于第 ${activeDay} 天。有什么关于酵素用量、每日餐食或调理作息的问题，需要我帮您解答的吗？`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        sender: "coach",
        text: getWelcomeMessage(),
        timestamp: Date.now()
      }
    ];
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Save history on changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  // Reset or adjust initial message if language changes and message list is pristine
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      setMessages([
        {
          sender: "coach",
          text: getWelcomeMessage(),
          timestamp: Date.now()
        }
      ]);
    }
  }, [lang, activeDay]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsSending(true);

    try {
      // Prepare history format (last 10 messages for context window stability)
      const history = messages.slice(-10).map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      const res = await fetch("/api/chat-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          currentDay: activeDay,
          lang: lang
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === "en" ? "Failed to get response from Coach." : "无法获得导师的回复。"));
      }

      const coachMsg: ChatMessage = {
        sender: "coach",
        text: data.reply || (lang === "en" ? "I am here to guide you. Could you rephrase your question?" : "我在这里为您解答，请换个方式提问好吗？"),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, coachMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: "system",
          text: `${lang === "en" ? "Error" : "错误"}: ${err.message || (lang === "en" ? "Failed to connect to AI Coach server. Make sure your API key is correctly configured." : "连接 AI 导师服务失败，请检查您的 API 密钥设置。")}`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = () => {
    if (window.confirm(translations[lang].confirmResetChat)) {
      const initial = [
        {
          sender: "coach",
          text: getWelcomeMessage(),
          timestamp: Date.now()
        }
      ];
      setMessages(initial);
      localStorage.removeItem(storageKey);
    }
  };

  const starters = lang === "en" ? [
    `What should I eat for breakfast and lunch on Day ${activeDay}?`,
    "What are the core rules of Phase 2 (Deep Eco)?",
    "I'm feeling very hungry in the evening, what can I do?",
    "Why is drinking warm water so important in this program?",
    "How does the Do Good Complex Enzyme 131 support metabolism?"
  ] : [
    `第 ${activeDay} 天的早餐和午餐我应该吃什么？`,
    "第二阶段（深层排毒）的核心规则是什么？",
    "晚上觉得特别饿，我应该吃什么或者怎么缓解？",
    "为什么在这个生态调理计划中喝温水如此重要？",
    "都好复合酵素131是如何辅助体内细胞代谢的？"
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]" id="ai-coach-panel">
      {/* Coach Header */}
      <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm relative">
            <BrainCircuit className="h-5 w-5 text-emerald-400" />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-slate-900 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight">
              {translations[lang].ecoCoachTitle}
            </h3>
            <span className="text-[10px] text-slate-300 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> 
              {translations[lang].ecoCoachSubtitle}
            </span>
          </div>
        </div>
        <button 
          onClick={clearChat}
          title={translations[lang].resetConversation}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer outline-none"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user";
          const isSystem = msg.sender === "system";

          if (isSystem) {
            return (
              <div key={idx} className="bg-rose-50 text-rose-800 border border-rose-150 p-3 rounded-xl text-[10px] leading-relaxed text-center font-mono">
                {msg.text}
              </div>
            );
          }

          return (
            <div 
              key={idx} 
              className={`flex gap-2.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
            >
              {/* Profile Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                isUser ? "bg-slate-150 border border-slate-200 text-slate-700" : "bg-slate-900 text-white"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4 text-emerald-400" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                isUser 
                  ? "bg-slate-900 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
              }`}>
                {msg.text}
                <div className={`text-[8px] mt-1.5 text-right ${isUser ? "text-slate-350" : "text-slate-400 font-mono"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        {isSending && (
          <div className="flex gap-2.5 max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 animate-pulse">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Starters & Inputs section */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0 space-y-3">
        {/* Chips starters */}
        {messages.length === 1 && !isSending && (
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none snap-x select-none">
            {starters.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(starter)}
                className="bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-[10px] text-slate-600 font-bold py-1.5 px-3 rounded-full shrink-0 snap-center transition-all cursor-pointer outline-none"
              >
                {starter}
              </button>
            ))}
          </div>
        )}

        {/* Text Area input and send button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(inputValue); }}
            placeholder={lang === "en" ? `Ask Coach about Day ${activeDay} rules...` : `向 AI 导师咨询关于第 ${activeDay} 天的规则...`}
            disabled={isSending}
            className="flex-1 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl px-4 py-3 text-xs outline-none transition-all"
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isSending}
            className="bg-slate-900 hover:bg-slate-950 disabled:bg-slate-100 text-white disabled:text-slate-400 p-3 rounded-xl transition-colors shadow-sm outline-none shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
