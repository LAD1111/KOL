import React, { useState, useRef, useCallback } from 'react';
import CameraIcon from './icons/CameraIcon';
import UploadCloudIcon from './icons/UploadCloudIcon';
import XCircleIcon from './icons/XCircleIcon';

interface ImageUploaderProps {
  onImageReady: (image: { data: string; mimeType: string }) => void;
  onImageRemove: () => void;
  productImage: { data: string; mimeType: string } | null;
}

const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ data: base64Data, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

const CameraCaptureModal: React.FC<{onCapture: (blob: Blob) => void; onClose: () => void;}> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert("Không thể truy cập camera. Vui lòng cấp quyền và thử lại.");
            onClose();
        }
    };
    
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };
    
    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if(blob) {
                    onCapture(blob);
                }
                handleClose();
            }, 'image/jpeg', 0.9);
        }
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };
    
    React.useEffect(() => {
      startCamera();
      return () => stopCamera();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-t-lg"></video>
                <div className="p-4 flex justify-center">
                    <button onClick={handleCapture} className="p-4 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
                        <CameraIcon className="w-6 h-6 text-white"/>
                    </button>
                </div>
            </div>
        </div>
    );
};


const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageReady, onImageRemove, productImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chỉ chọn file ảnh.');
        return;
      }
      const image = await fileToBase64(file);
      onImageReady(image);
    }
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow drop
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  const handlePhotoCapture = async (blob: Blob) => {
    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
    const image = await fileToBase64(file);
    onImageReady(image);
    setShowCamera(false);
  };

  if (productImage) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <img
          src={`data:image/jpeg;base64,${productImage.data}`}
          alt="Product preview"
          className="w-full h-full object-contain bg-slate-100 dark:bg-slate-800"
        />
        <button
          onClick={onImageRemove}
          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors"
          aria-label="Remove image"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <>
      {showCamera && <CameraCaptureModal onCapture={handlePhotoCapture} onClose={() => setShowCamera(false)} />}
      <div
        className={`relative w-full aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-4 transition-colors duration-200 ${
          isDragging ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800'
        }`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <UploadCloudIcon className="w-12 h-12 text-slate-400 mb-2" />
        <p className="text-slate-600 dark:text-slate-300 font-semibold mb-1">
          Kéo thả ảnh vào đây, hoặc{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-purple-500 hover:underline font-bold"
          >
            tải lên
          </button>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Hỗ trợ PNG, JPG, WEBP</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
        />
        <div className="absolute bottom-4">
             <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-full transition-colors text-sm"
              >
                <CameraIcon className="w-4 h-4" />
                Chụp ảnh
            </button>
        </div>
      </div>
    </>
  );
};

export default ImageUploader;
