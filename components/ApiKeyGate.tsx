import React from 'react';

interface ApiKeyGateProps {
  onSelectKey: () => void;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onSelectKey }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          Chào mừng bạn!
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Để bắt đầu sử dụng AI Generator, bạn cần chọn một API key đã được kích hoạt thanh toán.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Để biết thêm chi tiết về cách thanh toán, vui lòng tham khảo{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
            tài liệu hướng dẫn
          </a>.
        </p>
        <button
          onClick={onSelectKey}
          className="w-full bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-600 hover:to-sky-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Chọn API Key để bắt đầu
        </button>
      </div>
    </div>
  );
};

export default ApiKeyGate;
