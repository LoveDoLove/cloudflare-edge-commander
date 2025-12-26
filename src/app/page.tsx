"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Globe, Key, Terminal, Loader2, CheckCircle2, 
  AlertCircle, Zap, Cpu, Lock, Mail, Activity, Dices, 
  RefreshCcw, Heart, FileText, Github, Search, Database, 
  ShieldAlert, List, ChevronRight, Settings2, Award, 
  PlusCircle, Trash2, Save, LayoutDashboard, Network, 
  CloudCog, X, Shield, Edit3, Check, RotateCcw, Copy, 
  Hash, Binary, Info
} from 'lucide-react';

// --- CONSTANTS ---
const DNS_TYPES = [
  'A', 'AAAA', 'CAA', 'CERT', 'CNAME', 'DNSKEY', 'DS', 'HTTPS', 
  'LOC', 'MX', 'NAPTR', 'NS', 'PTR', 'SMIMEA', 'SRV', 'SSHFP', 
  'SVCB', 'TLSA', 'TXT', 'URI'
];

// --- UTILITY FUNCTIONS ---
const ipv6ToArpa = (ipv6: string) => {
  try {
    let [address, prefix] = ipv6.includes('/') ? ipv6.split('/') : [ipv6, '128'];
    if (address.includes('::')) {
      const parts = address.split('::');
      const leftParts = parts[0].split(':').filter(x => x !== '');
      const rightParts = parts[1].split(':').filter(x => x !== '');
      const missingCount = 8 - (leftParts.length + rightParts.length);
      const expanded = [...leftParts, ...Array(missingCount).fill('0000'), ...rightParts];
      address = expanded.map(p => p.padStart(4, '0')).join(':');
    } else {
      address = address.split(':').map(p => p.padStart(4, '0')).join(':');
    }
    const fullHex = address.replace(/:/g, '');
    if (prefix && parseInt(prefix) < 128) {
        const nibbles = Math.floor(parseInt(prefix) / 4);
        return fullHex.substring(0, nibbles).split('').reverse().join('.') + '.ip6.arpa';
    }
    return fullHex.split('').reverse().join('.') + '.ip6.arpa';
  } catch (e) {
    return "Invalid IPv6 Format";
  }
};

const generateRandomIPv6 = (currentInput: string) => {
  const hexChars = "0123456789abcdef";
  const genPart = (len: number) => Array.from({length: len}, () => hexChars[Math.floor(Math.random() * 16)]).join('');
  try {
    const [addressPart, prefixPart] = currentInput.includes('/') ? currentInput.split('/') : [currentInput, '128'];
    const prefixLength = parseInt(prefixPart) || 128;
    let address = addressPart;
    if (address.includes('::')) {
      const parts = address.split('::');
      const leftParts = parts[0].split(':').filter(x => x !== '');
      const rightParts = parts[1].split(':').filter(x => x !== '');
      const missingCount = 8 - (leftParts.length + rightParts.length);
      const expanded = [...leftParts, ...Array(missingCount).fill('0000'), ...rightParts];
      address = expanded.map(p => p.padStart(4, '0')).join(':');
    } else {
      address = address.split(':').map(p => p.padStart(4, '0')).join(':');
    }
    const fullHex = address.replace(/:/g, '');
    const fixedNibbles = Math.floor(prefixLength / 4);
    const randomNibbles = 32 - fixedNibbles;
    const resultHex = fullHex.substring(0, fixedNibbles) + genPart(randomNibbles);
    const blocks = [];
    for (let i = 0; i < 32; i += 4) blocks.push(resultHex.substring(i, i + 4));
    return blocks.join(':');
  } catch (e) {
    return Array.from({length: 8}, () => genPart(4)).join(':');
  }
};

const canBeProxied = (type: string) => ['A', 'AAAA', 'CNAME'].includes(type);

// --- SUB-COMPONENTS (VIEWS) ---

/**
 * View 1: Connectivity (Authentication and Accounts)
 */
