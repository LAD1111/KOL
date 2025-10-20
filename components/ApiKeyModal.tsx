import React from 'react';

interface ApiKeyModalProps {
  onClose: () => void;
  onSelectKey: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onSelectKey }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 text-center" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Yêu cầu API Key</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Tính năng tạo video yêu cầu bạn chọn một API key đã được kích hoạt thanh toán.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Để biết thêm chi tiết về cách thanh toán, vui lòng tham khảo{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
            tài liệu hướng dẫn
          </a>.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onSelectKey}
            className="py-2 px-6 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
          >
            Chọn API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
