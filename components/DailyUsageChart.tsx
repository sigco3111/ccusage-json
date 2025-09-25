
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DailyUsage } from '../types';

interface DailyUsageChartProps {
  data: DailyUsage[];
}

const DailyUsageChart: React.FC<DailyUsageChartProps> = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
  }));

  const formatTokens = (value: number) => {
    if (value > 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };
  
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis yAxisId="left" stroke="#3b82f6" tickFormatter={(value) => `$${value.toFixed(2)}`}/>
          <YAxis yAxisId="right" orientation="right" stroke="#14b8a6" tickFormatter={formatTokens} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} 
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Line yAxisId="left" type="monotone" dataKey="totalCost" name="비용" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="totalTokens" name="토큰" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyUsageChart;