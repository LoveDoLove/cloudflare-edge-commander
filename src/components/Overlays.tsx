"use client";

import React from 'react';
import { ShieldAlert, Terminal, X } from 'lucide-react';

export const DeleteConfirmationModal = ({ record, onCancel, onConfirm }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 border border-slate-200 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="size-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-inner"><ShieldAlert className="size-8" /></div>
        <div className="space-y-2"><h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Confirm Deletion</h3><p className="text-sm text-slate-500 font-medium">Permanently remove this record? This action cannot be reversed.</p></div>
        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1.5 text-left"><div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</span><span className="text-xs font-black text-indigo-600">{record.type}</span></div><div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</span><span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">{record.name}</span></div></div>
        <div className="grid grid-cols-2 gap-3 w-full pt-4">
          <button onClick={onCancel} className="btn btn-ghost rounded-2xl font-black uppercase text-[11px] h-12 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 active:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="btn bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase text-[11px] h-12 border-none shadow-lg shadow-rose-200 transition-all active:scale-95">Delete Record</button>
        </div>
      </div>
    </div>
  </div>
);

export const ConsoleDrawer = ({ isOpen, onClose, logs, logEndRef }: any) => (
  <div className={`absolute bottom-0 left-0 right-0 bg-[#0F172A] border-t border-slate-800 transition-all duration-700 ease-in-out z-50 overflow-hidden shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.6)] ${isOpen ? 'h-[280px]' : 'h-0'}`}>
    <div className="h-full flex flex-col">
      <div className="bg-slate-800/70 px-8 py-3.5 flex items-center justify-between border-b border-slate-700/50">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2.5"><div className="flex gap-1.5"><div className="size-2 rounded-full bg-rose-500/80 shadow-sm" /><div className="size-2 rounded-full bg-amber-500/80 shadow-sm" /><div className="size-2 rounded-full bg-emerald-500/80 shadow-sm" /></div><Terminal className="size-4 ml-2" /> Live Node Logs</span>
        <button onClick={onClose} className="text-slate-500 hover:text-white p-1 transition-all hover:rotate-90 duration-300"><X className="size-5" /></button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 custom-scrollbar bg-slate-950/40 text-slate-300 shadow-inner">
        {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
                <Terminal className="size-16 mb-4" /><p className="font-black uppercase tracking-[0.5em] text-xs">Waiting for events...</p>
            </div>
        ) : logs.map((log: any, i: number) => (
          <div key={i} className="flex gap-6 group border-b border-white/[0.02] pb-2 hover:bg-white/[0.01] transition-colors">
            <span className="text-slate-600 shrink-0 tabular-nums font-bold">[{log.time}]</span>
            <span className={`shrink-0 font-black tracking-widest ${log.type === 'success' ? 'text-emerald-500' : log.type === 'error' ? 'text-rose-500' : 'text-indigo-400'}`}>{log.type.toUpperCase()}</span>
            <span className={log.type === 'success' ? 'text-emerald-50' : log.type === 'error' ? 'text-rose-50' : 'text-slate-300'}>{log.msg}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  </div>
);