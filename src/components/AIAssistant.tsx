import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile, CalculatedFootprint } from '../utils/calculator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  userProfile: UserProfile;
  calculatedFootprint: CalculatedFootprint;
  savedCO2: number;
}

export default function AIAssistant({ userProfile, calculatedFootprint, savedCO2 }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am your Carbon Intelligence Coach. I've analyzed your onboarding baseline profile. Ask me any question, or ask for the fastest way to shrink your footprint!"
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const generateLocalAnswer = (query: string) => {
    const q = query.toLowerCase();
    const categories = calculatedFootprint?.breakdown || { food: 0, travel: 0, energy: 0, shopping: 0 };
    const highestSector = Object.keys(categories).reduce((a, b) => 
      categories[a as keyof typeof categories] > categories[b as keyof typeof categories] ? a : b, 
      'travel'
    );
    const emissionValue = categories[highestSector as keyof typeof categories] || 0;

    if (q.includes('fastest') || q.includes('reduce') || q.includes('help') || q.includes('first') || q.includes('how')) {
      let advice = '';
      if (highestSector === 'travel') {
        advice = `Your highest baseline emission area is travel/transit (${emissionValue} tons CO₂e). The fastest way to curb this is targeting flights and vehicle efficiency. Substituting driving with public transit or carpooling can reduce single-commuter impact immediately.`;
      } else if (highestSector === 'diet' || highestSector === 'food') {
        advice = `Your profile shows food/diet choices are your primary source of emissions (${emissionValue} tons CO₂e). Cutting out red meat even 3 days a week yields large-scale environmental returns. Substituting beef with plant options decreases diet emissions by up to 50%.`;
      } else if (highestSector === 'energy') {
        advice = `Domestic energy utilities present your main footprint leverage area (${emissionValue} tons CO₂e). Upgrading to smart thermostats, or shifting your electric tariff to standard community solar or municipal renewable sources can dramatically reduce carbon metrics instantly.`;
      } else {
        advice = `Transitioning away from fast manufacturing, recycling paper/plastics, and buying items built to last is a key first step. Consider utilizing the Daily Action Tracker to build daily streaks!`;
      }
      return `Based on your specific baseline analysis, your single largest emission contributor is **${highestSector}** at **${emissionValue} tons CO₂e/yr**. \n\n**Actionable Suggestion:** ${advice}\n\n*(Note: Running in high-fidelity local advisor fallback mode)*`;
    }

    if (q.includes('diet') || q.includes('food') || q.includes('eat')) {
      return "A standard plant-based diet reduces individual footprint impact dramatically compared to high-meat regimes. Even adopting meatless Mondays offsets several kilograms of direct carbon equivalents over brief tracking periods.";
    }

    if (q.includes('car') || q.includes('drive') || q.includes('travel') || q.includes('flight')) {
      return "An average gasoline car outputs around 3.6 to 4.1 metric tons of CO₂e per year. Optimizing your commuting schedule, utilizing high-speed rail instead of regional flights, and transitioning to high-efficiency or hybrid vehicles are proven mitigation paths.";
    }

    return "I can help with questions regarding diet optimizations, public transit options, home utility reductions, and lifestyle carbon metrics. What aspect of your green footprint should we discuss?";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          profile: userProfile,
          footprint: calculatedFootprint,
          savedCO2
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const originalError = errorData.error || `HTTP error ${response.status}`;
        console.warn("Server chatbot returned an error, using local fallback", originalError);
        setApiError(originalError);
        
        // Simulating the prompt delay for the local advice
        setTimeout(() => {
          const localAns = generateLocalAnswer(input);
          setMessages(prev => [...prev, { role: 'assistant', content: localAns }]);
          setIsLoading(false);
        }, 500);
        return;
      }
    } catch (err: any) {
      console.warn("Connection to server failed, utilizing local fallback engine", err);
      setApiError(err?.message || "Failed to reach server");
      
      setTimeout(() => {
        const localAns = generateLocalAnswer(input);
        setMessages(prev => [...prev, { role: 'assistant', content: localAns }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    setIsLoading(false);
  };

  return (
    <div id="ai-assistant-wrapper" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
            <Sparkles className="w-5 h-5 animate-spin-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white">Gemini Climate Advisor</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Advanced Carbon Footprint Coach</p>
          </div>
        </div>
      </div>

      {apiError && (
        <div className="bg-amber-50 text-amber-800 px-4 py-2.5 text-xs flex items-center gap-2 border-b border-amber-100 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Local advisory active: {apiError}.</span>
        </div>
      )}

      {/* Messages Window */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white border-emerald-600 rounded-tr-none font-medium'
                  : 'bg-white text-slate-800 border-slate-100 rounded-tl-none font-medium'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-150 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 shadow-sm font-semibold">
              <span className="inline-block animate-pulse">Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Chat Form Footer */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
        <input
          id="chat-input-field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., What is the fastest way to drop my baseline transit food footprint?"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none font-medium text-slate-705"
        />
        <button
          id="submit-chat-btn"
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
