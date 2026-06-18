import { useState } from 'react';
import { Leaf, ChevronRight, ChevronLeft } from 'lucide-react';
import { calculateFootprint, UserProfile, CalculatedFootprint } from '../utils/calculator';

interface OnboardingProps {
  onComplete: (answers: UserProfile, footprint: CalculatedFootprint) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<UserProfile>({
    name: '',
    country: 'india',
    diet: 'flexitarian',
    vehicleType: 'gasoline',
    publicTransit: 'occasional',
    flights: 'rare',
    homeSize: 'mediumHouse',
    electricitySource: 'gridMix',
    heating: 'gas',
    shoppingHabits: 'average'
  });

  const updateAnswer = (key: keyof UserProfile, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      const finalAnswers = {
        ...answers,
        name: answers.name?.trim() ? answers.name.trim() : 'Eco Hero'
      };
      const footprint = calculateFootprint(finalAnswers);
      onComplete(finalAnswers, footprint);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  return (
    <div id="onboarding-container" className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden my-8">
      {/* Header and Progress Indicator */}
      <div className="bg-emerald-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-500/30 p-2 rounded-lg">
            <Leaf className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Assess Your Baseline</h1>
        </div>
        <p className="text-emerald-100 text-sm">
          Answer a few questions regarding your typical weekly choices to map out your current carbon footprint.
        </p>
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4].map(idx => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                idx <= step ? 'bg-white' : 'bg-emerald-700/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-8">
        {/* Step 1: Diet & Food */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Country & Lifestyle Profile</h2>
              <p className="text-sm text-slate-500 mt-1">First, configure your profile identity, country of residence, and general diet.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
              <label htmlFor="input-username" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Your Name / Profile Tag</label>
              <input
                id="input-username"
                type="text"
                value={answers.name || ''}
                onChange={(e) => updateAnswer('name', e.target.value)}
                placeholder="e.g. Eco Challenger"
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white font-semibold text-slate-800"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
              <label htmlFor="select-country" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Country / Region of Residence</label>
              <select
                id="select-country"
                value={answers.country}
                onChange={(e) => updateAnswer('country', e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white font-semibold text-slate-750"
              >
                <option value="india">India 🇮🇳 (High renewable development & local carbon footprint models)</option>
                <option value="us">United States 🇺🇸</option>
                <option value="eu">European Union 🇪🇺</option>
                <option value="other">Other / Global Average Region 🌐</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">Diet & Nutrition</h3>
              <p className="text-xs text-slate-500 mt-0.5">How would you describe your general dietary preference?</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'meatLover', title: 'Frequent Meat Consumer', desc: 'Eat beef, pork, or poultry daily' },
                { id: 'flexitarian', title: 'Flexitarian / Low-Meat', desc: 'Primarily vegetarian, occasional meat' },
                { id: 'pescatarian', title: 'Pescatarian', desc: 'Vegetable-based diet including fish/seafood' },
                { id: 'vegetarian', title: 'Vegetarian', desc: 'No meat or fish; includes dairy and eggs' },
                { id: 'vegan', title: 'Fully Plant-Based / Vegan', desc: 'Exclusively plant-based foods' }
              ].map(opt => (
                <button
                  id={`btn-diet-${opt.id}`}
                  key={opt.id}
                  type="button"
                  onClick={() => updateAnswer('diet', opt.id)}
                  className={`p-4 text-left rounded-xl border transition-all duration-200 cursor-pointer ${
                    answers.diet === opt.id
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="font-semibold text-sm">{opt.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Transportation */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Mobility & Commuting</h2>
              <p className="text-sm text-slate-500 mt-1">Configure your typical weekly commuting models and travel habits.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">Primary Personal Transport</label>
                <select
                  id="select-vehicle-type"
                  value={answers.vehicleType}
                  onChange={(e) => updateAnswer('vehicleType', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white font-medium text-slate-705"
                >
                  <option value="none">No personal vehicle (walk/bike/stay home)</option>
                  <option value="electric">Electric Vehicle (EV)</option>
                  <option value="hybrid">Hybrid Vehicle</option>
                  <option value="gasoline">Standard Gasoline Car</option>
                  <option value="diesel">Diesel Car or Large SUV</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">Public Transit Use</label>
                <select
                  id="select-public-transit"
                  value={answers.publicTransit}
                  onChange={(e) => updateAnswer('publicTransit', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white font-medium text-slate-705"
                >
                  <option value="never">Rarely or never</option>
                  <option value="occasional">Occasional (1-2 times a week)</option>
                  <option value="frequent">Frequent (daily commute or regular travel)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">Annual Commercial Flights</label>
                <select
                  id="select-flights"
                  value={answers.flights}
                  onChange={(e) => updateAnswer('flights', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white font-medium text-slate-705"
                >
                  <option value="none">No flights this past year</option>
                  <option value="rare">1 to 2 short flights</option>
                  <option value="moderate">3 to 5 medium-haul flights</option>
                  <option value="frequent">Frequent long-haul travel</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Home & Energy */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Home & Domestic Energy</h2>
              <p className="text-sm text-slate-500 mt-1">Your home size and utility systems have a substantial impact on utility baseline emissions.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">Living Space Size</label>
                <select
                  id="select-home-size"
                  value={answers.homeSize}
                  onChange={(e) => updateAnswer('homeSize', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white font-medium text-slate-705"
                >
                  <option value="apartment">Apartment or Studio</option>
                  <option value="mediumHouse">Medium Single-Family House</option>
                  <option value="largeHouse">Large Multi-Level Residence</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">Electricity Source Profile</label>
                <select
                  id="select-electricity"
                  value={answers.electricitySource}
                  onChange={(e) => updateAnswer('electricitySource', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white font-medium text-slate-705"
                >
                  <option value="coal">Standard Grid (fossil-heavy / coal-rich mix)</option>
                  <option value="gridMix">Standard Regional Average Mix</option>
                  <option value="renewable">Green Utility Tariff (100% renewable plan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">Primary Heating Utility</label>
                <select
                  id="select-heating"
                  value={answers.heating}
                  onChange={(e) => updateAnswer('heating', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white font-medium text-slate-705"
                >
                  <option value="gas">Natural Gas or Fuel Oil Furnace</option>
                  <option value="electricity">Standard Electric Heaters</option>
                  <option value="heatPump">Modern Heat Pump System</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Shopping Habits */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Shopping & Consumer Behavior</h2>
              <p className="text-sm text-slate-500 mt-1">Consumerism drives indirect emissions from manufacturing and distribution logistics.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'minimalist', title: 'Minimalist', desc: 'Only buy essentials; buy secondhand where possible; low packaging waste' },
                { id: 'average', title: 'Average Consumer', desc: 'Regular purchases, moderate online shipping and delivery use' },
                { id: 'heavy', title: 'Frequent Shopper', desc: 'Frequent new goods purchases, regular fast-fashion, daily home deliveries' }
              ].map(opt => (
                <button
                  id={`btn-shopping-${opt.id}`}
                  key={opt.id}
                  type="button"
                  onClick={() => updateAnswer('shoppingHabits', opt.id)}
                  className={`p-4 text-left rounded-xl border transition-all duration-200 cursor-pointer ${
                    answers.shoppingHabits === opt.id
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/25'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="font-semibold text-sm">{opt.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
          <button
            id="btn-back"
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
              step === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-600 border-slate-200 hover:bg-slate-55 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            id="btn-next"
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {step === 4 ? 'Calculate Footprint' : 'Continue'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
