
import React from 'react';

interface PreviewProps {
  code: string;
}

const Preview: React.FC<PreviewProps> = ({ code }) => {
  return (
    <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
      <div className="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Preview</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
        </div>
      </div>
      <div className="flex-1 relative flex items-center justify-center p-8 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
        {code ? (
          <div 
            className="max-w-full max-h-full flex items-center justify-center drop-shadow-2xl"
            dangerouslySetInnerHTML={{ __html: code }}
          />
        ) : (
          <div className="text-center text-slate-500">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Describe something to generate an SVG illustration</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
