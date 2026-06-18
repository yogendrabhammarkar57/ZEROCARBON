import React, { useState } from 'react';
import { repeatableActions, RepeatableAction } from '../data/carbonFactors';
import { Bus, Utensils, Wind, Thermometer, ShoppingBag, Trash2, Calendar, CheckCircle2, Droplet, Recycle } from 'lucide-react';

interface LoggedAction extends RepeatableAction {
  timestamp: string;
}

interface ActionLoggerProps {
  onLogAction: (action: RepeatableAction) => void;
  onRemoveLoggedAction: (index: number) => void;
  loggedActions: LoggedAction[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Bus,
  Utensils,
  Wind,
  Thermometer,
  ShoppingBag,
  Trash2,
  Droplet,
  Recycle
};

export default function ActionLogger({ onLogAction, onRemoveLoggedAction, loggedActions }: ActionLoggerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'travel', 'food', 'energy', 'shopping', 'water', 'waste'];

  const filteredActions = selectedCategory === 'all'
    ? repeatableActions
    : repeatableActions.filter(act => act.category === selectedCategory);

  const totalSavedToday = loggedActions.reduce((sum, item) => sum + item.co2Saved, 0);

  return (
    <div id="action-logger-container" className="space-y-6">
      {/* Sticky running daily offsets banner */}
      <div className="sticky top-16 z-20 bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-md shadow-emerald-600/10 border border-emerald-500/30 hover:scale-[1.005] transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl text-white shrink-0 animate-pulse">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-emerald-100">Daily Offsets Running Total</h4>
            <p className="text-sm font-bold mt-0.5">
              Accumulated Reductions Today: <span className="bg-slate-900/40 text-emerald-300 ml-1 px-2.5 py-1 rounded-full text-xs font-black font-mono border border-emerald-500/25">-{totalSavedToday.toFixed(1)} kg CO₂e</span>
            </p>
          </div>
        </div>
        <p className="text-[10px] text-emerald-100 font-extrabold uppercase tracking-widest hidden sm:block">Every kilogram helps limit global warming to 1.5°C 🌿</p>
      </div>

      <div id="action-logger-wrapper" className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-4">
        {/* Available Actions to Select & Log */}
        <div id="available-actions-panel" className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-800 tracking-tight">Log Daily Green Action</h3>
              <p className="text-xs text-slate-500 mt-0.5">Choose real-world positive decisions to track daily offsets.</p>
            </div>
            {/* Category Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg self-start overflow-x-auto max-w-full no-scrollbar">
              {categories.map(cat => (
                <button
                  id={`tab-category-${cat}`}
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md capitalize transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredActions.map(action => {
            const IconComponent = ICON_MAP[action.icon] || CheckCircle2;
            const count = loggedActions.filter(act => act.id === action.id).length;
            const isMaxed = count >= 5;
            return (
              <div
                id={`action-item-${action.id}`}
                key={action.id}
                className={`flex items-start justify-between p-4 rounded-xl border transition-all duration-150 ${
                  isMaxed
                    ? 'border-slate-100 bg-slate-50 opacity-80'
                    : 'border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/25'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                    isMaxed ? 'bg-slate-200 text-slate-400' : 'bg-emerald-100/50 text-emerald-700'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-semibold text-xs leading-tight ${isMaxed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{action.label}</h4>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        isMaxed ? 'bg-slate-200 text-slate-400' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        -{action.co2Saved} kg CO₂e
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isMaxed ? 'bg-amber-150 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Logged: {count}/5
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  id={`btn-log-action-${action.id}`}
                  type="button"
                  disabled={isMaxed}
                  onClick={() => onLogAction(action)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${
                    isMaxed
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-white hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200 hover:border-emerald-600 cursor-pointer shadow-sm'
                  }`}
                >
                  {isMaxed ? 'Max 5x' : 'Log +'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Realtime Action Logs Feed */}
      <div id="action-history-panel" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <h3 className="text-base font-semibold text-slate-800 tracking-tight">History Logs</h3>
        <p className="text-xs text-slate-500 mt-0.5">Recorded actions in this tracking cycle</p>

        <div className="mt-4 flex-1 flex flex-col justify-center">
          {loggedActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-200 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-500 font-medium max-w-[200px]">No actions recorded yet. Perform and log daily green habits to earn credentials!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {loggedActions
                .map((item, originalIdx) => ({ item, originalIdx }))
                .slice()
                .reverse()
                .map(({ item, originalIdx }) => {
                  const IconComponent = ICON_MAP[item.icon] || CheckCircle2;
                  return (
                    <div
                      id={`history-item-${originalIdx}`}
                      key={originalIdx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs hover:border-slate-200 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="bg-emerald-100/30 p-1.5 rounded-md text-emerald-600 shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-700 truncate">{item.label}</p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="font-bold text-emerald-600">
                          -{item.co2Saved} kg
                        </span>
                        <button
                          id={`btn-remove-logged-${originalIdx}`}
                          type="button"
                          onClick={() => onRemoveLoggedAction(originalIdx)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-slate-100 transition-all cursor-pointer shrink-0"
                          title="Remove log entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
