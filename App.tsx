import React, { useState, useEffect, useCallback } from 'react';
import { generateScripts } from './services/geminiService';
import type { Script, HistoryItem } from './types';
import { filterScripts } from './utils/filterBannedWords';
import ScriptCard from './components/ScriptCard';
import LoadingSpinner from './components/LoadingSpinner';
import SparklesIcon from './components/icons/SparklesIcon';
import ThemeToggle from './components/ThemeToggle';
import HistoryItemCard from './components/HistoryItemCard';
import ChevronDownIcon from './components/icons/ChevronDownIcon';

function App() {
  const [productLink, setProductLink] = useState('');
  const [kolTone, setKolTone] = useState<string>('Năng động');
  const [hookStyle, setHookStyle] = useState<string>('Mặc định');
  const [includeCameraAngles, setIncludeCameraAngles] = useState(false);
  const [generatePost, setGeneratePost] = useState(false);
  const [scripts, setScripts] = useState<Script[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Effect for theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  // Effect for history
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('scriptHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      setHistory([]);
    }
  }, []);

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('scriptHistory', JSON.stringify(newHistory));
  }

  const handleToggleSaveScript = useCallback((scriptId: string) => {
    const newHistory = history.map(historyItem => {
      const scriptIndex = historyItem.scripts.findIndex(s => s.id === scriptId);
      if (scriptIndex > -1) {
        const updatedScripts = [...historyItem.scripts];
        const targetScript = updatedScripts[scriptIndex];
        updatedScripts[scriptIndex] = { ...targetScript, saved: !targetScript.saved };
        return { ...historyItem, scripts: updatedScripts };
      }
      return historyItem;
    });
    updateHistory(newHistory);
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productLink.trim() || isLoading) return;

    try {
      new URL(productLink);
    } catch (_) {
      setError('Vui lòng nhập một URL hợp lệ.');
      return;
    }

    setIsLoading(true);
    setScripts(null);
    setError(null);
    setSelectedHistoryId(null);

    try {
      const result = await generateScripts(productLink, kolTone, includeCameraAngles, hookStyle, generatePost);
      const newHistoryItem: HistoryItem = {
        id: `gen-${Date.now()}`,
        timestamp: Date.now(),
        productLink,
        scripts: result.scripts,
      };
      
      setScripts(result.scripts);
      setSelectedHistoryId(newHistoryItem.id);
      updateHistory([newHistoryItem, ...history]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
    setProductLink(item.productLink);
    setScripts(item.scripts);
    setSelectedHistoryId(item.id);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    updateHistory(newHistory);
    if (selectedHistoryId === id) {
      setScripts(null);
      setSelectedHistoryId(null);
    }
  }, [history, selectedHistoryId]);

  const displayedScripts = filterEnabled && scripts ? filterScripts(scripts) : scripts;

  const filteredHistory = history.filter(item => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    
    const linkMatch = item.productLink.toLowerCase().includes(query);
    if (linkMatch) return true;

    return item.scripts.some(script => 
      script.title.toLowerCase().includes(query) ||
      script.hook.toLowerCase().includes(query) ||
      script.cta.toLowerCase().includes(query) ||
      (script.postContent && script.postContent.toLowerCase().includes(query)) ||
      script.scenes.some(scene => 
        scene.visual.toLowerCase().includes(query) ||
        scene.voiceover.toLowerCase().includes(query)
      )
    );
  });

  const savedScripts = history
    .flatMap(item => item.scripts)
    .filter(script => script.saved);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
       <div 
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-900/30"
        style={{zIndex: -1}}
      ></div>

      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 to-sky-500 text-transparent bg-clip-text">
            AI Viral Video Script Generator
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Dán link sản phẩm của bạn và để AI KOL tạo 3 kịch bản video TikTok & Reels viral chỉ trong vài giây!
          </p>
        </header>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="space-y-6 p-4 sm:p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
            <div>
              <label htmlFor="kolTone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                1. Chọn giọng điệu &amp; tùy chọn
              </label>
              <div className="relative">
                <select
                  id="kolTone"
                  value={kolTone}
                  onChange={(e) => setKolTone(e.target.value)}
                  className="w-full appearance-none bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-full py-3 px-5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-slate-800 dark:text-slate-200"
                  disabled={isLoading}
                >
                  <option value="Năng động">Năng động &amp; Nhiệt huyết</option>
                  <option value="Hài hước">Hài hước &amp; Dí dỏm</option>
                  <option value="Chuyên nghiệp">Chuyên nghiệp &amp; Chuyên gia</option>
                  <option value="Chân thực">Chân thực &amp; Gần gũi</option>
                  <option value="Giấu mặt">Giấu mặt (Không lộ diện)</option>
                  <option value="Người dùng đã sử dụng">Người dùng đã sử dụng</option>
                  <option value="Truyền cảm hứng & Tích cực">Truyền cảm hứng &amp; Tích cực</option>
                  <option value="Kể chuyện">Kể chuyện &amp; Cảm xúc</option>
                  <option value="Cá tính & Bắt trend">Cá tính &amp; Bắt trend</option>
                  <option value="Giáo dục & Tin tức">Giáo dục &amp; Tin tức</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-700 dark:text-slate-300">
                  <ChevronDownIcon className="w-5 h-5" />
                </div>
              </div>

               <div className="relative mt-4">
                <select
                  id="hookStyle"
                  value={hookStyle}
                  onChange={(e) => setHookStyle(e.target.value)}
                  className="w-full appearance-none bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-full py-3 px-5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-slate-800 dark:text-slate-200"
                  disabled={isLoading}
                >
                  <option value="Mặc định">Phong cách mở đầu: Mặc định</option>
                  <option value="Kích thích tò mò">Mở đầu: Kích thích tò mò</option>
                  <option value="Gợi sự liên tưởng">Mở đầu: Gợi sự liên tưởng</option>
                  <option value="Tạo sự tranh luận">Mở đầu: Tạo sự tranh luận</option>
                  <option value="Dựa trên kết quả">Mở đầu: Dựa trên kết quả</option>
                  <option value="Kêu gọi hành động">Mở đầu: Kêu gọi hành động</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-700 dark:text-slate-300">
                  <ChevronDownIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 pl-2">
                <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                    <input 
                        type="checkbox" 
                        name="cameraToggle" 
                        id="cameraToggle" 
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        checked={includeCameraAngles}
                        onChange={() => setIncludeCameraAngles(!includeCameraAngles)}
                        disabled={isLoading}
                    />
                    <label htmlFor="cameraToggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                </div>
                <label htmlFor="cameraToggle" className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                    Thêm hướng dẫn góc máy quay
                </label>
              </div>

              <div className="flex items-center gap-3 mt-4 pl-2">
                <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                    <input 
                        type="checkbox" 
                        name="postToggle" 
                        id="postToggle" 
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        checked={generatePost}
                        onChange={() => setGeneratePost(!generatePost)}
                        disabled={isLoading}
                    />
                    <label htmlFor="postToggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                </div>
                <label htmlFor="postToggle" className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                    Tạo nội dung bài đăng &amp; hashtag
                </label>
              </div>

            </div>
            
            <div>
              <label htmlFor="productLink" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                2. Dán link sản phẩm và tạo kịch bản
              </label>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-white/50 dark:bg-slate-900/30 rounded-full border border-slate-200 dark:border-slate-700">
                <input
                  id="productLink"
                  type="url"
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                  placeholder="https://shopee.vn/product/..."
                  className="w-full sm:flex-1 bg-transparent py-3 px-5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  disabled={isLoading}
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-600 hover:to-sky-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !productLink.trim()}
                >
                  <SparklesIcon className="w-5 h-5"/>
                  {isLoading ? 'Đang sáng tạo...' : 'Tạo kịch bản'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mb-12">
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg max-w-2xl mx-auto">{error}</div>}
            
            {displayedScripts && (
              <div className="space-y-4 max-w-4xl mx-auto">
                <div className="flex justify-end items-center gap-2">
                    <label htmlFor="filterToggle" className="text-sm font-medium text-slate-600 dark:text-slate-300">Lọc từ cấm</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="filterToggle" 
                            id="filterToggle" 
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={filterEnabled}
                            onChange={() => setFilterEnabled(!filterEnabled)}
                        />
                        <label htmlFor="filterToggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedScripts.map((script, index) => (
                    <ScriptCard 
                      key={script.id} 
                      script={script} 
                      index={index} 
                      onToggleSave={handleToggleSaveScript}
                    />
                    ))}
                </div>
              </div>
            )}
        </div>

        {history.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Lịch sử & Kịch bản đã lưu</h2>
              <div className="p-1 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${activeTab === 'history' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  Lịch sử ({history.length})
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${activeTab === 'saved' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  Đã lưu ({savedScripts.length})
                </button>
              </div>
            </div>

            {activeTab === 'history' && (
              <div>
                <div className="mb-4 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm trong lịch sử theo link, tiêu đề, lời thoại..."
                    className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-full py-3 px-5 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map(item => (
                      <HistoryItemCard 
                        key={item.id} 
                        item={item} 
                        onSelect={handleSelectHistoryItem}
                        onDelete={handleDeleteHistoryItem}
                        isSelected={item.id === selectedHistoryId}
                      />
                    ))
                  ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-6">Không tìm thấy kết quả phù hợp.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                {savedScripts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedScripts.map((script, index) => (
                      <ScriptCard 
                        key={script.id} 
                        script={script} 
                        index={index}
                        onToggleSave={handleToggleSaveScript} 
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-6">Bạn chưa lưu kịch bản nào.</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      <style>{`
        .toggle-checkbox:checked { right: 0; border-color: #6d28d9; }
        .toggle-checkbox:checked + .toggle-label { background-color: #6d28d9; }
      `}</style>
    </div>
  );
}

export default App;
