import React, { useState } from 'react';
import type { HistoryItem } from '../types';
import TrashIcon from './icons/TrashIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface HistoryItemCardProps {
  item: HistoryItem;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
}

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onSelect, onDelete, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onSelect from firing
    onDelete(item.id);
  };
  
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800/50 rounded-lg shadow-md cursor-pointer transition-all duration-200 border ${isSelected ? 'border-purple-500 ring-2 ring-purple-500' : 'border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600'}`}
      onClick={() => onSelect(item)}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium text-purple-600 dark:text-purple-300 truncate" title={item.productLink}>
            {item.productLink}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(item.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-2">
            <button
                onClick={handleToggleExpand}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label={isExpanded ? "Collapse" : "Expand"}
            >
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            <button
                onClick={handleDelete}
                className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
                aria-label="Delete item"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold mt-3 mb-2 text-gray-700 dark:text-gray-200">Generated Scripts:</h4>
          <ul className="list-disc list-inside space-y-1">
            {item.scripts.map((script, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {script.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistoryItemCard;