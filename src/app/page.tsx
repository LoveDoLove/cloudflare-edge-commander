"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Key, 
  Terminal, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Cpu, 
  Lock, 
  Mail, 
  Activity, 
  Dices, 
  RefreshCcw, 
  Heart, 
  FileText,
  Github,
  Search,
  Database,
  ShieldAlert,
  List,
  ChevronRight,
  Settings2,
  Award,
  PlusCircle,
  Trash2,
  Save,
  LayoutDashboard,
  Network,
  CloudCog,
  ChevronDown,
  ChevronUp,
  X,
  Shield
} from 'lucide-react';

/**
 * UTILITY FUNCTIONS
 */
const ipv6ToArpa = (ipv6: string) => {
  try {
    let [address] = ipv6.split('/');
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
    if (fullHex.length !== 32) return "Incomplete Address";
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

export default function Home() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'auth' | 'edge' | 'utils'>('auth');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // App Logic State
  const [authEmail, setAuthEmail] = useState('');
  const [globalKey, setGlobalKey] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [ipv6Input, setIpv6Input] = useState('2001:db8::/32');
  
  const [invLoading, setInvLoading] = useState(false);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [certLoading, setCertLoading] = useState(false);
  const [addDomainLoading, setAddDomainLoading] = useState(false);
  const [dnsLoading, setDnsLoading] = useState(false);
  
  // Action Loading States
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

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConsoleOpen) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isConsoleOpen]);

  const addLog = (msg: string, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    if (type === 'error' || type === 'success') setIsConsoleOpen(true);
  };

  const fetchCF = async (endpoint: string, method = 'GET', body?: any) => {
    const response = await fetch('/api/cloudflare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint,
        email: authEmail,
        key: globalKey,
        method,
        body
      })
    });
    
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.errors?.[0]?.message || 'API Request Failed');
    }
    return data.result;
  };

  const handleFetchAccounts = async () => {
    if (!authEmail || !globalKey) {
      setStatus({ type: 'error', message: 'Credentials required.' });
      return;
    }
    setInvLoading(true);
    addLog('Fetching Cloudflare accounts...', 'info');
    try {
      const data = await fetchCF('accounts');
      setAccounts(data);
      addLog(`Success: Found ${data.length} accounts.`, 'success');
    } catch (err: any) {
      addLog(`Account Error: ${err.message}`, 'error');
    } finally {
      setInvLoading(false);
    }
  };

  const handleSelectAccount = async (accId: string, accName: string) => {
    setSelectedAccountId(accId);
    setSelectedAccountName(accName);
    setZones([]);
    setZoneLoading(true);
    addLog(`Fetching zones for: ${accName}...`, 'info');
    try {
      const data = await fetchCF(`zones?account.id=${accId}`);
      setZones(data);
      addLog(`Success: Found ${data.length} zones.`, 'success');
    } catch (err: any) {
      addLog(`Zone Error: ${err.message}`, 'error');
    } finally {
      setZoneLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!selectedAccountId || !newDomainName) return;
    setAddDomainLoading(true);
    addLog(`Attempting to add new domain: ${newDomainName}...`, 'info');
    try {
      await fetchCF('zones', 'POST', {
        name: newDomainName,
        account: { id: selectedAccountId }
      });
      addLog(`Success: Domain ${newDomainName} added to account.`, 'success');
      setNewDomainName('');
      handleSelectAccount(selectedAccountId, selectedAccountName || '');
    } catch (err: any) {
      addLog(`Add Domain Error: ${err.message}`, 'error');
      setStatus({ type: 'error', message: `Failed to add domain: ${err.message}` });
    } finally {
      setAddDomainLoading(false);
    }
  };

  const handleSelectZone = async (id: string, name: string) => {
    setZoneId(id);
    setSelectedZoneName(name);
    setCerts([]);
    setDnsRecords([]);
    setCertLoading(true);
    setDnsLoading(true);
    addLog(`Domain selected: ${name}. Syncing...`, 'info');
    
    try {
      try {
        const universalSettings = await fetchCF(`zones/${id}/ssl/universal/settings`);
        if (universalSettings?.certificate_authority) setCaProvider(universalSettings.certificate_authority);
        const sslSettings = await fetchCF(`zones/${id}/settings/ssl`);
        if (sslSettings?.value) setSslMode(sslSettings.value);
      } catch (e: any) { addLog(`Settings sync issue: ${e.message}`, 'error'); }

      try {
        const records = await fetchCF(`zones/${id}/dns_records`);
        setDnsRecords(records || []);
      } catch (e: any) { addLog(`DNS sync issue: ${e.message}`, 'error'); }

      try {
        const certPacks = await fetchCF(`zones/${id}/ssl/certificate_packs`);
        setCerts(certPacks || []);
      } catch (e: any) { addLog(`Cert sync issue: ${e.message}`, 'error'); }
      
      addLog(`Domain ${name} successfully synced.`, 'success');
    } catch (err: any) {
      addLog(`General Zone Error: ${err.message}`, 'error');
    } finally {
      setCertLoading(false);
      setDnsLoading(false);
    }
  };

  const handleAddDnsRecord = async () => {
    if (!zoneId || !newDns.name || !newDns.content) return;
    setDnsLoading(true);
    addLog(`Adding ${newDns.type} record: ${newDns.name}...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/dns_records`, 'POST', newDns);
      addLog(`Success: DNS record created.`, 'success');
      setNewDns({ type: 'A', name: '', content: '', ttl: 1, proxied: false });
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
    } catch (err: any) {
      addLog(`DNS Add Error: ${err.message}`, 'error');
    } finally {
      setDnsLoading(false);
    }
  };

  const handleDeleteDnsRecord = async (recordId: string, recordName: string) => {
    if (!zoneId) return;
    setDnsLoading(true);
    addLog(`Deleting: ${recordName}...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/dns_records/${recordId}`, 'DELETE');
      addLog(`Success: Record removed.`, 'success');
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
    } catch (err: any) {
      addLog(`DNS Delete Error: ${err.message}`, 'error');
    } finally {
      setDnsLoading(false);
    }
  };

  const handleApplyCA = async () => {
    if (!zoneId) return;
    setCaLoading(true);
    addLog(`Updating Certificate Authority to "${caProvider}"...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/ssl/universal/settings`, 'PATCH', { 
        certificate_authority: caProvider 
      });
      addLog(`Success: CA Provider updated to ${caProvider}.`, 'success');
      setStatus({ type: 'success', message: `CA Provider updated successfully.` });
    } catch (err: any) {
      addLog(`CA Update Error: ${err.message}`, 'error');
      setStatus({ type: 'error', message: `CA update failed.` });
    } finally {
      setCaLoading(false);
    }
  };

  const handleApplySSL = async () => {
    if (!zoneId) return;
    setSslLoading(true);
    addLog(`Updating SSL Encryption level to "${sslMode}"...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/settings/ssl`, 'PATCH', { value: sslMode });
      addLog(`Success: SSL Level updated to ${sslMode}.`, 'success');
      setStatus({ type: 'success', message: `SSL level updated successfully.` });
    } catch (err: any) {
      addLog(`SSL Update Error: ${err.message}`, 'error');
      setStatus({ type: 'error', message: `SSL update failed.` });
    } finally {
      setSslLoading(false);
    }
  };

  const handleGenerate = () => {
    const randomIp = generateRandomIPv6(ipv6Input);
    const resultArpa = ipv6ToArpa(randomIp);
    addLog(`Generate Result: ${randomIp}`, 'success');
    addLog(`Arpa: ${resultArpa}`, 'success');
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <ShieldCheck className="size-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs font-black tracking-tighter text-white uppercase leading-tight truncate">ip6-arpa-dnsgen</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v1.2.0-stable</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <button 
            onClick={() => setActiveTab('auth')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'auth' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <LayoutDashboard className="size-4" /> Connectivity
          </button>
          <button 
            onClick={() => setActiveTab('edge')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'edge' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <CloudCog className="size-4" /> Edge Manager
          </button>
          <button 
            onClick={() => setActiveTab('utils')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'utils' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Network className="size-4" /> Network Utility
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="flex flex-col gap-2">
            <a href="https://github.com/LoveDoLove/ip6-arpa-dnsgen-autossl" target="_blank" className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors">
              <Github className="size-3" /> Repository
            </a>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">© LoveDoLove</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
            {activeTab === 'auth' ? 'Connectivity & Access' : activeTab === 'edge' ? 'Cloudflare Edge Ops' : 'IPv6 Utilities'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-600 uppercase">System Ready</span>
            </div>
            <button 
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase transition-all ${isConsoleOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
            >
              <Terminal className="size-3" /> {isConsoleOpen ? 'Hide Terminal' : 'Show Terminal'}
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* View 1: Auth & Accounts */}
            {activeTab === 'auth' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                    <div className="size-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Key className="size-5" /></div>
                    <div>
                      <h3 className="font-bold text-slate-800">API Credentials</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Primary Auth Session</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label pt-0"><span className="label-text text-[10px] font-black uppercase text-slate-500">Email Address</span></label>
                      <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="input input-bordered bg-slate-50 border-slate-200 w-full rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-50" placeholder="user@example.com" />
                    </div>
                    <div className="form-control">
                      <label className="label pt-0"><span className="label-text text-[10px] font-black uppercase text-slate-500">Global API Key</span></label>
                      <input type="password" value={globalKey} onChange={(e) => setGlobalKey(e.target.value)} className="input input-bordered bg-slate-50 border-slate-200 w-full rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-50" placeholder="••••••••••••••••" />
                    </div>
                    <button onClick={handleFetchAccounts} disabled={invLoading} className="btn btn-primary w-full rounded-xl gap-2 font-black uppercase text-xs">
                      {invLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />} Discover Accounts
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                    <div className="size-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><List className="size-5" /></div>
                    <div>
                      <h3 className="font-bold text-slate-800">Available Accounts</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select target context</p>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50 border border-slate-100 rounded-2xl">
                    {accounts.length === 0 ? (
                      <div className="p-12 text-center text-[10px] text-slate-400 italic">Enter credentials to list accounts</div>
                    ) : (
                      accounts.map(acc => (
                        <button key={acc.id} onClick={() => handleSelectAccount(acc.id, acc.name)} className={`w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-all ${selectedAccountId === acc.id ? 'bg-indigo-50/50 ring-1 ring-inset ring-indigo-100' : ''}`}>
                          <div><p className="text-xs font-bold text-slate-800">{acc.name}</p><p className="text-[9px] text-slate-400 font-mono truncate max-w-[150px]">{acc.id}</p></div>
                          {selectedAccountId === acc.id && <CheckCircle2 className="size-4 text-indigo-500" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Edge Manager (Zones & Records) */}
            {activeTab === 'edge' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Zone Selection Column */}
                  <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col">
                    <div className="p-6 border-b border-slate-50">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Domains ({zones.length})</h3>
                    </div>
                    <div className="flex-1 p-3 flex flex-col gap-2">
                       {selectedAccountId && (
                          <div className="flex gap-2 mb-2 p-1">
                            <input type="text" placeholder="Add domain..." value={newDomainName} onChange={(e) => setNewDomainName(e.target.value)} className="input input-xs bg-slate-50 border-slate-200 flex-1 rounded-lg text-[10px] font-bold" />
                            <button onClick={handleAddDomain} disabled={addDomainLoading} className="btn btn-xs btn-primary rounded-lg">{addDomainLoading ? <Loader2 className="size-3 animate-spin" /> : <PlusCircle className="size-3" />}</button>
                          </div>
                       )}
                       <div className="max-h-[400px] overflow-y-auto space-y-1">
                          {!selectedAccountId ? <div className="p-8 text-center text-[10px] text-slate-400 italic">Select account in connectivity tab</div> : zones.map(z => (
                            <button key={z.id} onClick={() => handleSelectZone(z.id, z.name)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-all ${zoneId === z.id ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'}`}>
                                <span className="text-[11px] font-bold truncate max-w-[120px]">{z.name}</span>
                                <ChevronRight className={`size-3 transition-transform ${zoneId === z.id ? 'translate-x-0' : 'translate-x-[-4px] opacity-0 group-hover:opacity-100'}`} />
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>

                  {/* Right Features Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {zoneId ? (
                      <>
                        {/* 1. DNS Management Section */}
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-4">
                          <div className="flex items-center justify-between">
                             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2"><Globe className="size-3" /> DNS Records</h3>
                             {dnsLoading && <Loader2 className="size-3 animate-spin text-indigo-500" />}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                             <select value={newDns.type} onChange={e => setNewDns({...newDns, type: e.target.value})} className="select select-xs select-bordered bg-white font-bold h-8 min-h-0 text-[10px]"><option>A</option><option>AAAA</option><option>CNAME</option><option>TXT</option><option>MX</option></select>
                             <input type="text" placeholder="Name" value={newDns.name} onChange={e => setNewDns({...newDns, name: e.target.value})} className="input input-xs bg-white border-slate-200 h-8 min-h-0 text-[10px] font-bold" />
                             <input type="text" placeholder="Content" value={newDns.content} onChange={e => setNewDns({...newDns, content: e.target.value})} className="input input-xs bg-white border-slate-200 h-8 min-h-0 text-[10px] font-bold sm:col-span-2" />
                             <button onClick={handleAddDnsRecord} disabled={dnsLoading} className="btn btn-xs btn-primary h-8 min-h-0 font-black uppercase">Add</button>
                          </div>
                          <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-2xl relative min-h-[120px]">
                             {dnsLoading ? (
                               <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 gap-2"><span className="loading loading-spinner loading-md text-indigo-600"></span><p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] animate-pulse">Syncing DNS...</p></div>
                             ) : dnsRecords.length === 0 ? ( <div className="p-12 text-center text-[10px] text-slate-400 italic">No records found</div> ) : (
                               <table className="table table-xs w-full">
                                  <thead><tr><th>TYPE</th><th>NAME</th><th>CONTENT</th><th className="text-right">DEL</th></tr></thead>
                                  <tbody>
                                    {dnsRecords.map(r => (
                                      <tr key={r.id} className="hover:bg-slate-50"><td className="font-black text-indigo-600">{r.type}</td><td className="font-bold text-slate-700">{r.name}</td><td className="text-[9px] font-mono opacity-50 truncate max-w-[120px]">{r.content}</td><td className="text-right"><button onClick={() => handleDeleteDnsRecord(r.id, r.name)} className="text-rose-500 hover:scale-110 transition-transform"><Trash2 className="size-3" /></button></td></tr>
                                    ))}
                                  </tbody>
                               </table>
                             )}
                          </div>
                        </div>

                        {/* 2. Separate Provisioning Blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* CA Provider Management */}
                           <div className="bg-slate-900 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden flex flex-col min-h-[220px]">
                              <div className="flex items-center gap-3 relative z-10">
                                <div className="size-9 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20"><Award className="size-4" /></div>
                                <h3 className="font-bold text-white text-sm">CA Provider</h3>
                              </div>
                              {certLoading ? (
                                 <div className="flex-1 flex flex-col items-center justify-center gap-2"><span className="loading loading-spinner loading-md text-indigo-500"></span><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Fetching CA...</p></div>
                              ) : (
                                <>
                                  <div className="form-control flex-1">
                                    <label className="label pt-0"><span className="label-text text-slate-500 text-[9px] font-black uppercase tracking-widest">Authority</span></label>
                                    <select value={caProvider} onChange={(e) => setCaProvider(e.target.value)} className="select select-sm bg-slate-800 text-white border-slate-700 w-full focus:outline-none rounded-xl font-bold">
                                      <option value="google">Google Trust Services</option><option value="lets_encrypt">Let's Encrypt</option><option value="ssl_com">SSL.com</option><option value="digicert">DigiCert</option>
                                    </select>
                                  </div>
                                  <button onClick={handleApplyCA} disabled={caLoading} className="btn btn-primary btn-sm w-full rounded-xl font-black uppercase text-[10px] gap-2">
                                    {caLoading ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />} Update CA
                                  </button>
                                </>
                              )}
                           </div>

                           {/* SSL Encryption Management */}
                           <div className="bg-slate-900 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden flex flex-col min-h-[220px]">
                              <div className="flex items-center gap-3 relative z-10">
                                <div className="size-9 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20"><Shield className="size-4" /></div>
                                <h3 className="font-bold text-white text-sm">SSL Encryption</h3>
                              </div>
                              {certLoading ? (
                                 <div className="flex-1 flex flex-col items-center justify-center gap-2"><span className="loading loading-spinner loading-md text-indigo-500"></span><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing SSL...</p></div>
                              ) : (
                                <>
                                  <div className="form-control flex-1">
                                    <label className="label pt-0"><span className="label-text text-slate-500 text-[9px] font-black uppercase tracking-widest">Security Level</span></label>
                                    <select value={sslMode} onChange={(e) => setSslMode(e.target.value)} className="select select-sm bg-slate-800 text-white border-slate-700 w-full focus:outline-none rounded-xl font-bold">
                                      <option value="off">Off</option><option value="flexible">Flexible</option><option value="full">Full</option><option value="strict">Full (Strict)</option>
                                    </select>
                                  </div>
                                  <button onClick={handleApplySSL} disabled={sslLoading} className="btn btn-primary btn-sm w-full rounded-xl font-black uppercase text-[10px] gap-2">
                                    {sslLoading ? <Loader2 className="size-3 animate-spin" /> : <Zap className="size-3" />} Apply Level
                                  </button>
                                </>
                              )}
                           </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full bg-white border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4"><div className="size-16 bg-slate-50 rounded-full flex items-center justify-center animate-pulse"><CloudCog className="size-8 text-slate-300" /></div><div><h3 className="font-bold text-slate-400">No Domain Selected</h3><p className="text-xs text-slate-400 text-center">Choose a domain from the sidebar.</p></div></div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Network Utility */}
            {activeTab === 'utils' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 space-y-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                  <div className="space-y-2 relative z-10"><div className="size-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm"><Network className="size-8" /></div><h3 className="text-2xl font-black tracking-tight text-slate-800">IPv6 DNS Tooling</h3><p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed text-center">Generate reverse mapping (ip6.arpa) records for IPv6 nodes.</p></div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6 relative z-10"><div className="form-control max-w-md mx-auto text-left"><label className="label pt-0"><span className="label-text text-[10px] font-black uppercase text-slate-500 tracking-wider">Prefix / IP</span></label><input type="text" value={ipv6Input} onChange={(e) => setIpv6Input(e.target.value)} className="input input-lg bg-white border-slate-200 rounded-2xl text-base font-mono shadow-sm focus:ring-4 focus:ring-blue-50" /></div><button onClick={handleGenerate} className="btn btn-primary btn-lg rounded-2xl gap-3 font-black uppercase shadow-xl shadow-indigo-900/20"><RefreshCcw className="size-5" /> Compute Reverse</button></div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Floating Console Drawer */}
        <div className={`absolute bottom-0 left-0 right-0 bg-[#0F172A] border-t border-slate-800 transition-all duration-500 ease-in-out z-50 overflow-hidden shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] ${isConsoleOpen ? 'h-[300px]' : 'h-0'}`}>
          <div className="h-full flex flex-col"><div className="bg-slate-800/50 px-8 py-3 flex items-center justify-between border-b border-slate-700/50"><div className="flex items-center gap-3"><div className="flex gap-1.5"><div className="size-2.5 rounded-full bg-slate-600"></div><div className="size-2.5 rounded-full bg-slate-600"></div><div className="size-2.5 rounded-full bg-slate-600"></div></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Terminal className="size-3.5" /> Output Monitor</span></div><button onClick={() => setIsConsoleOpen(false)} className="text-slate-500 hover:text-white"><X className="size-4" /></button></div><div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 custom-scrollbar">{logs.map((log, i) => (<div key={i} className="flex gap-6 group border-b border-white/[0.03] pb-1.5"><span className="text-slate-600 shrink-0 tabular-nums">[{log.time}]</span><span className={`shrink-0 font-black ${log.type === 'success' ? 'text-emerald-500' : log.type === 'error' ? 'text-rose-500' : 'text-indigo-400'}`}>{log.type.toUpperCase()}</span><span className={log.type === 'success' ? 'text-emerald-50' : log.type === 'error' ? 'text-rose-50' : 'text-slate-300'}>{log.msg}</span></div>))}<div ref={logEndRef} /></div></div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.2); }
      `}</style>
    </div>
  );
}