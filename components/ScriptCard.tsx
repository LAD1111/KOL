import React, { useState } from 'react';
import type { Script } from '../types';
import CopyIcon from './icons/CopyIcon';
import DownloadIcon from './icons/DownloadIcon';
import FileTextIcon from './icons/FileTextIcon';

interface ScriptCardProps {
  script: Script;
  index: number;
}

const colors = [
  'from-purple-500 to-indigo-500',
  'from-sky-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
];

const ScriptCard: React.FC<ScriptCardProps> = ({ script, index }) => {
  const [isCopied, setIsCopied] = useState(false);

  const formatScriptForCopy = () => {
    let text = `**${script.title}**\n\n`;
    text += `**Mở đầu (Hook):**\n${script.hook}\n\n`;
    text += `**Các cảnh:**\n`;
    script.scenes.forEach((scene, i) => {
        text += `Cảnh ${i + 1}:\n`;
        text += `- Hình ảnh: ${scene.visual}\n`;
        text += `- Lời thoại: ${scene.voiceover}\n\n`;
    });
    text += `**Kêu gọi hành động (CTA):**\n${script.cta}\n\n`;

    if (script.postContent && script.hashtags) {
      text += `**Nội dung bài đăng:**\n${script.postContent}\n\n`;
      text += `**Hashtags:**\n${script.hashtags.join(' ')}\n`;
    }
    return text;
  };

  const formatOutlineForExport = () => {
    let text = `VIDEO OUTLINE: ${script.title}\n\n`;
    text += `HOOK:\n- ${script.hook}\n\n`;
    text += `SHOT LIST (VISUALS):\n`;
    script.scenes.forEach((scene, i) => {
        text += `- Cảnh ${i + 1}: ${scene.visual}\n`;
    });
    text += `\nCALL TO ACTION:\n- ${script.cta}`;
    return text;
  };

  const sanitizeFilename = (name: string) => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
  };

  const downloadToFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatScriptForCopy());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    downloadToFile(formatScriptForCopy(), `${sanitizeFilename(script.title)}_script.txt`);
  };

  const handleExportOutline = () => {
    downloadToFile(formatOutlineForExport(), `${sanitizeFilename(script.title)}_outline.txt`);
  };
  
  const ActionButton: React.FC<{onClick: () => void, children: React.ReactNode, 'aria-label': string}> = ({ onClick, children, 'aria-label': ariaLabel }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
    >
      {children}
    </button>
  );


  return (
    <div className={`bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm border border-slate-200 dark:border-slate-700 flex flex-col`}>
      <div className={`p-4 sm:p-5 bg-gradient-to-r ${colors[index % colors.length]}`}>
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <span className="bg-white/20 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">{index + 1}</span>
            {script.title}
        </h3>
      </div>
      <div className="p-4 sm:p-6 space-y-4 flex-grow">
        <div>
          <h4 className="font-semibold text-purple-600 dark:text-purple-300 mb-1">🎬 Mở đầu (Hook)</h4>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-purple-400">{script.hook}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sky-600 dark:text-sky-300 mb-2">🎞️ Các cảnh</h4>
          <div className="space-y-3 pl-4 border-l-2 border-sky-400">
            {script.scenes.map((scene, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg">
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Hình ảnh:</span> {scene.visual}</p>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Lời thoại:</span> {scene.voiceover}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-emerald-600 dark:text-emerald-300 mb-1">🚀 Kêu gọi hành động (CTA)</h4>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-emerald-400">{script.cta}</p>
        </div>
        
        {script.postContent && script.hashtags && (
          <div>
            <h4 className="font-semibold text-orange-600 dark:text-orange-300 mb-1">✍️ Nội dung bài đăng</h4>
             <div className="pl-4 border-l-2 border-orange-400 space-y-2">
               <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{script.postContent}</p>
               <p className="text-sm text-blue-500 dark:text-blue-400 font-medium">{script.hashtags.join(' ')}</p>
            </div>
          </div>
        )}

      </div>
      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-around items-center">
        <ActionButton onClick={handleCopy} aria-label="Copy script">
          <CopyIcon className="w-5 h-5" />
          <span className="text-xs font-semibold">{isCopied ? 'Đã chép!' : 'Chép'}</span>
        </ActionButton>
        <ActionButton onClick={handleDownloadScript} aria-label="Download script as text">
          <DownloadIcon className="w-5 h-5" />
          <span className="text-xs font-semibold">Tải kịch bản</span>
        </ActionButton>
        <ActionButton onClick={handleExportOutline} aria-label="Export video outline">
          <FileTextIcon className="w-5 h-5" />
          <span className="text-xs font-semibold">Xuất dàn ý</span>
        </ActionButton>
      </div>
    </div>
  );
};

export default ScriptCard;