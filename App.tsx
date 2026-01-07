
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import Button from './components/Button';
import { SVGHistoryItem } from './types';
import { generateSVG } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [history, setHistory] = useState<SVGHistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('svg_genius_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0) {
          setCode(parsed[0].code);
        }
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('svg_genius_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const generatedCode = await generateSVG(prompt, code || undefined);
      
      const newItem: SVGHistoryItem = {
        id: crypto.randomUUID(),
        prompt: prompt,
        code: generatedCode,
        timestamp: Date.now()
      };

      setHistory(prev => [newItem, ...prev].slice(0, 50));
      setCode(generatedCode);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistory = (item: SVGHistoryItem) => {
    setCode(item.code);
    setError(null);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all your SVG history?')) {
      setHistory([]);
      localStorage.removeItem('svg_genius_history');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `illustration-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('SVG code copied to clipboard!');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      <Sidebar 
        history={history} 
        onSelect={handleSelectHistory} 
        onClear={handleClearHistory} 
      />

      <main className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">SVG Genius</h1>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">AI Vector Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {code && (
              <>
                <Button variant="ghost" onClick={handleCopy} title="Copy code">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </Button>
                <Button variant="ghost" onClick={handleDownload} title="Download SVG">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </Button>
              </>
            )}
            <div className="h-6 w-px bg-slate-800 mx-2"></div>
            <a 
              href="https://github.com/yahyakhaia8001-svg/6" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
          {/* Work Space */}
          <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
            <Preview code={code} />
            
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-2 flex flex-col">
              <div className="px-3 py-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live SVG Code</span>
                <span className="text-[10px] font-mono text-slate-600">{code ? `${code.length} characters` : 'Empty'}</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-32 bg-slate-950/50 text-indigo-400 p-4 code-font text-xs border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none overflow-y-auto"
                placeholder="SVG code will appear here..."
              />
            </div>
          </div>

          {/* Interaction Pane */}
          <div className="w-full md:w-80 flex flex-col gap-4">
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 shadow-xl">
              <h3 className="text-sm font-semibold mb-3 text-slate-100 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Generator
              </h3>
              <form onSubmit={handleGenerate} className="space-y-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A minimalist mountain landscape at sunset with a circular frame..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-32 resize-none placeholder-slate-600 transition-all focus:bg-slate-900"
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  isLoading={isGenerating}
                >
                  {code ? 'Modify SVG' : 'Generate SVG'}
                </Button>
              </form>
              
              {error && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/50 rounded-lg text-xs text-rose-400">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 flex-1 overflow-hidden flex flex-col">
              <h3 className="text-sm font-semibold mb-3 text-slate-100">Quick Tips</h3>
              <div className="space-y-3 overflow-y-auto pr-2">
                <div className="text-xs text-slate-400 leading-relaxed p-3 bg-slate-800/40 rounded-lg">
                  <strong className="text-slate-300 block mb-1">Iterations</strong>
                  You can modify the existing SVG by describing what to add or change, like <span className="text-indigo-400">"make it dark mode"</span> or <span className="text-indigo-400">"add a golden sun"</span>.
                </div>
                <div className="text-xs text-slate-400 leading-relaxed p-3 bg-slate-800/40 rounded-lg">
                  <strong className="text-slate-300 block mb-1">Design Styles</strong>
                  Mention styles like <span className="text-indigo-400">"isometric"</span>, <span className="text-indigo-400">"flat design"</span>, or <span className="text-indigo-400">"geometric"</span> for specific looks.
                </div>
                <div className="text-xs text-slate-400 leading-relaxed p-3 bg-slate-800/40 rounded-lg">
                  <strong className="text-slate-300 block mb-1">Color Palette</strong>
                  Specify hex codes or color names to match your brand identity.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