const ConnectivityView = ({ 
  authEmail, setAuthEmail, globalKey, setGlobalKey, handleFetchAccounts, invLoading, 
  accounts, selectedAccountId, handleSelectAccount 
}: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8 space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="size-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner"><Key className="size-6" /></div>
        <h3 className="font-black text-slate-900 text-base tracking-tight uppercase">API Credentials</h3>
      </div>
      <div className="space-y-4">
        <div className="form-control">
          <label className="label py-1 px-1"><span className="label-text text-[10px] font-black uppercase text-slate-600 tracking-wide">Account Email</span></label>
          <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="input input-md bg-slate-50 border-slate-200 w-full rounded-xl text-sm font-bold h-11 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-sm" placeholder="user@cloudflare.com" />
        </div>
        <div className="form-control">
          <label className="label py-1 px-1"><span className="label-text text-[10px] font-black uppercase text-slate-600 tracking-wide">Global API Key</span></label>
          <input type="password" value={globalKey} onChange={(e) => setGlobalKey(e.target.value)} className="input input-md bg-slate-50 border-slate-200 w-full rounded-xl text-sm font-bold h-11 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-sm" placeholder="••••••••••••••••••••••••" />
        </div>
        <button onClick={handleFetchAccounts} disabled={invLoading} className="btn btn-primary btn-md w-full rounded-xl font-black uppercase text-xs h-12 border-none mt-2 shadow-lg shadow-indigo-200 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-200 disabled:text-slate-400">
          {invLoading ? <Loader2 className="size-4 animate-spin text-white" /> : <Search className="size-4 text-white" />} 
          <span className="text-white">Establish Session</span>
        </button>
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8 flex flex-col">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="size-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner"><List className="size-6" /></div>
        <h3 className="font-black text-slate-900 text-base tracking-tight uppercase">Active Contexts</h3>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50 border border-slate-100 rounded-2xl mt-6 max-h-[300px] custom-scrollbar-light shadow-inner bg-slate-50/30">
        {accounts.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center opacity-30">
            <Activity className="size-10 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Auth</p>
          </div>
        ) : accounts.map((acc: any) => (
          <button key={acc.id} onClick={() => handleSelectAccount(acc.id, acc.name)} className={`w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-all group ${selectedAccountId === acc.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''}`}>
            <div className="min-w-0 pr-4">
              <p className="text-[12px] font-black text-slate-900 group-hover:text-indigo-600 truncate transition-colors">{acc.name}</p>
              <p className="text-[9px] text-slate-500 font-mono mt-0.5 truncate uppercase tracking-tighter">{acc.id}</p>
            </div>
            {selectedAccountId === acc.id && <CheckCircle2 className="size-4 text-indigo-600 shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/**
 * View 2: Edge Manager (Zone, DNS, and Security)
 */
const EdgeManagerView = ({
  selectedAccountId, zones, zoneId, selectedZoneName, handleSelectZone, handleAddDomain, 
  newDomainName, setNewDomainName, addDomainLoading, dnsLoading, dnsRecords, newDns, setNewDns, 
  handleAddDnsRecord, handleDeleteDnsRecord, editingRecordId, editFormData, setEditFormData, 
  handleStartEdit, handleCancelEdit, handleSaveEdit, setRecordToDelete, certLoading, 
  caProvider, setCaProvider, handleApplyCA, caLoading, sslMode, setSslMode, handleApplySSL, sslLoading
}: any) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Zone Sidebar */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/40 flex flex-col overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase text-slate-700 tracking-[0.15em]">Zone Registry</h3>
          <span className="badge badge-sm font-black text-[10px] bg-slate-200 border-none text-slate-600 px-3">{zones.length}</span>
        </div>
        <div className="p-5 space-y-5">
           {selectedAccountId && (
              <div className="flex gap-2">
                <input type="text" placeholder="Add domain.com..." value={newDomainName} onChange={(e) => setNewDomainName(e.target.value)} className="input input-sm bg-white border-slate-200 flex-1 rounded-xl text-[11px] font-bold h-11 focus:ring-4 focus:ring-indigo-50 shadow-sm" />
                <button onClick={handleAddDomain} disabled={addDomainLoading} className="btn btn-md btn-primary rounded-xl h-11 px-4 border-none shadow-md text-white hover:bg-indigo-700 active:bg-indigo-800">Add</button>
              </div>
           )}
           <div className="max-h-[480px] overflow-y-auto space-y-2 custom-scrollbar-light pr-1">
              {!selectedAccountId ? (
                <div className="p-20 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] opacity-50">Select Account</div>
              ) : zones.map((z: any) => (
                <button key={z.id} onClick={() => handleSelectZone(z.id, z.name)} className={`w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between group transition-all border duration-300 ${zoneId === z.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-100 scale-[1.02]' : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-800'}`}>
                    <span className="text-[12px] font-black truncate flex-1 pr-4">{z.name}</span>
                    <ChevronRight className={`size-4 transition-transform ${zoneId === z.id ? 'translate-x-0' : 'translate-x-[-4px] opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Configuration Area */}
      <div className="lg:col-span-8 space-y-8">
        {zoneId ? (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                 <div className="flex items-center gap-4">
                   <div className="size-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Globe className="size-7" /></div>
                   <div>
                     <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">Distributed DNS Registry</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Zone: {selectedZoneName}</p>
                   </div>
                 </div>
                 {dnsLoading && <Loader2 className="size-5 animate-spin text-indigo-600" />}
              </div>

              {/* Record Creation */}
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                 <select value={newDns.type} onChange={e => { const type = e.target.value; setNewDns({...newDns, type, proxied: canBeProxied(type) ? newDns.proxied : false}); }} className="select select-sm bg-white font-black h-11 text-[11px] sm:col-span-1 rounded-xl focus:outline-none">{DNS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
                 <input type="text" placeholder="Name (@)" value={newDns.name} onChange={e => setNewDns({...newDns, name: e.target.value})} className="input input-sm bg-white border-slate-200 h-11 text-[11px] font-black sm:col-span-1 rounded-xl focus:ring-4 focus:ring-indigo-100" />
                 <input type="text" placeholder="Content" value={newDns.content} onChange={e => setNewDns({...newDns, content: e.target.value})} className="input input-sm bg-white border-slate-200 h-11 text-[11px] font-black sm:col-span-2 rounded-xl focus:ring-4 focus:ring-indigo-100" />
                 <div className="flex items-center justify-center sm:col-span-1">
                    {canBeProxied(newDns.type) && (
                      <label className="flex items-center gap-2 cursor-pointer select-none group">
                        <input type="checkbox" checked={newDns.proxied} onChange={e => setNewDns({...newDns, proxied: e.target.checked})} className="checkbox checkbox-sm checkbox-primary rounded-lg border-2" />
                        <span className="text-[10px] font-black text-slate-600 uppercase group-hover:text-indigo-600">Proxy</span>
                      </label>
                    )}
                 </div>
                 <button onClick={handleAddDnsRecord} disabled={dnsLoading} className="btn btn-md btn-primary h-11 font-black uppercase sm:col-span-1 rounded-xl border-none shadow-lg shadow-indigo-100 text-white hover:bg-indigo-700">Create</button>
              </div>

              {/* Record List */}
              <div className="max-h-80 overflow-auto border border-slate-200 rounded-2xl relative min-h-[180px] shadow-inner bg-white">
                 {dnsLoading ? (
                   <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 gap-3">
                     <span className="loading loading-spinner loading-lg text-indigo-600"></span>
                     <p className="text-[10px] font-black uppercase text-indigo-900 tracking-[0.2em] animate-pulse">Syncing Records...</p>
                   </div>
                 ) : (
                   <table className="table table-xs w-full min-w-[600px] border-collapse">
                      <thead className="bg-slate-100 text-slate-900 sticky top-0 z-10 shadow-sm">
                        <tr className="font-black text-[10px] uppercase tracking-widest border-b border-slate-200 text-left">
                          <th className="px-5 py-4 w-20">Type</th>
                          <th className="px-5 py-4 w-32">Name</th>
                          <th className="px-5 py-4">Content</th>
                          <th className="px-5 py-4 text-center w-20">Proxy</th>
                          <th className="px-5 py-4 text-right w-32">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dnsRecords.map((r: any) => (
                          <tr key={r.id} className={`hover:bg-indigo-50/50 border-b border-slate-100 last:border-0 transition-colors ${editingRecordId === r.id ? 'bg-amber-50/30' : ''}`}>
                            {editingRecordId === r.id ? (
                              <>
                                <td className="px-2 py-2"><select value={editFormData.type} onChange={e => setEditFormData({...editFormData, type: e.target.value, proxied: canBeProxied(e.target.value) ? editFormData.proxied : false})} className="select select-xs select-bordered w-full bg-white font-bold h-9 text-[10px] rounded-lg shadow-sm">{DNS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></td>
                                <td className="px-2 py-2"><input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="input input-xs input-bordered w-full bg-white font-bold h-9 text-[10px] rounded-lg shadow-sm" /></td>
                                <td className="px-2 py-2"><input type="text" value={editFormData.content} onChange={e => setEditFormData({...editFormData, content: e.target.value})} className="input input-xs input-bordered w-full bg-white font-bold h-9 text-[10px] rounded-lg shadow-sm" /></td>
                                <td className="px-2 py-2 text-center">{canBeProxied(editFormData.type) ? <button onClick={() => setEditFormData({...editFormData, proxied: !editFormData.proxied})} className={`size-6 mx-auto rounded-full border-2 border-white shadow-sm transition-all flex items-center justify-center ${editFormData.proxied ? 'bg-orange-400' : 'bg-slate-200'}`}><div className={`size-1.5 rounded-full bg-white transition-transform ${editFormData.proxied ? 'scale-110' : 'scale-75 opacity-40'}`} /></button> : <span className="text-[8px] font-black text-slate-300 uppercase">N/A</span>}</td>
                                <td className="px-2 py-2 text-right"><div className="flex items-center justify-end gap-1.5 pt-1"><button onClick={handleSaveEdit} className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm text-white px-2 border-none"><Check className="size-3.5" /></button><button onClick={handleCancelEdit} className="btn btn-xs btn-ghost bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 px-2"><X className="size-3.5" /></button></div></td>
                              </>
                            ) : (
                              <>
                                <td className="px-5 py-4 font-black text-indigo-700 text-[11px]">{r.type}</td>
                                <td className="px-5 py-4 font-bold text-slate-900 text-[11px] truncate max-w-[120px]">{r.name}</td>
                                <td className="px-5 py-4 text-[10px] font-mono text-slate-600 break-all">{r.content}</td>
                                <td className="px-5 py-4 text-center">{r.proxied ? <div className="size-3 mx-auto rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.4)] border-2 border-white" /> : <div className="size-3 mx-auto rounded-full bg-slate-200 border-2 border-white" />}</td>
                                <td className="px-5 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => handleStartEdit(r)} className="btn btn-ghost btn-xs text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"><Edit3 className="size-4" /></button><button onClick={() => setRecordToDelete(r)} className="btn btn-ghost btn-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"><Trash2 className="size-4" /></button></div></td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                   </table>
                 )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-900 rounded-2xl p-7 shadow-2xl space-y-6 flex flex-col min-h-[220px] relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/5 blur-3xl rounded-full" />
                  <div className="flex items-center gap-3 relative z-10"><div className="size-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-inner"><Award className="size-5" /></div><h3 className="font-black text-white text-sm tracking-widest uppercase">CA Deployment</h3></div>
                  {certLoading ? <div className="flex-1 flex flex-col items-center justify-center gap-3"><span className="loading loading-spinner loading-lg text-indigo-500"></span></div> : <>
                      <div className="form-control flex-1"><label className="label py-1.5"><span className="label-text text-slate-400 text-[10px] font-black uppercase tracking-widest">Authority</span></label><select value={caProvider} onChange={(e) => setCaProvider(e.target.value)} className="select select-sm bg-slate-800 text-white border-slate-700 w-full rounded-xl font-bold h-11 focus:ring-2 focus:ring-indigo-500/40 outline-none"><option value="google">Google Trust</option><option value="lets_encrypt">Let's Encrypt</option><option value="ssl_com">SSL.com</option><option value="digicert">DigiCert</option></select></div>
                      <button onClick={handleApplyCA} disabled={caLoading} className="btn btn-primary btn-md w-full rounded-xl font-black uppercase text-[10px] h-12 text-white hover:bg-indigo-700">Update CA</button>
                    </>}
               </div>
               <div className="bg-slate-900 rounded-2xl p-7 shadow-2xl space-y-6 flex flex-col min-h-[220px] relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                  <div className="flex items-center gap-3 relative z-10"><div className="size-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-inner"><Shield className="size-5" /></div><h3 className="font-black text-white text-sm tracking-widest uppercase">Encryption Layer</h3></div>
                  {certLoading ? <div className="flex-1 flex flex-col items-center justify-center gap-3"><span className="loading loading-spinner loading-lg text-indigo-500"></span></div> : <>
                      <div className="form-control flex-1"><label className="label py-1.5"><span className="label-text text-slate-400 text-[10px] font-black uppercase tracking-widest">Security Level</span></label><select value={sslMode} onChange={(e) => setSslMode(e.target.value)} className="select select-sm bg-slate-800 text-white border-slate-700 w-full rounded-xl font-bold h-11 focus:ring-2 focus:ring-indigo-500/40 outline-none"><option value="off">Off</option><option value="flexible">Flexible</option><option value="full">Full</option><option value="strict">Full (Strict)</option></select></div>
                      <button onClick={handleApplySSL} disabled={sslLoading} className="btn btn-primary btn-md w-full rounded-xl font-black uppercase text-[10px] h-12 text-white hover:bg-indigo-700">Enforce Encryption</button>
                    </>}
               </div>
            </div>
          </>
        ) : (
          <div className="h-full min-h-[400px] bg-white border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center p-16 text-center opacity-50 shadow-inner"><CloudCog className="size-10 text-slate-300 mb-4 animate-pulse" /><h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Initialize Zone Context</h3></div>
        )}
      </div>
    </div>
  </div>
);

/**
 * View 3: Network Lab (IPv6 Utilities)
 */
const NetworkLabView = ({ ipv6Input, setIpv6Input, handleAnalyzeUtils, handleRandomizeUtils, labResults, copyText }: any) => (
  <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/40 p-8 space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6"><div className="size-12 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-inner"><Network className="size-6" /></div><div><h3 className="text-lg font-black text-slate-900 uppercase">Network Lab</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intelligence Engine</p></div></div>
            <div className="space-y-6">
                <div className="form-control"><label className="label px-1 pt-0"><span className="label-text text-[11px] font-black uppercase text-slate-600">IPv6 Address / Block</span></label><input type="text" value={ipv6Input} onChange={(e) => setIpv6Input(e.target.value)} className="input input-lg bg-slate-50 border-slate-200 w-full rounded-2xl text-base font-mono font-bold h-14 focus:ring-4 focus:ring-blue-100 transition-all text-center" placeholder="2001:db8::/32" /></div>
                <div className="grid grid-cols-2 gap-4 pt-2"><button onClick={handleAnalyzeUtils} className="btn bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 border-none shadow-lg">Analyze</button><button onClick={handleRandomizeUtils} className="btn bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 border-none shadow-lg">Randomize</button></div>
            </div>
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4"><Info className="size-5 text-blue-500 shrink-0 mt-0.5" /><p className="text-[11px] text-blue-800/70 font-bold leading-relaxed">Analyze specific nodes or randomize results from a block to generate PTR records.</p></div>
        </div>

        <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden min-h-[300px] flex flex-col">
                <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between"><div className="flex items-center gap-3"><Binary className="size-4 text-slate-400" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Lab Output Registry</span></div><span className="text-[9px] font-black bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">{labResults.length} Results</span></div>
                <div className="flex-1 p-6 custom-scrollbar-light overflow-y-auto max-h-[500px]">
                    {labResults.length > 0 ? <div className="space-y-4">{labResults.map((res: any, idx: number) => (
                        <div key={idx} className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg"><div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between"><span className="text-[9px] font-black text-slate-500 uppercase">Entry #{idx + 1}</span><div className="flex gap-2"><button onClick={() => copyText(res.ip)} className="flex items-center gap-1.5 text-[8px] font-black text-indigo-400 hover:text-indigo-300 uppercase"><Hash className="size-2.5" /> IP</button><button onClick={() => copyText(res.arpa)} className="flex items-center gap-1.5 text-[8px] font-black text-emerald-400 hover:text-emerald-300 uppercase"><Globe className="size-2.5" /> ARPA</button></div></div><div className="p-4 space-y-3"><div><p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Generated Node</p><p className="text-white font-mono text-[13px] font-bold select-all truncate">{res.ip}</p></div><div><p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Reverse Mapping</p><p className="text-indigo-300 font-mono text-[11px] select-all break-all">{res.arpa}</p></div></div></div>
                    ))}</div> : <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 grayscale"><Activity className="size-16 mb-4" /><p className="text-[12px] font-black uppercase tracking-[0.3em]">System Idle</p></div>}
                </div>
            </div>
        </div>
    </div>
  </div>
);

// --- MAIN APPLICATION ---
export default function App() {
  const [activeTab, setActiveTab] = useState<'auth' | 'edge' | 'utils'>('auth');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const [authEmail, setAuthEmail] = useState('');
  const [globalKey, setGlobalKey] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [ipv6Input, setIpv6Input] = useState('2001:db8::/32');
  const [labResults, setLabResults] = useState<{ip: string, arpa: string}[]>([]);
  
  const [invLoading, setInvLoading] = useState(false);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [certLoading, setCertLoading] = useState(false);
  const [addDomainLoading, setAddDomainLoading] = useState(false);
  const [dnsLoading, setDnsLoading] = useState(false);
  const [caLoading, setCaLoading] = useState(false);
  const [sslLoading, setSslLoading] = useState(false);
  
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [logs, setLogs] = useState<{ msg: string, type: string, time: string }[]>([]);
  
  const [accounts, setAccounts] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [dnsRecords, setDnsRecords] = useState<any[]>([]);
  
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedAccountName, setSelectedAccountName] = useState<string | null>(null);
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);
  const [caProvider, setCaProvider] = useState<string>('google');
  const [sslMode, setSslMode] = useState<string>('strict');
  const [newDomainName, setNewDomainName] = useState('');
  const [newDns, setNewDns] = useState({ type: 'A', name: '', content: '', ttl: 1, proxied: false });

  const [recordToDelete, setRecordToDelete] = useState<any | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConsoleOpen) { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }
  }, [logs, isConsoleOpen]);

  const addLog = (msg: string, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    if (type === 'error' || type === 'success') setIsConsoleOpen(true);
  };

  const copyText = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    addLog(`Copied text to clipboard`, 'info');
  };

  const fetchCF = async (endpoint: string, method = 'GET', body?: any) => {
    const response = await fetch('/api/cloudflare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, email: authEmail, key: globalKey, method, body })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.errors?.[0]?.message || 'API Request Failed');
    return data.result;
  };

  const handleFetchAccounts = async () => {
    if (!authEmail || !globalKey) { setStatus({ type: 'error', message: 'Credentials required.' }); return; }
    setInvLoading(true);
    addLog('Syncing accounts...', 'info');
    try {
      const data = await fetchCF('accounts');
      setAccounts(data);
      addLog(`Sync Success: ${data.length} accounts found.`, 'success');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } finally { setInvLoading(false); }
  };

  const handleSelectAccount = async (accId: string, accName: string) => {
    setSelectedAccountId(accId);
    setSelectedAccountName(accName);
    setZones([]);
    setZoneLoading(true);
    addLog(`Loading zones for ${accName}...`, 'info');
    try {
      const data = await fetchCF(`zones?account.id=${accId}`);
      setZones(data);
      addLog(`Found ${data.length} zones.`, 'success');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } finally { setZoneLoading(false); }
  };

  const handleAddDomain = async () => {
    if (!selectedAccountId || !newDomainName) return;
    setAddDomainLoading(true);
    addLog(`Adding ${newDomainName}...`, 'info');
    try {
      await fetchCF('zones', 'POST', { name: newDomainName, account: { id: selectedAccountId } });
      addLog(`Success: ${newDomainName} registered.`, 'success');
      setNewDomainName('');
      handleSelectAccount(selectedAccountId, selectedAccountName || '');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } finally { setAddDomainLoading(false); }
  };

  const handleSelectZone = async (id: string, name: string) => {
    setZoneId(id);
    setSelectedZoneName(name);
    setCerts([]);
    setDnsRecords([]);
    setEditingRecordId(null);
    setCertLoading(true);
    setDnsLoading(true);
    addLog(`Context: ${name}...`, 'info');
    try {
      try {
        const universalSettings = await fetchCF(`zones/${id}/ssl/universal/settings`);
        if (universalSettings?.certificate_authority) setCaProvider(universalSettings.certificate_authority);
        const sslSettings = await fetchCF(`zones/${id}/settings/ssl`);
        if (sslSettings?.value) setSslMode(sslSettings.value);
      } catch (e: any) {}
      try {
        const records = await fetchCF(`zones/${id}/dns_records`);
        setDnsRecords(records || []);
      } catch (e: any) {}
      try {
        const certPacks = await fetchCF(`zones/${id}/ssl/certificate_packs`);
        setCerts(certPacks || []);
      } catch (e: any) {}
      addLog(`Sync complete.`, 'success');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } finally { setCertLoading(false); setDnsLoading(false); }
  };

  const handleAddDnsRecord = async () => {
    if (!zoneId || !newDns.name || !newDns.content) return;
    setDnsLoading(true);
    addLog(`Creating ${newDns.type} record...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/dns_records`, 'POST', newDns);
      addLog(`Created: ${newDns.name}`, 'success');
      setNewDns({ type: 'A', name: '', content: '', ttl: 1, proxied: false });
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } finally { setDnsLoading(false); }
  };

  const handleDeleteDnsRecord = async () => {
    if (!zoneId || !recordToDelete) return;
    const { id, name } = recordToDelete;
    setDnsLoading(true);
    addLog(`Deleting ${name}...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/dns_records/${id}`, 'DELETE');
      addLog(`Deleted confirmed for ${name}.`, 'success');
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } finally { setDnsLoading(false); setRecordToDelete(null); }
  };

  const handleStartEdit = (record: any) => { setEditingRecordId(record.id); setEditFormData({ ...record }); };
  const handleCancelEdit = () => { setEditingRecordId(null); setEditFormData(null); };

  const handleSaveEdit = async () => {
    if (!zoneId || !editingRecordId || !editFormData) return;
    setDnsLoading(true);
    addLog(`Updating record: ${editFormData.name}...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/dns_records/${editingRecordId}`, 'PATCH', {
        type: editFormData.type, name: editFormData.name, content: editFormData.content, proxied: editFormData.proxied
      });
      addLog(`Successfully updated ${editFormData.name}`, 'success');
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
      setEditingRecordId(null);
      setEditFormData(null);
    } catch (err: any) { addLog(`Update Error: ${err.message}`, 'error'); } finally { setDnsLoading(false); }
  };

  const handleApplyCA = async () => {
    if (!zoneId) return;
    setCaLoading(true);
    addLog(`Updating CA...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/ssl/universal/settings`, 'PATCH', { certificate_authority: caProvider });
      addLog(`CA Updated.`, 'success');
      setStatus({ type: 'success', message: `CA updated.` });
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } finally { setCaLoading(false); }
  };

  const handleApplySSL = async () => {
    if (!zoneId) return;
    setSslLoading(true);
    addLog(`Updating Encryption...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/settings/ssl`, 'PATCH', { value: sslMode });
      addLog(`SSL Updated.`, 'success');
      setStatus({ type: 'success', message: `SSL level updated.` });
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } finally { setSslLoading(false); }
  };

  const handleAnalyzeUtils = () => {
    const arpa = ipv6ToArpa(ipv6Input);
    setLabResults([{ ip: ipv6Input, arpa }]);
    addLog(`Lab Analysis: Processed single entry ${ipv6Input}`, 'info');
  };

  const handleRandomizeUtils = () => {
    const results = Array.from({ length: 4 }).map(() => {
        const ip = generateRandomIPv6(ipv6Input);
        const arpa = ipv6ToArpa(ip);
        return { ip, arpa };
    });
    setLabResults(results);
    addLog(`Lab Intelligence: Generated 4 unique random nodes.`, 'success');
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-slate-50 text-slate-900">
      
      {/* Sidebar Layout */}
      <aside className="w-60 bg-slate-900 flex flex-col shrink-0 relative z-20 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-950/40"><ShieldCheck className="size-6 text-white" /></div>
            <div className="min-w-0 text-white font-black tracking-widest text-xs uppercase leading-tight">ip6-arpa</div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <button onClick={() => setActiveTab('auth')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'auth' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><LayoutDashboard className="size-4" /> Connection</button>
          <button onClick={() => setActiveTab('edge')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'edge' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><CloudCog className="size-4" /> Edge Manager</button>
          <button onClick={() => setActiveTab('utils')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'utils' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Network className="size-4" /> Network Lab</button>
        </nav>
        <div className="p-5 mt-auto border-t border-slate-800"><a href="https://github.com/LoveDoLove" target="_blank" className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors"><Github className="size-3.5" /> Repository</a></div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{activeTab === 'auth' ? 'Connectivity' : activeTab === 'edge' ? 'Infrastructure' : 'Analysis Lab'}</h2>
          <button onClick={() => setIsConsoleOpen(!isConsoleOpen)} className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-[10px] font-black uppercase transition-all shadow-sm ${isConsoleOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'}`}><Terminal className="size-3.5" /> Process Monitor</button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar-light">
          <div className="max-w-6xl mx-auto transition-all duration-500">
            {activeTab === 'auth' && (
              <ConnectivityView 
                authEmail={authEmail} setAuthEmail={setAuthEmail} globalKey={globalKey} setGlobalKey={setGlobalKey} 
                handleFetchAccounts={handleFetchAccounts} invLoading={invLoading} accounts={accounts} 
                selectedAccountId={selectedAccountId} handleSelectAccount={handleSelectAccount} 
              />
            )}
            {activeTab === 'edge' && (
              <EdgeManagerView 
                selectedAccountId={selectedAccountId} zones={zones} zoneId={zoneId} selectedZoneName={selectedZoneName} 
                handleSelectZone={handleSelectZone} handleAddDomain={handleAddDomain} newDomainName={newDomainName} 
                setNewDomainName={setNewDomainName} addDomainLoading={addDomainLoading} dnsLoading={dnsLoading} 
                dnsRecords={dnsRecords} newDns={newDns} setNewDns={setNewDns} handleAddDnsRecord={handleAddDnsRecord} 
                handleDeleteDnsRecord={handleDeleteDnsRecord} editingRecordId={editingRecordId} editFormData={editFormData} 
                setEditFormData={setEditFormData} handleStartEdit={handleStartEdit} handleCancelEdit={handleCancelEdit} 
                handleSaveEdit={handleSaveEdit} setRecordToDelete={setRecordToDelete} certLoading={certLoading} 
                caProvider={caProvider} setCaProvider={setCaProvider} handleApplyCA={handleApplyCA} caLoading={caLoading} 
                sslMode={sslMode} setSslMode={setSslMode} handleApplySSL={handleApplySSL} sslLoading={sslLoading} 
              />
            )}
            {activeTab === 'utils' && (
              <NetworkLabView 
                ipv6Input={ipv6Input} setIpv6Input={setIpv6Input} handleAnalyzeUtils={handleAnalyzeUtils} 
                handleRandomizeUtils={handleRandomizeUtils} labResults={labResults} copyText={copyText} 
              />
            )}
          </div>
        </div>

        {/* Modal Overlay */}
        {recordToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-slate-200 animate-in zoom-in-95">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="size-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-inner"><ShieldAlert className="size-8" /></div>
                <div className="space-y-2"><h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Confirm Deletion</h3><p className="text-sm text-slate-500">Permanently remove this record? This action cannot be reversed.</p></div>
                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1.5 text-left"><div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase">Type</span><span className="text-xs font-black text-indigo-600">{recordToDelete.type}</span></div><div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase">Name</span><span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">{recordToDelete.name}</span></div></div>
                <div className="grid grid-cols-2 gap-3 w-full pt-4"><button onClick={() => setRecordToDelete(null)} className="btn btn-ghost rounded-2xl font-black uppercase text-[11px] h-12 border border-slate-200">Cancel</button><button onClick={handleDeleteDnsRecord} className="btn bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase text-[11px] h-12 border-none">Delete</button></div>
              </div>
            </div>
          </div>
        )}

        {/* Console Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-[#0F172A] border-t border-slate-800 transition-all duration-700 ease-in-out z-50 overflow-hidden shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.6)] ${isConsoleOpen ? 'h-[320px]' : 'h-0'}`}>
          <div className="h-full flex flex-col">
            <div className="bg-slate-800/70 px-8 py-3.5 flex items-center justify-between border-b border-slate-700/50"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2.5"><div className="flex gap-1.5"><div className="size-2 rounded-full bg-rose-500/80 shadow-sm" /><div className="size-2 rounded-full bg-amber-500/80 shadow-sm" /><div className="size-2 rounded-full bg-emerald-500/80 shadow-sm" /></div><Terminal className="size-4 ml-2" /> Live Node Logs</span><button onClick={() => setIsConsoleOpen(false)} className="text-slate-500 hover:text-white transition-all hover:rotate-90"><X className="size-5" /></button></div>
            <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 custom-scrollbar bg-slate-950/40 text-slate-300">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-6 group border-b border-white/[0.02] pb-2 hover:bg-white/[0.01] transition-colors"><span className="text-slate-600 shrink-0 tabular-nums font-bold">[{log.time}]</span><span className={`shrink-0 font-black tracking-widest ${log.type === 'success' ? 'text-emerald-500' : log.type === 'error' ? 'text-rose-500' : 'text-indigo-400'}`}>{log.type.toUpperCase()}</span><span className={log.type === 'success' ? 'text-emerald-50' : log.type === 'error' ? 'text-rose-50' : 'text-slate-300'}>{log.msg}</span></div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0F172A; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 12px; }
        .custom-scrollbar-light::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        table th { text-align: left !important; }
        input::placeholder { font-weight: 800; color: #94A3B8; opacity: 0.4; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>
    </div>
  );
}