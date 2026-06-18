import { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ActionLogger from './components/ActionLogger';
import AIAssistant from './components/AIAssistant';
import { Leaf, BarChart2, MessageSquare, PlusCircle, AlertTriangle } from 'lucide-react';
import { UserProfile, CalculatedFootprint } from './utils/calculator';
import { RepeatableAction } from './data/carbonFactors';

export interface LoggedAction extends RepeatableAction {
  timestamp: string;
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('CARBON_USER_PROFILE');
    return saved ? JSON.parse(saved) : null;
  });

  const [footprint, setFootprint] = useState<CalculatedFootprint | null>(() => {
    const saved = localStorage.getItem('CARBON_FOOTPRINT_DATA');
    return saved ? JSON.parse(saved) : null;
  });

  const [loggedActions, setLoggedActions] = useState<LoggedAction[]>(() => {
    const saved = localStorage.getItem('CARBON_LOGGED_ACTIONS');
    if (saved) return JSON.parse(saved);

    // Dynamic initial actions representing Water & Waste categories
    const baseTime = Date.now();
    return [
      {
        id: 'composted',
        label: 'Composted organic kitchen waste',
        category: 'waste',
        co2Saved: 0.5,
        icon: 'Trash2',
        timestamp: new Date(baseTime - 14400000).toISOString()
      },
      {
        id: 'recycled_materials',
        label: 'Recycled paper, glass, and metal containers',
        category: 'waste',
        co2Saved: 0.7,
        icon: 'Recycle',
        timestamp: new Date(baseTime - 10800000).toISOString()
      },
      {
        id: 'shorter_shower',
        label: 'Halved standard shower duration (saves freshwater heating)',
        category: 'water',
        co2Saved: 0.9,
        icon: 'Droplet',
        timestamp: new Date(baseTime - 7200000).toISOString()
      },
      {
        id: 'tap_turnoff',
        label: 'Turned off tap while brushing teeth & washing dishes',
        category: 'water',
        co2Saved: 0.4,
        icon: 'Droplet',
        timestamp: new Date(baseTime - 3600000).toISOString()
      }
    ];
  });

  const [savedCO2, setSavedCO2] = useState<number>(() => {
    const saved = localStorage.getItem('CARBON_SAVED_CO2');
    if (saved) return parseFloat(saved);
    // Match the pre-populated actions: 0.5 + 0.7 + 0.9 + 0.4 = 2.5 kg
    return 2.5;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    if (profile) {
      localStorage.setItem('CARBON_USER_PROFILE', JSON.stringify(profile));
    } else {
      localStorage.removeItem('CARBON_USER_PROFILE');
    }
  }, [profile]);

  useEffect(() => {
    if (footprint) {
      localStorage.setItem('CARBON_FOOTPRINT_DATA', JSON.stringify(footprint));
    } else {
      localStorage.removeItem('CARBON_FOOTPRINT_DATA');
    }
  }, [footprint]);

  useEffect(() => {
    localStorage.setItem('CARBON_LOGGED_ACTIONS', JSON.stringify(loggedActions));
  }, [loggedActions]);

  useEffect(() => {
    localStorage.setItem('CARBON_SAVED_CO2', savedCO2.toString());
  }, [savedCO2]);

  const handleOnboardingComplete = (answers: UserProfile, calculated: CalculatedFootprint) => {
    setProfile(answers);
    setFootprint(calculated);
  };

  const handleLogAction = (action: RepeatableAction) => {
    const currentCount = loggedActions.filter(act => act.id === action.id).length;
    if (currentCount >= 5) {
      return;
    }
    const loggedItem: LoggedAction = {
      ...action,
      timestamp: new Date().toISOString()
    };
    setLoggedActions(prev => [...prev, loggedItem]);
    setSavedCO2(prev => parseFloat((prev + action.co2Saved).toFixed(2)));
  };

  const handleRemoveLoggedAction = (indexToRemove: number) => {
    const itemToRemove = loggedActions[indexToRemove];
    if (itemToRemove) {
      setLoggedActions(prev => prev.filter((_, idx) => idx !== indexToRemove));
      setSavedCO2(prev => Math.max(0, parseFloat((prev - itemToRemove.co2Saved).toFixed(2))));
    }
  };

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  const triggerSwitchProfile = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Switch / Add New Profile?',
      message: 'This will return you to the onboarding profile setup to configure a new lifestyle baseline. Your active green logs history and saved indicators will start fresh.',
      confirmText: 'Setup New Profile',
      onConfirm: () => {
        setProfile(null);
        setFootprint(null);
        setLoggedActions([]);
        setSavedCO2(0);
        setActiveTab('dashboard');
        localStorage.removeItem('CARBON_USER_PROFILE');
        localStorage.removeItem('CARBON_FOOTPRINT_DATA');
        localStorage.removeItem('CARBON_LOGGED_ACTIONS');
        localStorage.removeItem('CARBON_SAVED_CO2');
        setConfirmModal(null);
      }
    });
  };

  const triggerResetData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Permanently Wipe Data?',
      message: 'Are you absolutely sure? This will delete your current profile metric data, baseline calculations, badges, and all logged offsets.',
      confirmText: 'Yes, Wipe Data',
      onConfirm: () => {
        setProfile(null);
        setFootprint(null);
        setLoggedActions([]);
        setSavedCO2(0);
        setActiveTab('dashboard');
        localStorage.removeItem('CARBON_USER_PROFILE');
        localStorage.removeItem('CARBON_FOOTPRINT_DATA');
        localStorage.removeItem('CARBON_LOGGED_ACTIONS');
        localStorage.removeItem('CARBON_SAVED_CO2');
        setConfirmModal(null);
      }
    });
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation Bar */}
      <header id="app-header" className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white p-2 rounded-lg flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Leaf className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-800 uppercase bento-logo font-sans">ZeroCarbon</span>
          </div>
          {profile && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-semibold hidden sm:inline-block">
                Active Profile: <strong className="text-slate-800 font-bold">{profile.name}</strong>
              </span>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border border-emerald-200 shadow-sm shadow-emerald-100 hover:scale-102">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="tracking-wide uppercase text-[10px] animate-pulse">Climate Base Live</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main id="app-main" className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {!profile || !footprint ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* View Switching Tab Controls */}
            <div id="navigation-tabs" className="flex gap-2 border-b border-slate-200/50 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart2 },
                { id: 'logger', label: 'Action Tracker', icon: PlusCircle },
                { id: 'coach', label: 'Climate Coach', icon: MessageSquare }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    id={`nav-tab-${tab.id}`}
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Display View Content based on selection */}
            <div id="active-tab-panel" className="transition-all duration-300">
              {activeTab === 'dashboard' && (
                <Dashboard
                  profile={profile}
                  footprint={footprint}
                  savedCO2={savedCO2}
                  loggedActions={loggedActions}
                  onSwitchProfile={triggerSwitchProfile}
                  onResetData={triggerResetData}
                />
              )}

              {activeTab === 'logger' && (
                <ActionLogger
                  onLogAction={handleLogAction}
                  onRemoveLoggedAction={handleRemoveLoggedAction}
                  loggedActions={loggedActions}
                />
              )}

              {activeTab === 'coach' && (
                <AIAssistant
                  userProfile={profile}
                  calculatedFootprint={footprint}
                  savedCO2={savedCO2}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Custom Confirmation Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div id="modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div id="modal-container" className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 animate-slide-up">
            <div className="flex items-start gap-3.5">
              <div className="bg-rose-50 text-rose-600 p-2.5 rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug">{confirmModal.title}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed mt-2 font-medium">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                id="btn-modal-cancel"
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer"
              >
                No, Keep Current
              </button>
              <button
                id="btn-modal-confirm"
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm shadow-rose-600/10 cursor-pointer"
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
