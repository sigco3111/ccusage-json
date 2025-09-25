import React, { useState, useMemo, useCallback } from 'react';
import type { UsageData, DailyUsage } from '../types';
import StatCard from './StatCard';
import DailyUsageChart from './DailyUsageChart';
import ModelDistributionPieChart from './ModelDistributionPieChart';
import DataTable from './DataTable';

interface DashboardProps {
  data: UsageData;
  fileName: string;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, fileName, onReset }) => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const handleModelSelect = useCallback((modelName: string) => {
    setSelectedModel(prev => (prev === modelName ? null : modelName));
  }, []);

  const filteredData = useMemo((): UsageData => {
    if (!selectedModel) {
      return data;
    }

    const newDaily: DailyUsage[] = [];

    for (const day of data.daily) {
      const modelBreakdown = day.modelBreakdowns.find(
        (breakdown) => breakdown.modelName === selectedModel
      );
      if (modelBreakdown) {
        newDaily.push({
          ...day, // Copy other fields if necessary, but we recalculate most
          inputTokens: modelBreakdown.inputTokens,
          outputTokens: modelBreakdown.outputTokens,
          cacheCreationTokens: modelBreakdown.cacheCreationTokens,
          cacheReadTokens: modelBreakdown.cacheReadTokens,
          totalCost: modelBreakdown.cost,
          totalTokens: modelBreakdown.inputTokens + modelBreakdown.outputTokens + modelBreakdown.cacheCreationTokens + modelBreakdown.cacheReadTokens,
          modelsUsed: [selectedModel],
          modelBreakdowns: [modelBreakdown],
        });
      }
    }

    const newTotals = newDaily.reduce(
      (acc, day) => {
        acc.inputTokens += day.inputTokens;
        acc.outputTokens += day.outputTokens;
        acc.totalCost += day.totalCost;
        acc.totalTokens += day.totalTokens;
        acc.cacheCreationTokens += day.cacheCreationTokens;
        acc.cacheReadTokens += day.cacheReadTokens;
        return acc;
      },
      {
        inputTokens: 0,
        outputTokens: 0,
        cacheCreationTokens: 0,
        cacheReadTokens: 0,
        totalCost: 0,
        totalTokens: 0,
      }
    );

    return {
      daily: newDaily,
      totals: newTotals,
    };
  }, [data, selectedModel]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">분석 파일: <span className="font-mono text-blue-400">{fileName}</span></h2>
          {selectedModel && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-slate-400">필터링 기준:</span>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-900/50 text-purple-300">{selectedModel}</span>
              <button 
                onClick={() => setSelectedModel(null)} 
                className="text-xs text-slate-400 hover:text-white underline transition-colors"
                aria-label={`'${selectedModel}' 모델 필터 해제`}
              >
                (필터 해제)
              </button>
            </div>
          )}
        </div>
        <button
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 self-start sm:self-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
            </svg>
            새 파일 업로드
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="총 비용" value={`$${filteredData.totals.totalCost.toFixed(2)}`} />
        <StatCard title="총 토큰" value={filteredData.totals.totalTokens.toLocaleString()} />
        <StatCard title="입력 토큰" value={filteredData.totals.inputTokens.toLocaleString()} />
        <StatCard title="출력 토큰" value={filteredData.totals.outputTokens.toLocaleString()} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-850 p-4 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-slate-100">
            {selectedModel ? `${selectedModel} 사용량 추이` : '일일 사용량 추이'}
          </h3>
          <DailyUsageChart data={filteredData.daily} />
        </div>
        <div className="bg-slate-850 p-4 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-slate-100">모델별 비용 분포</h3>
          <ModelDistributionPieChart 
            data={data.daily} 
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-850 p-4 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-slate-100">
          {selectedModel ? `${selectedModel} 상세 내역` : '일일 상세 내역'}
        </h3>
        <DataTable data={filteredData.daily} />
      </div>
    </div>
  );
};

export default Dashboard;