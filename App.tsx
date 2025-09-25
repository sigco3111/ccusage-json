import React, { useState, useCallback } from 'react';
import type { UsageData } from './types';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = useCallback((file: File) => {
    setError(null);
    setUsageData(null);
    setFileName('');

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File content is not a string.');
        }
        const data = JSON.parse(text);

        if (!data.daily || !data.totals) {
          throw new Error("잘못된 JSON 형식입니다. 'daily' 또는 'totals' 키가 없습니다.");
        }
        
        setUsageData(data);
        setFileName(file.name);
      } catch (e) {
        if (e instanceof Error) {
            setError(`JSON 파일 파싱 오류: ${e.message}`);
        } else {
            setError('파일을 파싱하는 동안 알 수 없는 오류가 발생했습니다.');
        }
      }
    };
    reader.onerror = () => {
        setError('파일을 읽는 데 실패했습니다.');
    };
    reader.readAsText(file);
  }, []);

  const handleReset = () => {
    setUsageData(null);
    setError(null);
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          클로드코드 사용량 대시보드
        </h1>
        <p className="text-slate-400 mt-2">
          `ccusage` JSON 파일을 업로드하여 AI 모델 사용량과 비용을 시각화하세요.
        </p>
      </header>
      
      <main className="w-full max-w-7xl flex-grow">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">오류: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!usageData ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : (
          <Dashboard data={usageData} fileName={fileName} onReset={handleReset} />
        )}
      </main>

      <footer className="w-full max-w-7xl mt-8 text-center text-slate-500 text-sm">
        <p>React, TypeScript, Tailwind CSS로 제작되었습니다. 차트: Recharts.</p>
      </footer>
    </div>
  );
};

export default App;