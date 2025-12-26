"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShieldAlert, Terminal, X, GripHorizontal, Trash2 } from 'lucide-react';

export const DeleteConfirmationModal = ({ state, record, onCancel, onConfirm }: any) => {
  const { t } = state;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 border border-slate-200 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="size-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-inner"><ShieldAlert className="size-8" /></div>
          <div className="space-y-2"><h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t.confirm_del}</h3><p className="text-sm text-slate-500 font-medium">{t.del_desc}</p></div>
          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1.5 text-left"><div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</span><span className="text-xs font-black text-indigo-600">{record.type}</span></div><div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</span><span className="text-xs font-bold text-slate-900 truncate max-w-45">{record.name}</span></div></div>
          <div className="grid grid-cols-2 gap-3 w-full pt-4">
            <button onClick={onCancel} className="btn btn-ghost rounded-2xl font-black uppercase text-[11px] h-12 border border-slate-200 text-slate-600">{t.cancel}</button>
            <button onClick={onConfirm} className="btn bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase text-[11px] h-12 border-none shadow-lg shadow-rose-200 transition-all active:scale-95">{t.delete}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConsoleDrawer = ({ state, isOpen, onClose, logs, logEndRef }: any) => {
  const { t, consoleHeight, setConsoleHeight } = state;
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Implement resizing logic
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // Calculate new height based on mouse position from bottom
      const newHeight = window.innerHeight - e.clientY;
      // Clamp values between 150px and 80% of window
      if (newHeight >= 150 && newHeight <= window.innerHeight * 0.8) {
        setConsoleHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setConsoleHeight]);

  return (
    <div 
      ref={containerRef}
      style={{ height: isOpen ? `${consoleHeight}px` : '0px' }}
      className={`absolute bottom-0 left-0 right-0 bg-[#0F172A] border-t border-slate-800 transition-[height] duration-300 ease-in-out z-50 overflow-hidden shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.8)] ${isResizing ? 'transition-none' : ''}`}
    >
      {/* Resizing Handle */}
      <div 
        onMouseDown={handleMouseDown}
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-orange-500/40 transition-colors z-60 flex items-center justify-center group"
      >
        <div className="w-12 h-1 bg-slate-700 rounded-full group-hover:bg-orange-500 transition-colors" />
      </div>

      <div className="h-full flex flex-col pt-1">
        <div className="bg-slate-900/90 px-8 py-3.5 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <div className="size-2 rounded-full bg-rose-500 shadow-sm" />
                <div className="size-2 rounded-full bg-amber-500 shadow-sm" />
                <div className="size-2 rounded-full bg-emerald-500 shadow-sm" />
              </div>
              <Terminal className="size-4 ml-2 text-orange-500" /> {t.live_logs}
            </span>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                {logs.length} Operations in session
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={onClose} 
                className="text-slate-500 hover:text-white p-1 transition-all hover:bg-slate-800 rounded-lg group"
                title="Minimize console"
            >
              <X className="size-5 transition-transform group-hover:rotate-90 duration-300" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 custom-scrollbar bg-slate-950/20 text-slate-300 shadow-inner">
          {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale py-10">
                  <Terminal className="size-16 mb-4" /><p className="font-black uppercase tracking-[0.5em] text-xs">{t.waiting_events}</p>
              </div>
          ) : logs.map((log: any, i: number) => (
            <div key={i} className="flex gap-6 group border-b border-white/2 pb-2 hover:bg-white/1 transition-colors items-start">
              <span className="text-slate-600 shrink-0 tabular-nums font-bold select-none">[{log.time}]</span>
              <span className={`shrink-0 font-black tracking-widest text-[9px] px-1.5 py-0.5 rounded border ${
                log.type === 'success' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' : 
                log.type === 'error' ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' : 
                'text-indigo-400 border-indigo-500/30 bg-indigo-500/5'
              }`}>
                {log.type.toUpperCase()}
              </span>
              <span className={`flex-1 ${log.type === 'success' ? 'text-emerald-50/90' : log.type === 'error' ? 'text-rose-50/90' : 'text-slate-300'}`}>
                {log.msg}
              </span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};