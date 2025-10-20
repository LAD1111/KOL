import React, { useState, useRef } from 'react';
import CopyIcon from './icons/CopyIcon';

interface LinkResolverProps {
  productLink: string;
  onProductLinkChange: (link: string) => void;
}

const LinkResolver: React.FC<LinkResolverProps> = ({ productLink, onProductLinkChange }) => {
  const [shortUrl, setShortUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const finalUrlInputRef = useRef<HTMLInputElement>(null);

  const handleOpenLink = () => {
    if (shortUrl.trim()) {
      try {
        let urlToOpen = shortUrl.trim();
        if (!/^https?:\/\//i.test(urlToOpen)) {
          urlToOpen = 'https://' + urlToOpen;
        }
        window.open(urlToOpen, '_blank', 'noopener,noreferrer');
        finalUrlInputRef.current?.focus();
      } catch (e) {
        console.error("Failed to open URL", e);
      }
    }
  };
  
  const handleCopy = () => {
    if(productLink.trim()) {
      navigator.clipboard.writeText(productLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
      {/* Step 1: Short URL Helper */}
      <div>
        <label htmlFor="shortUrl" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          <strong>Bước 1 (Nếu cần):</strong> Gỡ link rút gọn (VD: TikTok, Shopee)
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            id="shortUrl"
            type="url"
            value={shortUrl}
            onChange={(e) => setShortUrl(e.target.value)}
            placeholder="Dán link rút gọn vào đây..."
            className="w-full sm:flex-1 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors text-sm"
          />
          <button
            type="button"
            onClick={handleOpenLink}
            disabled={!shortUrl.trim()}
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Mở link trong tab mới
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-2">
          Một tab mới sẽ mở ra. Bạn hãy <strong>sao chép link đầy đủ</strong> từ thanh địa chỉ của tab đó.
        </p>
      </div>

      {/* Step 2: Final URL Input */}
      <div>
        <label htmlFor="finalUrl" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          <strong>Bước 2:</strong> Dán link sản phẩm cuối cùng vào đây để AI phân tích
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            ref={finalUrlInputRef}
            id="finalUrl"
            type="url"
            value={productLink}
            onChange={(e) => onProductLinkChange(e.target.value)}
            placeholder="https://shopee.vn/product/..."
            className="w-full sm:flex-1 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-slate-800 dark:text-slate-200"
            required
          />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!productLink.trim()}
            title="Sao chép link cuối"
            className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 hover:dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <CopyIcon className="w-4 h-4" />
            <span>{isCopied ? 'Đã chép!' : 'Chép'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkResolver;
