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
  Copy, 
  Mail, 
  Hash, 
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
  Award
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
  const [authEmail, setAuthEmail] = useState('');
  const [globalKey, setGlobalKey] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [ipv6Input, setIpv6Input] = useState('2001:db8::/32');
  
  const [loading, setLoading] = useState(false);
  const [invLoading, setInvLoading] = useState(false);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [certLoading, setCertLoading] = useState(false);
  
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [logs, setLogs] = useState<{ msg: string, type: string, time: string }[]>([]);
  
  const [accounts, setAccounts] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);
  const [caProvider, setCaProvider] = useState<string>('google');
  const [sslMode, setSslMode] = useState<string>('strict');

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
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
      setStatus({ type: 'error', message: 'Email and API Key are required.' });
      return;
    }
    setInvLoading(true);
    setAccounts([]);
    setZones([]);
    setCerts([]);
    setSelectedAccountId(null);
    setZoneId('');
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
    setZones([]);
    setCerts([]);
    setZoneId('');
    setZoneLoading(true);
    addLog(`Fetching zones for account: ${accName}...`, 'info');
    try {
      const data = await fetchCF(`zones?account.id=${accId}`);
      setZones(data);
      addLog(`Success: Found ${data.length} zones in ${accName}.`, 'success');
    } catch (err: any) {
      addLog(`Zone Error: ${err.message}`, 'error');
    } finally {
      setZoneLoading(false);
    }
  };

  const handleSelectZone = async (id: string, name: string) => {
    setZoneId(id);
    setSelectedZoneName(name);
    setCerts([]);
    setCertLoading(true);
    addLog(`Domain selected: ${name}. Auto-fetching edge certificates & settings...`, 'info');
    
    try {
      // 1. Universal SSL Settings
      try {
        const universalSettings = await fetchCF(`zones/${id}/ssl/universal/settings`);
        if (universalSettings?.certificate_authority) {
          setCaProvider(universalSettings.certificate_authority);
          addLog(`Active CA Provider: ${universalSettings.certificate_authority}`, 'info');
        }
      } catch (e: any) {
        addLog(`Could not fetch Universal SSL settings: ${e.message}`, 'error');
      }

      // 2. SSL Level Settings
      try {
        const sslSettings = await fetchCF(`zones/${id}/settings/ssl`);
        if (sslSettings?.value) setSslMode(sslSettings.value);
      } catch (e: any) {
        addLog(`Could not fetch SSL level: ${e.message}`, 'error');
      }

      // 3. Certificate Packs
      try {
        const certPacks = await fetchCF(`zones/${id}/ssl/certificate_packs`);
        setCerts(certPacks || []);
      } catch (e: any) {
        addLog(`Could not fetch certificate packs: ${e.message}`, 'error');
      }
      
      addLog(`Domain sync completed for ${name}.`, 'success');
    } catch (err: any) {
      addLog(`General Zone Data Error: ${err.message}`, 'error');
    } finally {
      setCertLoading(false);
    }
  };

  const handleApplyEdgeSettings = async () => {
    if (!zoneId) return;
    setLoading(true);
    addLog(`Applying settings to ${selectedZoneName}...`, 'info');
    try {
      addLog(`Step 1: Setting Certificate Authority to "${caProvider}"...`, 'info');
      await fetchCF(`zones/${zoneId}/ssl/universal/settings`, 'PATCH', { 
        certificate_authority: caProvider 
      });
      
      addLog(`Step 2: Setting SSL Encryption to "${sslMode}"...`, 'info');
      await fetchCF(`zones/${zoneId}/settings/ssl`, 'PATCH', { value: sslMode });
      
      addLog(`Success: Edge configuration synchronized for ${selectedZoneName}.`, 'success');
      setStatus({ type: 'success', message: `CA Provider set to ${caProvider} and SSL to ${sslMode}. Cloudflare may take a few minutes to re-provision.` });
      
      // Refresh certificates list after a short delay
      setTimeout(() => handleSelectZone(zoneId, selectedZoneName || ''), 2000);
    } catch (err: any) {
      addLog(`Provisioning Error: ${err.message}`, 'error');
      setStatus({ type: 'error', message: `Provisioning failed: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    const randomIp = generateRandomIPv6(ipv6Input);
    const resultArpa = ipv6ToArpa(randomIp);
    addLog(`--- New Generation Triggered ---`, 'info');
    addLog(`Using Prefix: ${ipv6Input}`, 'info');
    addLog(`Generated IP: ${randomIp}`, 'success');
    addLog(`Arpa Record: ${resultArpa}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0 overflow-hidden group">
              <ShieldCheck className="size-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none text-slate-900">ip6-arpa-dnsgen-autossl</h1>
              <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-[0.1em]">
                created by <a href="https://github.com/LoveDoLove" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">LoveDoLove</a>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/LoveDoLove/ip6-arpa-dnsgen-autossl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="size-10 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-md shadow-indigo-100/50 group"
              title="View Repository"
            >
              <Github className="size-5 group-hover:scale-110 transition-transform" />
            </a>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live: API Connection OK</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="h-1.5 bg-indigo-600 w-full opacity-80"></div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <Key className="size-4 text-indigo-500" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">API Authentication</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2 uppercase"><Mail className="size-3" /> Email Account</label>
                    <input type="email" placeholder="user@example.com" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2 uppercase"><Lock className="size-3" /> Global API Key</label>
                    <input type="password" placeholder="Enter API Key" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" value={globalKey} onChange={(e) => setGlobalKey(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2 uppercase"><Hash className="size-3" /> Zone Identifier</label>
                    <input type="text" placeholder="Auto-filled via Explorer" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" value={zoneId} onChange={(e) => setZoneId(e.target.value)} />
                  </div>
                </div>
                
                <button onClick={handleFetchAccounts} disabled={invLoading} className="btn btn-primary w-full rounded-xl shadow-lg shadow-indigo-100">
                  {invLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                  Connect Explorer
                </button>
              </div>
            </div>
          </section>

          <section className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><Globe className="size-5" /></div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">IPv6 Reverse DNS Resolver</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Automatic ip6.arpa mapping</p>
                  </div>
                </div>
                <button onClick={handleGenerate} className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 border-none text-white rounded-xl flex items-center gap-2 px-6 h-10 transition-all">
                  <Dices className="size-4" /> <span className="text-[11px] font-black uppercase tracking-widest">Generate</span>
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Source IPv6 / Prefix</label>
                <input type="text" value={ipv6Input} onChange={(e) => setIpv6Input(e.target.value)} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all" placeholder="e.g. 2001:db8::/32" />
              </div>
            </div>

            {/* Cloudflare Explorer Wizard */}
            {accounts.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0"><Database className="size-5" /></div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">Cloudflare Edge Explorer</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage Domain Certificates & CA Providers</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2"><List className="size-3" /> 1. Select Account</h3>
                        <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                            {accounts.map(acc => (
                                <button key={acc.id} onClick={() => handleSelectAccount(acc.id, acc.name)} className={`w-full text-left p-3 flex items-center justify-between hover:bg-slate-50 transition-colors group ${selectedAccountId === acc.id ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-200' : ''}`}>
                                    <div><p className="text-xs font-bold text-slate-700">{acc.name}</p><p className="text-[9px] opacity-40 font-mono truncate max-w-[150px]">{acc.id}</p></div>
                                    <ChevronRight className={`size-3 transition-transform ${selectedAccountId === acc.id ? 'translate-x-1 text-indigo-500' : 'text-slate-300'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2"><Globe className="size-3" /> 2. Select Domain</h3>
                        <div className={`max-h-56 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 relative min-h-[100px] ${!selectedAccountId ? 'bg-slate-50/50' : ''}`}>
                            {zoneLoading && <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10"><Loader2 className="size-5 animate-spin text-indigo-500" /></div>}
                            {!selectedAccountId ? <div className="p-8 text-center text-[10px] text-slate-400 italic">Select an account first</div> : zones.length === 0 && !zoneLoading ? <div className="p-8 text-center text-[10px] text-slate-400 italic">No zones found</div> : zones.map(z => (
                                <button key={z.id} onClick={() => handleSelectZone(z.id, z.name)} className={`w-full text-left p-3 flex items-center justify-between hover:bg-slate-50 transition-colors group ${zoneId === z.id ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-200' : ''}`}>
                                    <span className="text-xs font-bold text-indigo-600">{z.name}</span>
                                    <ChevronRight className={`size-3 transition-transform ${zoneId === z.id ? 'translate-x-1 text-indigo-500' : 'text-slate-300'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {zoneId && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2"><ShieldAlert className="size-3" /> 3. Current Certificates</h3>
                        <div className={`space-y-2 relative min-h-[100px] ${certLoading ? 'opacity-50' : ''}`}>
                          {certLoading && <Loader2 className="size-4 animate-spin text-indigo-500 absolute top-0 right-0" />}
                          
                          {/* Always show Universal SSL status if we have a CA Provider detected */}
                          {caProvider && (
                            <div className="p-3 bg-indigo-50/50 rounded-xl flex items-center justify-between border border-indigo-100 ring-1 ring-indigo-100">
                                <div>
                                    <p className="text-xs font-bold text-indigo-700">Universal SSL ({caProvider.toUpperCase()})</p>
                                    <p className="text-[9px] text-indigo-500 italic">Managed automatically by Cloudflare</p>
                                </div>
                                <div className="badge badge-xs font-bold badge-success">ACTIVE</div>
                            </div>
                          )}

                          {certs.map((c, i) => (
                              <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                                  <div>
                                      <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{c.hosts?.join(', ') || 'Global'}</p>
                                      <p className="text-[9px] text-slate-500">
                                        Type: {c.type} {c.certificate_authority ? `(${c.certificate_authority})` : ''}
                                      </p>
                                  </div>
                                  <div className={`badge badge-xs font-bold ${c.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{c.status}</div>
                              </div>
                          ))}
                          {certs.length === 0 && !caProvider && !certLoading && <p className="text-[10px] text-slate-400 italic text-center p-4">No edge certificates found.</p>}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2"><Award className="size-3" /> 4. Provisioning Settings</h3>
                        <div className="bg-slate-900 rounded-2xl p-5 shadow-xl space-y-5 border border-slate-800">
                          <div className="form-control">
                            <label className="label pt-0"><span className="label-text text-slate-400 text-[10px] font-bold uppercase tracking-widest">CA Provider</span></label>
                            <select className="select select-sm select-bordered w-full bg-slate-800 text-white border-slate-700 focus:outline-none" value={caProvider} onChange={(e) => setCaProvider(e.target.value)}>
                              <option value="google">Google Trust Services</option>
                              <option value="lets_encrypt">Let's Encrypt</option>
                              <option value="ssl_com">SSL.com</option>
                              <option value="digicert">DigiCert</option>
                            </select>
                          </div>
                          
                          <div className="form-control">
                            <label className="label pt-0"><span className="label-text text-slate-400 text-[10px] font-bold uppercase tracking-widest">SSL Level</span></label>
                            <select className="select select-sm select-bordered w-full bg-slate-800 text-white border-slate-700 focus:outline-none" value={sslMode} onChange={(e) => setSslMode(e.target.value)}>
                              <option value="off">Off</option>
                              <option value="flexible">Flexible</option>
                              <option value="full">Full</option>
                              <option value="strict">Full (Strict)</option>
                            </select>
                          </div>

                          <button onClick={handleApplyEdgeSettings} disabled={loading} className="btn btn-primary btn-sm w-full rounded-xl gap-2 shadow-lg shadow-indigo-900/40">
                            {loading ? <Loader2 className="size-3 animate-spin" /> : <Zap className="size-3" />}
                            Apply Provisioning
                          </button>
                        </div>
                      </div>
                    </div>
                </div>
                )}
              </div>
            </div>
            )}

            {/* Terminal */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5"><div className="size-2 rounded-full bg-slate-600"></div><div className="size-2 rounded-full bg-slate-600"></div><div className="size-2 rounded-full bg-slate-600"></div></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2"><Terminal className="size-3.5" /> Output Console</span>
                </div>
              </div>
              <div className="p-6 h-[220px] overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2.5">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 select-none">
                    <Activity className="size-8 opacity-10 animate-pulse" />
                    <p className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-30">No active processes</p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="flex gap-4 border-b border-white/[0.03] pb-2.5 group">
                      <span className="text-slate-600 shrink-0 select-none opacity-50">[{log.time}]</span>
                      <span className={`shrink-0 font-bold ${log.type === 'success' ? 'text-emerald-500' : 'text-indigo-400'}`}>{log.type.toUpperCase()}</span>
                      <span className={log.type === 'success' ? 'text-emerald-50' : 'text-slate-300'}>{log.msg}</span>
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          </section>
        </div>

        <footer className="pt-10 pb-6 border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
            <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest items-center">
              <a href="/terms" className="hover:text-indigo-500 transition-colors flex items-center gap-1.5"><FileText className="size-3" /> Terms</a>
              <a href="/privacy" className="hover:text-indigo-500 transition-colors flex items-center gap-1.5"><ShieldCheck className="size-3" /> Privacy</a>
              <a href="https://github.com/LoveDoLove/ip6-arpa-dnsgen-autossl" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors flex items-center gap-1.5"><Github className="size-3" /> Repository</a>
              <span className="opacity-20">|</span>
              <span>Next.js 16</span>
              <span>Tailwind 4</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
              <span>Made with</span>
              <Heart className="size-3 text-rose-500 fill-rose-500" />
              <span>by </span>
              <a href="https://github.com/LoveDoLove" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors font-bold">LoveDoLove</a>
              <span className="mx-2 opacity-30">|</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}