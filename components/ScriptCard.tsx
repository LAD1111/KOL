import React, { useState, useEffect } from 'react';
import type { Script } from '../types';
import CopyIcon from './icons/CopyIcon';
import DownloadIcon from './icons/DownloadIcon';
import FileTextIcon from './icons/FileTextIcon';
import VideoIcon from './icons/VideoIcon';
import StarIcon from './icons/StarIcon';
import VideoPreviewModal from './VideoPreviewModal';
import { generateVideoPreview } from '../services/geminiService';

interface ScriptCardProps {
  script: Script;
  index: number;
  onToggleSave: (scriptId: string) => void;
  apiKey: string;
  onInvalidApiKey: () => void;
}

const colors = [
  'from-purple-500 to-indigo-500',
  'from-sky-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
];

const ScriptCard: React.FC<ScriptCardProps> = ({ script, index, onToggleSave, apiKey, onInvalidApiKey }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoLoadingMessage, setVideoLoadingMessage] = useState('');
  
  const loadingMessages = [
    "Khởi tạo máy quay...",
    "Dựng cảnh đầu tiên...",
    "Thêm hiệu ứng đặc biệt...",
    "Render video...",
    "Sắp hoàn thành rồi...",
  ];

  useEffect(() => {
    let interval: number;
    if (isGeneratingVideo) {
      setVideoLoadingMessage(loadingMessages[0]);
      let i = 0;
      interval = window.setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setVideoLoadingMessage(loadingMessages[i]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGeneratingVideo]);

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
  
  const handleToggleSave = () => {
    onToggleSave(script.id);
  };
  
  const startVideoGeneration = async () => {
    if (isGeneratingVideo) return;

    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoUrl(null);

    try {
      const url = await generateVideoPreview(script, apiKey);
      setVideoUrl(url);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "API_KEY_INVALID") {
          setVideoError("API key không hợp lệ. Vui lòng nhập lại.");
          onInvalidApiKey();
        } else {
          setVideoError(err.message);
        }
      } else {
        setVideoError('Đã xảy ra lỗi không mong muốn khi tạo video.');
      }
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleGenerateVideoClick = async () => {
    setVideoError(null);
    await startVideoGeneration();
  };

  const ActionButton: React.FC<{onClick: () => void, children: React.ReactNode, 'aria-label': string, disabled?: boolean}> = ({ onClick, children, 'aria-label': ariaLabel, disabled }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );


  return (
    <>
      {videoUrl && (
        <VideoPreviewModal 
          videoUrl={videoUrl} 
          onClose={() => setVideoUrl(null)} 
          title={script.title} 
        />
      )}
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
        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 grid grid-cols-5 gap-1 text-center">
          <ActionButton onClick={handleToggleSave} aria-label={script.saved ? "Bỏ lưu kịch bản" : "Lưu kịch bản"}>
            <StarIcon className={`w-5 h-5 mx-auto ${script.saved ? 'text-amber-400' : ''}`} isFilled={script.saved} />
            <span className="text-xs font-semibold">{script.saved ? 'Đã lưu' : 'Lưu'}</span>
          </ActionButton>
          <ActionButton onClick={handleCopy} aria-label="Sao chép kịch bản">
            <CopyIcon className="w-5 h-5 mx-auto" />
            <span className="text-xs font-semibold">{isCopied ? 'Đã chép!' : 'Chép'}</span>
          </ActionButton>
          <ActionButton onClick={handleDownloadScript} aria-label="Tải kịch bản dưới dạng văn bản">
            <DownloadIcon className="w-5 h-5 mx-auto" />
            <span className="text-xs font-semibold">Tải kịch bản</span>
          </ActionButton>
          <ActionButton onClick={handleExportOutline} aria-label="Xuất dàn ý video">
            <FileTextIcon className="w-5 h-5 mx-auto" />
            <span className="text-xs font-semibold">Xuất dàn ý</span>
          </ActionButton>
          <ActionButton onClick={handleGenerateVideoClick} aria-label="Tạo video xem trước" disabled={isGeneratingVideo}>
            <VideoIcon className={`w-5 h-5 mx-auto ${isGeneratingVideo ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-semibold">{isGeneratingVideo ? 'Đang tạo...' : 'Tạo Video'}</span>
          </ActionButton>
        </div>
        {(isGeneratingVideo || videoError) && (
            <div className="border-t border-slate-200 dark:border-slate-700">
                {isGeneratingVideo && (
                    <div className="p-2 text-center text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                        {videoLoadingMessage}
                    </div>
                )}
                {videoError && !isGeneratingVideo && (
                    <div className="p-2 text-center text-xs bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300">
                        {videoError}
                    </div>
                )}
            </div>
        )}
      </div>
    </>
  );
};

export default ScriptCard;
