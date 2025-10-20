import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    <p className="text-lg text-gray-600 dark:text-gray-300">AI KOL đang phân tích link và sáng tạo kịch bản...</p>
  </div>
);

export default LoadingSpinner;