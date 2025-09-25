import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DailyUsage } from '../types';

interface ModelDistributionPieChartProps {
  data: DailyUsage[];
  selectedModel: string | null;
  onModelSelect: (modelName: string) => void;
}

const COLORS = ['#3b82f6', '#14b8a6', '#8b5cf6', '#ec4899', '#f97316', '#facc15'];

const ModelDistributionPieChart: React.FC<ModelDistributionPieChartProps> = ({ data, selectedModel, onModelSelect }) => {
  const modelCosts: { [key: string]: number } = {};

  data.forEach(day => {
    day.modelBreakdowns.forEach(breakdown => {
      if (modelCosts[breakdown.modelName]) {
        modelCosts[breakdown.modelName] += breakdown.cost;
      } else {
        modelCosts[breakdown.modelName] = breakdown.cost;
      }
    });
  });

  const chartData = Object.entries(modelCosts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            onClick={(data) => onModelSelect(data.name)}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (percent * 100) > 5 ? (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                ) : null;
            }}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                fillOpacity={!selectedModel || entry.name === selectedModel ? 1 : 0.3}
                stroke={entry.name === selectedModel ? 'white' : 'none'}
                strokeWidth={2}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s, stroke 0.2s' }}
              />
            ))}
          </Pie>
          <Tooltip 
             formatter={(value: number) => `$${value.toFixed(2)}`}
             contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} 
             labelStyle={{ color: '#cbd5e1' }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ModelDistributionPieChart;