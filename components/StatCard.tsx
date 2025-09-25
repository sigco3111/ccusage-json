
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-slate-850 p-6 rounded-xl border border-slate-700 shadow-lg transition-transform transform hover:scale-105 hover:border-blue-500">
      <h4 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h4>
      <p className="text-3xl font-bold text-slate-100 mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
