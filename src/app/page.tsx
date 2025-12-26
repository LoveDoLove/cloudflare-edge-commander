"use client";

import React from 'react';
import { 
  ShieldCheck, LayoutDashboard, CloudCog, Network, Github, Terminal, 
  Lock, Scale, BookOpen 
} from 'lucide-react';

import { useCloudflareManager } from '@/hooks/useCloudflareManager';
import { ConnectivityView } from '@/components/views/ConnectivityView';
import { EdgeManagerView } from '@/components/views/EdgeManagerView';
import { NetworkLabView } from '@/components/views/NetworkLabView';
import { DnsDocsView } from '@/components/views/DnsDocsView'; // Added import
import { PrivacyView, TermsView } from '@/components/views/LegalViews';
import { DeleteConfirmationModal, ConsoleDrawer } from '@/components/Overlays';

const utils = {
  ipv6ToArpa: (ipv6: string) => {
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
    } catch (e) { return "Invalid IPv6 Format"; }
  },
  generateRandomIPv6: (currentInput: string) => {
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
      } else { address = address.split(':').map(p => p.padStart(4, '0')).join(':'); }
      const fullHex = address.replace(/:/g, '');
      const fixedNibbles = Math.floor(prefixLength / 4);
      const resultHex = fullHex.substring(0, fixedNibbles) + genPart(32 - fixedNibbles);
      const blocks = [];
      for (let i = 0; i < 32; i += 4) blocks.push(resultHex.substring(i, i + 4));
      return blocks.join(':');
    } catch (e) { return Array.from({length: 8}, () => genPart(4)).join(':'); }
  }
};

export default function App() {
  const state = useCloudflareManager();
  const { t } = state;

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-slate-50 text-slate-900">
      
      <aside className="w-60 bg-slate-900 flex flex-col shrink-0 relative z-20 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-950/40">
              <ShieldCheck className="size-6 text-white" />
            </div>
            <div className="min-w-0 text-white font-black tracking-widest text-xs uppercase leading-tight">ip6-arpa</div>
          </div>
        </div>

        <div className="px-4 py-2">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-2">{t.core_services}</p>
           <nav className="space-y-1">
            {[
              { id: 'auth', label: t.nav_conn, icon: LayoutDashboard },
              { id: 'edge', label: t.nav_edge, icon: CloudCog },
              { id: 'utils', label: t.nav_lab, icon: Network },
              { id: 'docs', label: t.nav_docs, icon: BookOpen } // Added Documentation
            ].map(tab => (
              <button 
                key={tab.id} onClick={() => state.setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white active:text-white'}`}
              >
                <tab.icon className="size-4" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4 py-6 mt-4">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-2">{t.legal_compliance}</p>
           <nav className="space-y-1">
            {[
              { id: 'privacy', label: t.nav_privacy, icon: Lock },
              { id: 'terms', label: t.nav_terms, icon: Scale }
            ].map(tab => (
              <button 
                key={tab.id} onClick={() => state.setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.activeTab === tab.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon className="size-4" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 mt-auto space-y-4 border-t border-slate-800">
          <div className="flex bg-slate-800 rounded-xl p-1">
            <button onClick={() => state.setLang('en')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${state.lang === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>EN</button>
            <button onClick={() => state.setLang('zh')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${state.lang === 'zh' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>中文</button>
          </div>
          <a href="https://github.com/LoveDoLove" target="_blank" className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors">
            <Github className="size-3.5" /> {t.repo}
          </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
            {state.activeTab === 'auth' && t.auth_title}
            {state.activeTab === 'edge' && t.infra_title}
            {state.activeTab === 'utils' && t.lab_title}
            {state.activeTab === 'docs' && t.docs_title}
            {state.activeTab === 'privacy' && t.privacy_title}
            {state.activeTab === 'terms' && t.terms_title}
          </h2>
          <button 
            onClick={() => state.setIsConsoleOpen(!state.isConsoleOpen)}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-[10px] font-black uppercase transition-all shadow-sm ${state.isConsoleOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900 active:bg-slate-50'}`}
          >
            <Terminal className="size-3.5" /> {state.isConsoleOpen ? t.monitor_close : t.monitor_open}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar-light">
          <div className="max-w-6xl mx-auto transition-all duration-500">
            {state.activeTab === 'auth' && <ConnectivityView state={state} />}
            {state.activeTab === 'edge' && <EdgeManagerView state={state} />}
            {state.activeTab === 'utils' && <NetworkLabView state={state} utils={utils} />}
            {state.activeTab === 'docs' && <DnsDocsView lang={state.lang} />}
            {state.activeTab === 'privacy' && <PrivacyView lang={state.lang} />}
            {state.activeTab === 'terms' && <TermsView lang={state.lang} />}
          </div>
        </div>

        {state.recordToDelete && <DeleteConfirmationModal state={state} record={state.recordToDelete} onCancel={() => state.setRecordToDelete(null)} onConfirm={state.handleDeleteDnsRecord} />}
        <ConsoleDrawer state={state} isOpen={state.isConsoleOpen} onClose={() => state.setIsConsoleOpen(false)} logs={state.logs} logEndRef={state.logEndRef} />
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0F172A; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 12px; }
        .custom-scrollbar-light::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        input::placeholder { font-weight: 800; color: #94A3B8; opacity: 0.4; text-transform: uppercase; letter-spacing: 0.05em; }
        aside nav button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
}