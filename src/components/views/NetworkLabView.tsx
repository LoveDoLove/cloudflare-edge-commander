"use client";

import React from 'react';
import { Network, Binary, Hash, Globe, Activity } from 'lucide-react';

export const NetworkLabView = ({ state, utils }: { state: any, utils: any }) => {
  const { t } = state;
  const handleAnalyze = () => {
    const arpa = utils.ipv6ToArpa(state.ipv6Input);
    state.setLabResults([{ ip: state.ipv6Input, arpa }]);
    state.addLog(`Lab Analysis: Processed ${state.ipv6Input}`, 'info');
  };

  const handleRandomize = () => {
    const results = Array.from({ length: 4 }).map(() => {
        const ip = utils.generateRandomIPv6(state.ipv6Input);
        const arpa = utils.ipv6ToArpa(ip);
        return { ip, arpa };
    });
    state.setLabResults(results);
    state.addLog(`Intelligence Engine: Nodes generated.`, 'success');
  };

  const copy = (txt: string) => {
    const el = document.createElement('textarea'); el.value = txt; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
    state.addLog(`Data copied.`, 'info');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-4xl shadow-xl shadow-slate-200/40 p-6 sm:p-8 space-y-6 sm:space-y-8">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="size-11 sm:size-12 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                  <Network className="size-5 sm:size-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">{t.net_lab}</h3>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.intel_engine}</p>
                </div>
              </div>
              <div className="space-y-6">
                  <div className="form-control">
                    <label className="label px-1 pt-0">
                      <span className="label-text text-[10px] sm:text-[11px] font-black uppercase text-slate-600 tracking-wider">{t.ipv6_block}</span>
                    </label>
                    <input 
                      type="text" 
                      value={state.ipv6Input} 
                      onChange={(e) => state.setIpv6Input(e.target.value)} 
                      className="input input-lg bg-slate-50 border-slate-200 w-full rounded-2xl text-sm sm:text-base font-mono font-bold h-14 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-center shadow-sm" 
                      placeholder="2001:db8::/32" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button onClick={handleAnalyze} className="btn bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest h-14 border-none shadow-lg shadow-slate-200">{t.analyze}</button>
                    <button onClick={handleRandomize} className="btn bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest h-14 border-none shadow-lg shadow-indigo-100">{t.randomize}</button>
                  </div>
              </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-4xl shadow-xl shadow-slate-200/40 overflow-hidden min-h-[250px] sm:min-h-75 flex flex-col">
                  <div className="px-6 sm:px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Binary className="size-4 text-slate-400" />
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{t.output_reg}</span>
                    </div>
                    <span className="text-[9px] font-black bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">{state.labResults.length} {isFinite(state.labResults.length) ? 'RES' : ''}</span>
                  </div>
                  <div className="flex-1 p-4 sm:p-6 custom-scrollbar-light overflow-y-auto max-h-[400px] sm:max-h-125">
                      {state.labResults.length > 0 ? (
                        <div className="space-y-4">
                          {state.labResults.map((res: any, idx: number) => (
                            <div 
                              key={idx} 
                              className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg animate-in slide-in-from-right-4 duration-300" 
                              style={{ animationDelay: `${idx * 100}ms` }}
                            >
                              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">#{idx + 1}</span>
                                <div className="flex gap-2">
                                  <button onClick={() => copy(res.ip)} className="flex items-center gap-1.5 text-[8px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase">
                                    <Hash className="size-2.5" /> <span className="hidden xs:inline">{t.copy_ip}</span>
                                  </button>
                                  <button onClick={() => copy(res.arpa)} className="flex items-center gap-1.5 text-[8px] font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase">
                                    <Globe className="size-2.5" /> <span className="hidden xs:inline">{t.copy_arpa}</span>
                                  </button>
                                </div>
                              </div>
                              <div className="p-4 space-y-3">
                                <div>
                                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{t.gen_node}</p>
                                  <p className="text-white font-mono text-xs sm:text-[13px] font-bold select-all truncate">{res.ip}</p>
                                </div>
                                <div>
                                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{t.mapping}</p>
                                  <p className="text-indigo-300 font-mono text-[10px] sm:text-[11px] select-all break-all leading-relaxed">{res.arpa}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center py-16 sm:py-20 opacity-20 grayscale">
                          <Activity className="size-12 sm:size-16 mb-4" />
                          <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em]">{t.system_idle}</p>
                        </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};