import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = {
  food: '#10b981',    // Emerald
  travel: '#3b82f6',  // Blue
  energy: '#f59e0b',  // Amber
  shopping: '#8b5cf6' // Purple
};

interface ChartsProps {
  breakdown: {
    food: number;
    travel: number;
    energy: number;
    shopping: number;
  };
  total: number;
}

export default function Charts({ breakdown, total }: ChartsProps) {
  const chartData = [
    { name: 'Diet/Food', value: breakdown.food, color: COLORS.food },
    { name: 'Travel/Transit', value: breakdown.travel, color: COLORS.travel },
    { name: 'Energy', value: breakdown.energy, color: COLORS.energy },
    { name: 'Shopping', value: breakdown.shopping, color: COLORS.shopping }
  ];

  const comparisonData = [
    { name: 'Your Footprint', value: total, fill: '#10b981' },
    { name: 'Global Target', value: 2.0, fill: '#64748b' },
    { name: 'Global Average', value: 4.7, fill: '#ef4444' }
  ];

  return (
    <div id="charts-wrapper" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Breakdown Pie Chart */}
      <div id="sector-breakdown-card" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Emissions by Sector (Tons CO₂e/yr)</h3>
        <div className="h-64 flex flex-col justify-between">
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Tons`, 'Emissions']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 flex-wrap text-[11px] pt-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 font-medium">{d.name} ({total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Comparisons Bar Chart */}
      <div id="global-comparison-card" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">How You Compare (Tons CO₂e/yr)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" unit="t" />
              <Tooltip formatter={(value) => [`${value} Tons`, 'Annual Footprint']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
