import React, { useState, useMemo } from 'react';
import type { DailyUsage } from '../types';

interface DataTableProps {
  data: DailyUsage[];
}

type SortKey = 'date' | 'inputTokens' | 'outputTokens' | 'totalTokens' | 'totalCost';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'date') {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
        
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const SortableHeader: React.FC<{ sortKey: SortKey, label: string }> = ({ sortKey, label }) => {
    const isSorted = sortConfig.key === sortKey;
    const directionIcon = isSorted ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '';
    
    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
            <button
              onClick={() => requestSort(sortKey)}
              className="flex items-center gap-1 hover:text-white transition-colors"
              aria-label={`Sort by ${label} ${isSorted ? (sortConfig.direction === 'asc' ? '(ascending)' : '(descending)') : ''}`}
            >
                {label}
                <span className="text-slate-400 w-4">{directionIcon}</span>
            </button>
        </th>
    );
  };


  return (
    <div className="overflow-x-auto">
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800 sticky top-0 z-10">
            <tr>
              <SortableHeader sortKey="date" label="날짜" />
              <SortableHeader sortKey="inputTokens" label="입력 토큰" />
              <SortableHeader sortKey="outputTokens" label="출력 토큰" />
              <SortableHeader sortKey="totalTokens" label="총 토큰" />
              <SortableHeader sortKey="totalCost" label="비용" />
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">사용된 모델</th>
            </tr>
          </thead>
          <tbody className="bg-slate-850 divide-y divide-slate-700/50">
            {sortedData.map((day) => (
              <tr key={day.date} className="hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{day.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{day.inputTokens.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{day.outputTokens.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{day.totalTokens.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">${day.totalCost.toFixed(4)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    <div className="flex flex-wrap gap-1">
                        {day.modelsUsed.map(model => (
                            <span key={model} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/50 text-blue-300">
                                {model}
                            </span>
                        ))}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;