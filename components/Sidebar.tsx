
import React from 'react';
import { SVGHistoryItem } from '../types';

interface SidebarProps {
  history: SVGHistoryItem[];
  onSelect: (item: SVGHistoryItem) => void;
  onClear: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="w-72 border-r border-slate-800 flex flex-col bg-slate-900 overflow-hidden shrink-0">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="font-bold text-slate-200">History</h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors uppercase tracking-tighter"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {history.length === 0 ? (
          <div className="py-10 px-4 text-center text-slate-600 italic text-sm">
            No history yet...
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium truncate group-hover:text-white">
                {item.prompt}
              </p>
            </button>
          ))
        )}
      </div>
      <div className="p-4 bg-slate-800/20 text-[11px] text-slate-500 text-center">
        Powered by Gemini 3 Pro
      </div>
    </div>
  );
};

export default Sidebar;
