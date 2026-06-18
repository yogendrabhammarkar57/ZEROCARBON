import { Award, RefreshCw, Zap, Trophy, ShieldAlert, User } from 'lucide-react';
import Charts from './Charts';
import { UserProfile, CalculatedFootprint } from '../utils/calculator';
import { LoggedAction } from '../App';

interface DashboardProps {
  profile: UserProfile;
  footprint: CalculatedFootprint;
  savedCO2: number; // in kg
  loggedActions: LoggedAction[];
  onSwitchProfile: () => void;
  onResetData: () => void;
}

export default function Dashboard({ profile, footprint, savedCO2, loggedActions, onSwitchProfile, onResetData }: DashboardProps) {
  const currentTotal = Math.max(0, footprint.total - (savedCO2 / 1000)).toFixed(2);
  const percentSaved = Math.min(100, ((savedCO2 / (footprint.total * 10)) * 100)).toFixed(1);

  // Dynamic advice contextually mapped to user's highest sector
  const getContextualAdvice = () => {
    const categories = footprint.breakdown || { food: 0, travel: 0, energy: 0, shopping: 0 };
    const highestSector = Object.keys(categories).reduce((a, b) => 
      categories[a as keyof typeof categories] > categories[b as keyof typeof categories] ? a : b, 
      'travel'
    );

    if (highestSector === 'travel') {
      return [
        { title: 'Optimise Urban Journeys', desc: 'Prioritise cycling or standard bus/metro lines for any transit distance under 5 miles.' },
        { title: 'Adopt High-Speed Over Air', desc: 'Substitute short-distance domestic flights with electric rail or carpooling alternatives.' },
        { title: 'Verify Vehicle Habits', desc: 'Avoid rapid acceleration and ensure correct tire pressure, raising efficiency up to 7%.' }
      ];
    } else if (highestSector === 'food' || highestSector === 'diet') {
      return [
        { title: 'Design Meat-Free Days', desc: 'Vow to go fully plant-eating on specific days of the week, reducing meals impact up to 50%.' },
        { title: 'Zero Waste Commitment', desc: 'Plan grocery shopping cycles beforehand to cut global household raw waste logs.' },
        { title: 'Sourcing Low and Clean', desc: 'Opt for locally grown direct-market organic vegetables to reduce transport fuel overhead.' }
      ];
    } else if (highestSector === 'energy') {
      return [
        { title: 'Unplug Phantom Chargers', desc: 'High-draw vampire power cords consume energy even when inactive; switch off multi-plugs.' },
        { title: 'Upgrade Home Insulation', desc: 'Ensure doors and window frame alignments are sealed correctly to hold indoor warmth/cooling.' },
        { title: 'Lower Room Thermostats', desc: 'Dropping heating parameters by 2°F cuts annual resource utilization parameters up to 10%.' }
      ];
    } else {
      return [
        { title: 'Consolidate E-Commerce', desc: 'Opt out of next-day rapid logistics transit modes which drive inefficient fragmented haulage.' },
        { title: 'Prioritise Solid Products', desc: 'Choose high-quality merchandise with minimal plastic packaging and long lifespans.' },
        { title: 'Circular Second-Hand', desc: 'Explore vintage and local reuse outlets instead of brand-new retail lines for style choices.' }
      ];
    }
  };

  const adviceList = getContextualAdvice();

  // Gamification badges criteria
  const getBadges = () => {
    const badges = [];

    // Automatically unlocked default milestones
    badges.push({ 
      name: 'First Step', 
      desc: 'Completed onboarding profile baseline setup!', 
      color: 'bg-teal-50 text-teal-700 border-teal-150' 
    });
    badges.push({ 
      name: 'Carbon Aware', 
      desc: 'Analyzed baseline footprint values successfully.', 
      color: 'bg-sky-50 text-sky-700 border-sky-150' 
    });
    badges.push({ 
      name: 'Goal Setter', 
      desc: 'Committed to a Paris 1.5°C target emissions plan.', 
      color: 'bg-purple-50 text-purple-700 border-purple-150' 
    });

    if (savedCO2 > 0) {
      badges.push({ 
        name: 'Eco Starter', 
        desc: 'Logged your first savings action', 
        color: 'bg-indigo-50 text-indigo-700 border-indigo-100' 
      });
    }
    if (savedCO2 >= 5) {
      badges.push({ 
        name: 'Carbon Slayer', 
        desc: 'Saved 5kg+ of CO₂ emissions', 
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100' 
      });
    }
    if (profile.diet === 'vegan' || profile.diet === 'vegetarian') {
      badges.push({ 
        name: 'Plant Pioneer', 
        desc: 'Sustained vegetarian or vegan diets', 
        color: 'bg-amber-50 text-amber-700 border-amber-100' 
      });
    }
    if (profile.electricitySource === 'renewable') {
      badges.push({ 
        name: 'Solar Citizen', 
        desc: 'Sourced 100% renewable power', 
        color: 'bg-yellow-50 text-yellow-700 border-yellow-105' 
      });
    }
    return badges;
  };

  const activeBadges = getBadges();

  return (
    <div id="dashboard-wrapper" className="space-y-6 my-4">
      {/* Profile Header Welcome Section */}
      <div id="profile-welcome-banner" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold uppercase text-xs border border-emerald-200">
            {profile.name ? profile.name.slice(0, 2) : 'EH'}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              Welcome back, <span className="text-emerald-700">{profile.name}</span>!
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Profile Resident: <span className="font-semibold text-slate-700 uppercase bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{profile.country}</span> | Diet focus: <span className="font-semibold text-slate-750 capitalize">{profile.diet}</span>
            </p>
          </div>
        </div>
        
        {/* Profile Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="btn-add-new-profile"
            type="button"
            onClick={onSwitchProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-705 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
            title="Setup a new profile or change user settings"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            Switch / Add New Profile
          </button>
          
          <button
            id="btn-reset-profile"
            type="button"
            onClick={onResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50/50 hover:bg-rose-50 text-rose-700 border border-rose-100 hover:border-rose-250 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
            title="Reset profile data completely"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Overview Metric Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div id="annual-footprint-metric" className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/30 p-6 rounded-2xl border border-emerald-100/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Annual Footprint Goal</p>
              <h4 className="text-2xl font-bold text-slate-800 mt-1">{currentTotal} <span className="text-xs font-normal text-slate-500">Tons CO₂e</span></h4>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Onboarding Baseline: {footprint.total} t/yr</p>
            </div>
            <div className="bg-emerald-105/50 p-2.5 rounded-xl text-emerald-600 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, (2.0 / parseFloat(currentTotal)) * 100)).toFixed(0)}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500 font-bold">
              <span>Target Alignment</span>
              <span>{Math.min(100, Math.max(0, (2.0 / parseFloat(currentTotal)) * 100)).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div id="session-offsets-metric" className="bg-gradient-to-br from-teal-50/70 via-white to-slate-50/30 p-6 rounded-2xl border border-teal-100/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tracked Daily Offsets</p>
              <h4 className="text-2xl font-bold text-emerald-600 mt-1">{savedCO2.toFixed(1)} <span className="text-xs font-normal text-slate-500">kg CO₂</span></h4>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Total Habits Logged: {loggedActions.length}</p>
            </div>
            <div className="bg-emerald-500 text-white p-2.5 rounded-xl shrink-0 shadow-sm shadow-emerald-500/25">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, (savedCO2 / 5.0) * 100)).toFixed(0)}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500 font-bold">
              <span>Daily 5kg Milestone</span>
              <span>{Math.min(100, Math.max(0, (savedCO2 / 5.0) * 100)).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div id="goal-achievement-metric" className="bg-gradient-to-br from-green-50/70 via-white to-slate-50/30 p-6 rounded-2xl border border-green-100/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Today's Reductions Target</p>
              <h4 className="text-2xl font-bold text-slate-800 mt-1">{percentSaved}%</h4>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Target relative to baseline</p>
            </div>
            <button
              id="reset-profile-btn"
              type="button"
              onClick={onResetData}
              className="text-slate-400 hover:text-red-500 p-2 border border-slate-200/60 hover:border-red-150 rounded-lg transition-all cursor-pointer shrink-0"
              title="Reset Profile Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${percentSaved}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500 font-bold">
              <span>Goal Accomplished</span>
              <span>{percentSaved}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Analytics & Graphs */}
      <Charts breakdown={footprint.breakdown} total={parseFloat(currentTotal)} />

      {/* Gamified Achievements Segment */}
      <div id="badges-segment" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">My Badges & Credentials</h3>
        <p className="text-xs text-slate-500 mb-4 font-medium">Milestone credentials unlocked based on your lifestyle profile and daily logger entries.</p>
        
        {activeBadges.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-150 rounded-xl text-xs text-slate-400 font-semibold">
            Complete green actions and daily offsets above to earn your first prestigious climate milestone badge!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeBadges.map((badge, idx) => (
              <div id={`badge-item-${badge.name.replace(/\s+/g, '-').toLowerCase()}`} key={idx} className={`p-4 rounded-xl border text-center flex flex-col items-center shadow-xs transition-transform hover:scale-102 ${badge.color}`}>
                <Award className="w-8 h-8 mb-2 shrink-0 animate-bounce-slow" />
                <h4 className="font-bold text-xs">{badge.name}</h4>
                <p className="text-[10px] opacity-80 mt-1 font-medium leading-tight">{badge.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contextual Weekly Action Plans & Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div id="weekly-plan-panel" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">Contextual Weekly Plan</h3>
          <p className="text-xs text-slate-500 mb-4 font-medium">Strategic practices configured dynamically around your high-emission baseline sectors.</p>
          
          <div className="space-y-3 text-xs text-slate-700 flex-1 flex flex-col justify-center">
            {adviceList.map((advice, index) => (
              <div key={index} className="flex gap-3 items-start p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold text-[10px] shrink-0">
                  {index + 1}
                </span>
                <div>
                  <strong className="block text-slate-801 font-bold">{advice.title}</strong>
                  <p className="text-slate-500 mt-1 text-[11px] font-medium leading-relaxed">{advice.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="climate-advisory-panel" className="bg-slate-950 text-slate-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Climate Action Advisory</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 font-medium">
              To meet global climate commitments outlined in the Paris Agreement and help achieve the 2030 goal of limiting warming to <span className="text-emerald-400 font-bold">1.5°C</span>, individual average carbon baselines must decrease to approximately <span className="text-emerald-400 font-bold">2.0 metric tons</span> annually per person by 2030.
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs shadow-inner">
              <p className="text-slate-400 font-medium">Your absolute distance to the 2030 Global Target footprint:</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {(parseFloat(currentTotal) - 2.0).toFixed(2)} <span className="text-xs font-normal text-slate-500">Tons CO₂e to reduce</span>
              </p>
            </div>
          </div>
          <div className="text-[9px] text-slate-500 mt-4 text-right font-semibold uppercase tracking-wider">
            Lifecycle factors scaled from international IPCC and EPA parameters.
          </div>
        </div>
      </div>
    </div>
  );
}
