# ZeroCarbon – Carbon Footprint Awareness Platform (Challenge 3 Version)

ZeroCarbon is a high-fidelity carbon footprint awareness, target-setting, and habit-building platform. Designed for individual and community action, it establishes personalized carbon baselines, compares individual impacts with international benchmarks, gamifies daily positive choices, and integrates an advanced server-side AI Advisor powered by Google's Gemini 3.5 Flash.

---

## 🌎 Chosen Vertical
**Challenge 3 – Carbon Footprint Awareness Platform**

Our platform translates abstract greenhouse gas metrics into highly personal, relatable daily decisions. By centering individual lifestyle patterns (diet, commuting, power sources, household scopes) and daily green micro-habits, ZeroCarbon empowers users to align their carbon prints with the target guidelines of the international Paris climate protocol.

---

## 📐 Scientific Methodology & Logic
The baseline calculation and feedback engine operate on formal greenhouse gas accounting principles:

### 1. Step-by-Step Flow
1. **Onboarding Baseline Setup:** Users fill out a highly intuitive visual questionnaire capturing Country/Region of residence, Diet preferences, Vehicle and Flight habits, Household space parameters, Electricity grids, and Consumerism patterns.
2. **Emissions Breakdown Calculations:** The system translates questionnaires into annualized values measured in metric tons of CO₂ equivalent per year ($t\text{ CO}_2\text{e/year}$) across four primary lifestyle sectors:
   - **Diet & Food:** Based on animal vs. plant protein baseline agricultural footprints.
   - **Travel & Commuting:** Evaluates relative fuel standards, transit passenger-kilometers, and flight hours.
   - **Home Energy & Utilities:** Assesses heating types, apartment-to-house volume, and electricity grid mix.
   - **Secondary Shopping:** Captures material consumption, shipping, and packaging habits.
3. **Interactive Visual Reporting:** Displays sector-by-sector breakdowns using Recharts and compares the user's footprint against the global goal ($2.0\text{ t CO}_2\text{e/year}$) necessary to prevent severe warning.
4. **Action Logging Feed:** Allows users to log real-time positive habits (e.g. taking transit, eating a vegan meal, shortening a hot shower, composting, recycling) to claim carbon credits.
5. **AI Climate Coaching:** Users converse with a server-to-server proxy Gemini instance to receive personalized, context-aware climate feedback tailored exactly to their profile.

---

## 📊 Scientific Emission Factor Sources
The database weights factors adapted from peer-reviewed climate modeling:
- **IPCC (Intergovernmental Panel on Climate Change):** Core Global Warming Potential (GWP-100) indices for carbon dioxide ($CO_2$), methane ($CH_4$), and nitrous oxide ($N_2O$) from the Fifth Assessment Report (AR5).
- **US EPA (Environmental Protection Agency):** Average residential fuel emissions, vehicle mileages, and food supply-chain footprint averages.
- **European Environment Agency (EEA):** Public transportation occupancy factors and flight mileage standards.

### Core Key Assumptions:
- **Plant-Based Dietary Scaling:** Vegan diets average ~1.5t $CO_2e/\text{yr}$, vegetarians ~2.0t, flexitarians ~2.5t, and high-meat carnivore diets reach upwards of 3.5t.
- **Home Heating & Energy Volume:** Household electrical consumption is calculated from total square footage multiplied by the source grid multiplier (e.g., green renewable vs carbon-heavy grid mix).
- **Localized Warm-Climate Modifier (India Adjustment):** Profiles indicating residency in **India** apply a scientific climate correction: standard space-heating assumptions (like winter gas or oil furnace cycles) are **scaled down by 90%** since tropical regions require cooling/AC (accounted for under electricity variables) rather than active furnace fuel.
- **Default Milestones:** Badges like *First Step* (setup baseline), *Carbon Aware* (calculated initial print), and *Goal Setter* (aligned target goals) are dynamically unlocked upon completing onboarding so the trophies panel is filled with inspiring milestones right away.

---

## 🛠️ Built-In Tech Stack
- **Frontend SPA:** React 18, Vite 6, Tailwind CSS v4, Lucide Icons (react-visuals), Framer Motion-inspired micro-animations.
- **Charts Engine:** Recharts (responsive SVG rendering).
- **Backend Service:** Node.js Express 4 server.
- **Production Bundler:** Esbuild (compiling typescript server-side files into standalone, optimized CommonJS files at `dist/server.cjs` for lightning fast page loads).
- **Caching & Persistence:** Client-side LocalStorage cache state machine (survives browser restarts instantly).

---

## 🚀 Environment Variables Config
ZeroCarbon never exposes backend API keys to the browser, wrapping them inside secure Express middleware proxies. Documented in `.env.example`:

```env
# GEMINI_API_KEY: Required key for Gemini AI calls (securely resolved server-side)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# APP_URL: System URL routing
APP_URL="http://localhost:3000"
```

---

## 💻 Standard Installation & Setup

1. **Verify Dependencies Configuration:**
   Install baseline node modules:
   ```bash
   npm install
   ```
2. **Launch Dev Server:**
   This starts the full-stack server (Vite and Express proxy) simultaneously on port **3000**:
   ```bash
   npm run dev
   ```
3. **Execute Production Build:**
   Compile assets and bundle TypeScript server-side code:
   ```bash
   npm run build
   ```
4. **Boot Standalone Production Node server:**
   ```bash
   npm run start
   ```

---
*Created as part of the Carbon Footprint Awareness MVP Platform.*
