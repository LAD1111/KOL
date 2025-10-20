
import React, { useState, useEffect, useCallback } from 'react';
import { generateScripts } from './services/geminiService';
import type { Script, HistoryItem } from './types';
import { filterScripts } from './utils/filterBannedWords';
import ScriptCard from './components/ScriptCard';
import LoadingSpinner from './components/LoadingSpinner';
import SparklesIcon from './components/icons/SparklesIcon';
import ThemeToggle from './components/ThemeToggle';
import HistoryItemCard from './components/HistoryItemCard';

function App() {
  const [productLink, setProductLink] = useState('');
  const [scripts, setScripts] = useState<Script[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [filterEnabled, setFilterEnabled] = useState(true);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productLink.trim() || isLoading) return;

    // Basic URL validation
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
      const result = await generateScripts(productLink);
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
     // Scroll to top to see the results
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
       <div 
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-900/30"
        style={{zIndex: -1}}
      ></div>

      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 to-sky-500 text-transparent bg-clip-text">
            AI Viral Video Script Generator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Dán link sản phẩm của bạn và để AI KOL tạo 3 kịch bản video TikTok & Reels viral chỉ trong vài giây!
          </p>
        </header>

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-white/50 dark:bg-slate-800/50 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
            <input
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
                    <ScriptCard key={index} script={script} index={index} />
                    ))}
                </div>
              </div>
            )}
        </div>

        {history.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-200">Lịch sử sáng tạo</h2>
            <div className="space-y-3">
              {history.map(item => (
                <HistoryItemCard 
                  key={item.id} 
                  item={item} 
                  onSelect={handleSelectHistoryItem}
                  onDelete={handleDeleteHistoryItem}
                  isSelected={item.id === selectedHistoryId}
                />
              ))}
            </div>
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
