import React, { useState } from 'react';
import type { Script } from '../types';

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
    text += `**Kêu gọi hành động (CTA):**\n${script.cta}`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatScriptForCopy());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm border border-slate-200 dark:border-slate-700`}>
      <div className={`p-5 bg-gradient-to-r ${colors[index % colors.length]}`}>
        <h3 className="text-xl font-bold text-white flex items-center">
            <span className="bg-white/20 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">{index + 1}</span>
            {script.title}
        </h3>
      </div>
      <div className="p-6 space-y-4 relative">
        <button onClick={handleCopy} className="absolute top-4 right-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold py-1 px-3 rounded-lg text-sm transition-colors duration-200">
          {isCopied ? 'Đã chép!' : 'Chép'}
        </button>

        <div>
          <h4 className="font-semibold text-purple-600 dark:text-purple-300 mb-1">🎬 Mở đầu (Hook)</h4>
          <p className="text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-purple-400">{script.hook}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sky-600 dark:text-sky-300 mb-2">🎞️ Các cảnh</h4>
          <div className="space-y-3 pl-4 border-l-2 border-sky-400">
            {script.scenes.map((scene, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Hình ảnh:</span> {scene.visual}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Lời thoại:</span> {scene.voiceover}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-emerald-600 dark:text-emerald-300 mb-1">🚀 Kêu gọi hành động (CTA)</h4>
          <p className="text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-emerald-400">{script.cta}</p>
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;