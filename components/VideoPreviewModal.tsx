import React from 'react';

interface VideoPreviewModalProps {
  videoUrl: string | null;
  onClose: () => void;
  title: string;
}

const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({ videoUrl, onClose, title }) => {
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-3xl aspect-video relative flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white truncate pr-4">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="flex-grow flex items-center justify-center bg-black rounded-b-2xl">
            <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
            >
                Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
