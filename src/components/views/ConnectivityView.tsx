"use client";

import React from 'react';
import { Key, List, Loader2, Search, Activity, CheckCircle2 } from 'lucide-react';

export const ConnectivityView = ({ state }: { state: any }) => {
  const { t } = state;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="size-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner"><Key className="size-6" /></div>
          <h3 className="font-black text-slate-900 text-base tracking-tight uppercase">{t.api_creds}</h3>
        </div>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label py-1 px-1"><span className="label-text text-[10px] font-black uppercase text-slate-600 tracking-wide">{t.acc_email}</span></label>
            <input type="email" value={state.authEmail} onChange={(e) => state.setAuthEmail(e.target.value)} className="input input-md bg-slate-50 border-slate-200 w-full rounded-xl text-sm font-bold h-11 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-sm" placeholder="user@cloudflare.com" />
          </div>
          <div className="form-control">
            <label className="label py-1 px-1"><span className="label-text text-[10px] font-black uppercase text-slate-600 tracking-wide">{t.global_key}</span></label>
            <input type="password" value={state.globalKey} onChange={(e) => state.setGlobalKey(e.target.value)} className="input input-md bg-slate-50 border-slate-200 w-full rounded-xl text-sm font-bold h-11 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-sm" placeholder="••••••••••••••••••••••••" />
          </div>
          <button 
            onClick={state.handleFetchAccounts} 
            disabled={state.loadStates.inv} 
            className="btn btn-primary btn-md w-full rounded-xl font-black uppercase text-xs h-12 border-none mt-2 shadow-lg shadow-indigo-200 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-200 disabled:text-slate-400"
          >
            {state.loadStates.inv ? <Loader2 className="size-4 animate-spin text-white" /> : <Search className="size-4 text-white" />} 
            <span className="text-white">{t.establish_session}</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8 flex flex-col">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="size-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner"><List className="size-6" /></div>
          <h3 className="font-black text-slate-900 text-base tracking-tight uppercase">{t.active_contexts}</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 border border-slate-100 rounded-2xl mt-6 max-h-[300px] custom-scrollbar-light shadow-inner bg-slate-50/30">
          {state.accounts.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center opacity-30">
              <Activity className="size-10 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.awaiting_auth}</p>
            </div>
          ) : state.accounts.map((acc: any) => (
            <button key={acc.id} onClick={() => state.handleSelectAccount(acc.id, acc.name)} className={`w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-all group ${state.selectedAccountId === acc.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''}`}>
              <div className="min-w-0 pr-4">
                <p className="text-[12px] font-black text-slate-900 group-hover:text-indigo-600 truncate transition-colors">{acc.name}</p>
                <p className="text-[9px] text-slate-500 font-mono mt-0.5 truncate uppercase tracking-tighter">{acc.id}</p>
              </div>
              {state.selectedAccountId === acc.id && <CheckCircle2 className="size-4 text-indigo-600 shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};